export const som = (n: number) => `${Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ')} $`
export const plural = (n: number) => n.toLocaleString('ru-RU')
export const deliveryDate = (days = 1) => {
  const d = new Date(Date.now() + days * 864e5)
  const m = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
  return `${d.getDate()}-${m[d.getMonth()]}`
}
