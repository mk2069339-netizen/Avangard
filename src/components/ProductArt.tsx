import type { ArtKind, Product } from '../data/products'

interface Props {
  kind: ArtKind
  color?: string
  className?: string
}

/** Stilizatsiyalangan maishiy texnika illyustratsiyalari (rasm o‘rniga, offline ishlaydi). */
export default function ProductArt({ kind, color = '#F7F7F9', className = '' }: Props) {
  const dark = isDark(color)
  const body = color
  const edge = dark ? '#0d0e12' : '#cfd3dc'
  const shade = dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'
  const glass = '#1d2433'
  const accent = '#1f6977'
  const gid = `g-${kind}-${color.replace('#', '')}`

  const common = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity={dark ? 0.15 : 0.55} />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${gid}-s`} cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#000" stopOpacity=".22" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
  const floor = (w = 120, y = 186) => <ellipse cx="100" cy={y} rx={w / 2} ry="7" fill={`url(#${gid}-s)`} />
  const sheen = (x: number, y: number, w: number, h: number, r = 10) => (
    <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${gid})`} />
  )

  let el: React.ReactNode
  switch (kind) {
    case 'fridge':
      el = (<>
        {floor(90)}
        <rect x="58" y="14" width="84" height="170" rx="12" fill={body} stroke={edge} strokeWidth="2" />
        <line x1="58" y1="78" x2="142" y2="78" stroke={edge} strokeWidth="2" />
        <rect x="128" y="30" width="5" height="34" rx="2.5" fill={edge} />
        <rect x="128" y="92" width="5" height="50" rx="2.5" fill={edge} />
        <rect x="70" y="92" width="26" height="14" rx="3" fill={glass} />
        <circle cx="76" cy="99" r="2" fill="#5ee6ff" /><rect x="81" y="97" width="11" height="4" rx="2" fill="#5ee6ff" opacity=".7" />
        {sheen(60, 16, 34, 166, 11)}
      </>)
      break
    case 'washer':
    case 'dishwasher':
      el = (<>
        {floor(110)}
        <rect x="45" y="34" width="110" height="146" rx="14" fill={body} stroke={edge} strokeWidth="2" />
        <line x1="45" y1="62" x2="155" y2="62" stroke={edge} strokeWidth="2" />
        <rect x="56" y="43" width="30" height="10" rx="3" fill={glass} />
        <circle cx="132" cy="48" r="7" fill={shade} stroke={edge} strokeWidth="2" />
        <circle cx="112" cy="48" r="3" fill={accent} />
        {kind === 'washer' ? (<>
          <circle cx="100" cy="120" r="40" fill={edge} />
          <circle cx="100" cy="120" r="32" fill={glass} />
          <path d="M72 128c10-8 20 6 30-2s18 4 26-2v10a32 32 0 0 1-56 0z" fill="#3aa0b3" opacity=".55" />
          <circle cx="90" cy="108" r="8" fill="#fff" opacity=".12" />
        </>) : (<>
          <rect x="58" y="74" width="84" height="94" rx="6" fill={shade} />
          <rect x="88" y="78" width="24" height="5" rx="2.5" fill={edge} />
        </>)}
        {sheen(47, 36, 40, 142, 12)}
      </>)
      break
    case 'tv':
      el = (<>
        {floor(110)}
        <rect x="16" y="34" width="168" height="104" rx="8" fill="#16181f" />
        <rect x="21" y="39" width="158" height="94" rx="4" fill="url(#tvscr)" />
        <defs>
          <linearGradient id="tvscr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f6977" /><stop offset=".55" stopColor="#2fb3c6" /><stop offset="1" stopColor="#e5322f" />
          </linearGradient>
        </defs>
        <path d="M21 110c30-22 50 6 80-10s48-30 78-8v41H21z" fill="#0c3038" opacity=".45" />
        <circle cx="140" cy="66" r="12" fill="#fff" opacity=".35" />
        <rect x="88" y="138" width="24" height="30" fill="#2a2c34" />
        <rect x="58" y="166" width="84" height="8" rx="4" fill="#2a2c34" />
        <path d="M21 39h70L21 110z" fill="#fff" opacity=".07" />
      </>)
      break
    case 'ac':
      el = (<>
        {floor(150, 150)}
        <rect x="14" y="66" width="172" height="62" rx="20" fill={body} stroke={edge} strokeWidth="2" />
        <rect x="26" y="108" width="148" height="10" rx="5" fill={shade} />
        <rect x="140" y="78" width="26" height="9" rx="3" fill={glass} />
        <text x="146" y="85.5" fontSize="7" fill="#5ee6ff" fontFamily="monospace">22°</text>
        {sheen(16, 68, 90, 30, 18)}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${62 + i * 38} 138q-8 12 0 24t0 24`} stroke="#7cc7d4" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".7" />
        ))}
      </>)
      break
    case 'vacuum':
      el = (<>
        {floor(110)}
        <rect x="98" y="16" width="10" height="120" rx="5" fill={edge} transform="rotate(14 103 76)" />
        <rect x="104" y="12" width="26" height="14" rx="7" fill={glass} transform="rotate(14 117 19)" />
        <rect x="76" y="70" width="40" height="64" rx="16" fill={body} stroke={edge} strokeWidth="2" transform="rotate(14 96 102)" />
        <rect x="84" y="82" width="22" height="30" rx="8" fill="#9fd6df" opacity=".75" transform="rotate(14 95 97)" />
        <rect x="60" y="164" width="84" height="16" rx="8" fill={glass} />
        <rect x="86" y="138" width="9" height="30" rx="4" fill={edge} />
      </>)
      break
    case 'robot':
      el = (<>
        {floor(150, 150)}
        <ellipse cx="100" cy="128" rx="74" ry="22" fill={edge} />
        <ellipse cx="100" cy="118" rx="74" ry="24" fill={body} stroke={edge} strokeWidth="2" />
        <circle cx="100" cy="106" r="14" fill={glass} />
        <circle cx="100" cy="106" r="5" fill="#5ee6ff" />
        <path d="M44 120a56 16 0 0 0 112 0" stroke={shade} strokeWidth="5" fill="none" />
        <ellipse cx="74" cy="110" rx="22" ry="7" fill={`url(#${gid})`} />
      </>)
      break
    case 'microwave':
      el = (<>
        {floor(150, 160)}
        <rect x="18" y="58" width="164" height="100" rx="12" fill={body} stroke={edge} strokeWidth="2" />
        <rect x="30" y="70" width="104" height="76" rx="6" fill={glass} />
        <rect x="38" y="78" width="88" height="60" rx="4" fill="#2b3346" />
        <ellipse cx="82" cy="126" rx="30" ry="6" fill="#ffb020" opacity=".35" />
        <rect x="144" y="72" width="28" height="10" rx="3" fill={glass} />
        {[0, 1, 2].map((i) => <circle key={i} cx="158" cy={98 + i * 16} r="5" fill={shade} stroke={edge} strokeWidth="1.5" />)}
        {sheen(20, 60, 60, 40, 10)}
      </>)
      break
    case 'stove':
      el = (<>
        {floor(120)}
        <rect x="40" y="40" width="120" height="142" rx="10" fill={body} stroke={edge} strokeWidth="2" />
        <rect x="40" y="40" width="120" height="36" rx="10" fill={glass} />
        {[64, 88, 112, 136].map((x) => <circle key={x} cx={x} cy="58" r="8" fill="#e5322f" opacity=".75" />)}
        {[64, 88, 112, 136].map((x) => <circle key={`k${x}`} cx={x} cy="88" r="4" fill={edge} />)}
        <rect x="54" y="102" width="92" height="66" rx="6" fill={glass} />
        <rect x="70" y="106" width="60" height="4" rx="2" fill={edge} />
        <rect x="60" y="116" width="80" height="44" rx="4" fill="#ff8a00" opacity=".22" />
      </>)
      break
    case 'kettle':
      el = (<>
        {floor(100)}
        <rect x="50" y="170" width="96" height="12" rx="6" fill={glass} />
        <path d="M60 168 70 52h60l10 116z" fill={body} stroke={edge} strokeWidth="2" />
        <path d="M130 64c26 0 30 70 6 80" stroke={edge} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M70 52 50 40h28z" fill={body} stroke={edge} strokeWidth="2" />
        <rect x="74" y="42" width="52" height="12" rx="6" fill={edge} />
        <rect x="82" y="80" width="10" height="70" rx="5" fill="#7cc7d4" opacity=".7" />
        {sheen(64, 56, 20, 110, 6)}
      </>)
      break
    case 'blender':
      el = (<>
        {floor(90)}
        <path d="M66 30h68l-10 104H76z" fill="#cfeef3" opacity=".75" stroke={edge} strokeWidth="2" />
        <path d="M74 80h52l-4 54H78z" fill="#ff7a59" opacity=".7" />
        <rect x="62" y="24" width="76" height="12" rx="6" fill={glass} />
        <rect x="64" y="134" width="72" height="48" rx="12" fill={body} stroke={edge} strokeWidth="2" />
        <circle cx="100" cy="158" r="9" fill={shade} stroke={edge} strokeWidth="2" />
      </>)
      break
    case 'iron':
      el = (<>
        {floor(150, 160)}
        <path d="M24 150c10-50 60-74 140-72 10 0 16 8 14 18l-8 54z" fill={body} stroke={edge} strokeWidth="2" />
        <path d="M22 150h150v10H22z" fill="#c9ccd3" />
        <path d="M74 98c10-30 40-40 80-36" stroke={glass} strokeWidth="14" fill="none" strokeLinecap="round" />
        <circle cx="120" cy="120" r="9" fill={glass} />
      </>)
      break
    case 'coffee':
      el = (<>
        {floor(120)}
        <rect x="46" y="26" width="108" height="156" rx="14" fill={body} stroke={edge} strokeWidth="2" />
        <rect x="58" y="40" width="84" height="26" rx="6" fill="#262a35" />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={72 + i * 19} cy="53" r="5" fill={i === 0 ? '#ffb020' : '#5ee6ff'} opacity=".8" />)}
        <rect x="60" y="76" width="80" height="94" rx="6" fill="#16181f" />
        <rect x="88" y="78" width="24" height="16" rx="3" fill="#3a3f4c" />
        <path d="M84 132h32v24a8 8 0 0 1-8 8H92a8 8 0 0 1-8-8z" fill="#fff" />
        <rect x="84" y="132" width="32" height="7" fill="#8a5a3b" />
        <rect x="64" y="164" width="72" height="4" rx="2" fill="#3a3f4c" />
      </>)
      break
    case 'phone':
      el = (<>
        {floor(80)}
        <rect x="62" y="14" width="76" height="164" rx="16" fill={body} stroke={edge} strokeWidth="2" />
        <rect x="66" y="18" width="68" height="156" rx="13" fill="url(#phs)" />
        <defs>
          <linearGradient id="phs" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0c3038" /><stop offset=".6" stopColor="#1f6977" /><stop offset="1" stopColor="#e5322f" />
          </linearGradient>
        </defs>
        <rect x="92" y="23" width="16" height="5" rx="2.5" fill="#000" />
        <circle cx="100" cy="88" r="22" fill="#fff" opacity=".12" />
        <rect x="76" y="130" width="48" height="6" rx="3" fill="#fff" opacity=".3" />
        <rect x="84" y="142" width="32" height="5" rx="2.5" fill="#fff" opacity=".2" />
      </>)
      break
    case 'laptop':
      el = (<>
        {floor(170, 170)}
        <rect x="38" y="40" width="124" height="86" rx="7" fill="#1d2027" />
        <rect x="43" y="45" width="114" height="76" rx="3" fill="url(#lps)" />
        <defs>
          <linearGradient id="lps" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2fb3c6" /><stop offset="1" stopColor="#0c3038" />
          </linearGradient>
        </defs>
        <path d="M43 121 120 45h37z" fill="#fff" opacity=".06" />
        <path d="M22 132h156l-8 18H30z" fill={body} stroke={edge} strokeWidth="2" />
        <rect x="88" y="134" width="24" height="4" rx="2" fill={edge} />
      </>)
      break
    case 'heater':
      el = (<>
        {floor(130)}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={36 + i * 18} y="44" width="16" height="124" rx="8" fill={body} stroke={edge} strokeWidth="2" />
        ))}
        <rect x="30" y="168" width="140" height="8" rx="4" fill={edge} />
        <circle cx="160" cy="58" r="7" fill="#e5322f" opacity=".8" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${70 + i * 30} 36q-6-8 0-16t0-14`} stroke="#ff8a00" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".55" />
        ))}
      </>)
      break
  }

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true">
      {common}
      {el}
    </svg>
  )
}

function isDark(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return 0.299 * r + 0.587 * g + 0.114 * b < 110
}

/** Mahsulot surati: admin yuklagan rasm bo‘lsa — rasm, aks holda illyustratsiya. */
export function ProductImage({ p, color, className = '' }: { p: Pick<Product, 'art' | 'image' | 'colors' | 'title'>; color?: number; className?: string }) {
  if (p.image) return <img src={p.image} alt={p.title} loading="lazy" draggable={false} className={`${className} rounded-xl object-contain`} />
  return <ProductArt kind={p.art} color={p.colors[color ?? 0]?.hex ?? p.colors[0]?.hex} className={className} />
}
