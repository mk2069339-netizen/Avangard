// Bir martalik sozlash: Firebase Authentication (Email/Password) ni yoqish va Firestore qoidalarini qo'yish.
// GitHub Actions'da FIREBASE_SERVICE_ACCOUNT kaliti bilan ishga tushiriladi.
import { GoogleAuth } from 'google-auth-library'
import { readFileSync } from 'node:fs'

const ga = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/firebase'] })
const client = await ga.getClient()
const project = await ga.getProjectId()
const call = async (method, url, data) => {
  try {
    const r = await client.request({ method, url, data })
    return { ok: true, data: r.data }
  } catch (e) {
    return { ok: false, status: e.response?.status, msg: e.response?.data?.error?.message ?? e.message }
  }
}
console.log('Loyiha:', project)

// 1) Authentication
const IT = 'https://identitytoolkit.googleapis.com'
let cfg = await call('GET', `${IT}/admin/v2/projects/${project}/config`)
if (!cfg.ok) {
  console.log('Auth sozlamasi topilmadi:', cfg.status, cfg.msg, '→ ishga tushiriladi')
  const init = await call('POST', `${IT}/v2/projects/${project}/identityPlatform:initializeAuth`, {})
  console.log('initializeAuth:', init.ok ? 'OK' : `${init.status} ${init.msg}`)
}
const upd = await call('PATCH', `${IT}/admin/v2/projects/${project}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired`,
  { signIn: { email: { enabled: true, passwordRequired: true } } })
console.log('Email/Password kirish:', upd.ok ? 'YOQILDI' : `XATO ${upd.status} ${upd.msg}`)

// 2) Firestore qoidalari
const FR = 'https://firebaserules.googleapis.com/v1'
const content = readFileSync('firestore.rules', 'utf8')
const rs = await call('POST', `${FR}/projects/${project}/rulesets`, { source: { files: [{ name: 'firestore.rules', content }] } })
if (!rs.ok) {
  console.log('Qoidalar: XATO', rs.status, rs.msg)
} else {
  const release = `projects/${project}/releases/cloud.firestore`
  let rel = await call('PATCH', `${FR}/${release}`, { release: { name: release, rulesetName: rs.data.name } })
  if (!rel.ok && rel.status === 404) rel = await call('POST', `${FR}/projects/${project}/releases`, { name: release, rulesetName: rs.data.name })
  console.log('Firestore qoidalari:', rel.ok ? 'QO‘YILDI' : `XATO ${rel.status} ${rel.msg}`)
}
