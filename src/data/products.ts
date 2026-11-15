export type ArtKind =
  | 'fridge' | 'washer' | 'tv' | 'ac' | 'vacuum' | 'microwave' | 'stove'
  | 'kettle' | 'blender' | 'iron' | 'coffee' | 'phone' | 'laptop' | 'heater' | 'dishwasher' | 'robot'

export interface Category {
  id: string
  name: string
  art: ArtKind
  tint: string
}

export interface Review {
  name: string
  rating: number
  date: string
  text: string
}

export interface Product {
  id: string
  title: string
  brand: string
  cat: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  orders: number
  art: ArtKind
  colors: { name: string; hex: string }[]
  badges?: ('hit' | 'new' | 'sale' | 'fast' | 'original')[]
  specs: [string, string][]
  desc: string
  stock: number
  hidden?: boolean
  /** Admin yuklagan surat (siqilgan JPEG, data URL) */
  image?: string
  createdAt?: number
}

export const categories: Category[] = [
  { id: 'fridge', name: 'Muzlatgich va vitrinalar', art: 'fridge', tint: '#E6F4FF' },
  { id: 'washer', name: 'Kir yuvish mashinalari', art: 'washer', tint: '#EEF0FF' },
  { id: 'tv', name: 'Televizorlar', art: 'tv', tint: '#F1EAFF' },
  { id: 'ac', name: 'Konditsionerlar', art: 'ac', tint: '#E5FBF6' },
  { id: 'vacuum', name: 'Changyutgichlar', art: 'vacuum', tint: '#FFF1E6' },
  { id: 'kitchen', name: 'Oshxona texnikasi', art: 'microwave', tint: '#FFEDEF' },
  { id: 'stove', name: 'Plita va duxovkalar', art: 'stove', tint: '#FFF6DB' },
  { id: 'small', name: 'Kulerlar', art: 'kettle', tint: '#EAF7EA' },
  { id: 'laptop', name: 'Noutbuklar', art: 'laptop', tint: '#E8F1FF' },
  { id: 'office', name: 'Ofis texnikasi', art: 'laptop', tint: '#ECEEF5' },
  { id: 'sport', name: 'Sport jihozlari', art: 'robot', tint: '#FFEDE3' },
  { id: 'home', name: 'Uy-ro‘zg‘or', art: 'iron', tint: '#E9F8FF' },
]

const p = (x: Partial<Product> & Pick<Product, 'id' | 'title' | 'brand' | 'cat' | 'price' | 'art'>): Product => ({
  rating: 0,
  reviews: 0,
  orders: 0,
  colors: [{ name: 'Standart', hex: '#F7F7F9' }],
  specs: [],
  desc: '',
  stock: 10,
  ...x,
})

const img = (name: string) => `products/${name}.jpg`

/** Do'konning haqiqiy mahsulotlari (narxlar AQSh dollarida). */
export const seedProducts: Product[] = [
  p({ id: 'av-lsc600', title: 'AVANGARD LSC-600 vitrina muzlatgich 400 litr', brand: 'Avangard', cat: 'fridge', art: 'fridge', price: 399, image: img('avangard-lsc600-vitrina'),
    specs: [['Model', 'LSC-600'], ['Sovutish kamerasi', '400 L'], ['O‘lchamlari', '600×600×2060 mm'], ['Kafolat', '3 yil']],
    desc: 'Gulli dizayndagi vitrina muzlatgich. Hajmi: 600×600×2060 mm. 3 yil kafolat.' }),
  p({ id: '7tech-1098', title: '7 TECH 7FR4S1098WS2 sandiq muzlatkich, −42 dan +10 gacha', brand: '7 Tech', cat: 'fridge', art: 'fridge', price: 880, image: img('7tech-1098-muzlatkich'),
    specs: [['Model', '7FR4S1098WS2'], ['Hajmi', '1098 L'], ['Harorat', '−42°C … +10°C'], ['Qopqoqlar', '2 ta'], ['Kompressorlar', '2 ta'], ['O‘lchamlari', '2500×900×860 mm'], ['Freon', 'R290'], ['Kafolat', '3 yil']],
    desc: 'Oq rang, 2 ta qopqoqli, 2 ta kompressorli. Hajmi: 2500×900×860. −42 dan +10 gacha haroratda ishlaydi. 3 yil kafolat.' }),
  p({ id: 'av-80hxlb', title: 'AVANGARD AV-80 HXLB G 8 kg Steam BLDC inverter kir yuvish mashinasi', brand: 'Avangard', cat: 'washer', art: 'washer', price: 220, image: img('avangard-av80-kir-yuvish'),
    specs: [['Model', 'AV-80 HXLB'], ['Yuklash', '8 kg'], ['Siqish', '1200 ayl/daq'], ['Bug‘ bilan yuvish', 'Steam wash'], ['Motor', 'Inverter BLDC'], ['Kafolat', 'Motorga 10 yil, mashinaga 3 yil']],
    desc: 'Mokriy rang, 1200 aylanish. Motoriga 10 yil, o‘ziga 3 yil kafolat.' }),
  p({ id: 'zakiy-50tv', title: 'ZAKIY 50" Android TV, ovozli boshqaruv', brand: 'Zakiy', cat: 'tv', art: 'tv', price: 235, image: img('zakiy-50-tv'),
    specs: [['Model', '50 ZAKIY GOLOS'], ['Diagonal', '50"'], ['Smart TV', 'Android'], ['Ulanish', 'HDMI, USB'], ['Ovozli yordamchi', 'Bor'], ['Kafolat', '1 yil']] }),
  p({ id: 'ziffler-12inv', title: 'ZIFFLER 12 inverter konditsioner + TEN, katta fen + agregat', brand: 'Ziffler', cat: 'ac', art: 'ac', price: 275, image: img('ziffler-12-konditsioner'),
    specs: [['Model', 'BAC-M12AW Inverter'], ['Maydon', '35 m²'], ['Kuchlanish', '150–265 V'], ['Motor', 'Inverter'], ['Isitish', 'TEN'], ['Kafolat', '3 yil']] }),
  p({ id: 'av-2004', title: 'AVANGARD AV-2004 changyutgich 2000 W', brand: 'Avangard', cat: 'vacuum', art: 'vacuum', price: 59, image: img('avangard-av2004-changyutgich'),
    specs: [['Model', 'AV-2004'], ['Quvvat', '2000 W'], ['So‘rish quvvati', '400 W'], ['Kafolat', '3 yil']] }),
  p({ id: 'lg-vc83109', title: 'LG VC83109HQ changyutgich 2000 W, kompressor', brand: 'LG', cat: 'vacuum', art: 'vacuum', price: 195, image: img('lg-vc83109-changyutgich'),
    specs: [['Model', 'VC83109HTQ'], ['Quvvat', '2000 W'], ['So‘rish quvvati', '420 W'], ['Rang', 'Kulrang'], ['Kafolat', '3 yil']],
    desc: 'Kulrang, 2000 W, kompressor. 3 yil kafolat.' }),
  p({ id: 'ziffler-nobile', title: 'ZIFFLER NOBILE kofe mashina', brand: 'Ziffler', cat: 'kitchen', art: 'coffee', price: 345, image: img('ziffler-nobile-kofe'),
    specs: [['Model', 'NOBILE'], ['Suv baki', '1000 ml'], ['Sut baki', '600 ml'], ['Avtomatik dasturlar', '10 ta'], ['Boshqaruv', 'Sensorli'], ['Kafolat', '12 oy']],
    desc: 'Qora, sensorli, avto tozalash, muzdek qahva, ikki hissa quyish.' }),
  p({ id: 'mega-chopper', title: 'MEGA UMB-260 chopper (maydalagich)', brand: 'Mega', cat: 'kitchen', art: 'blender', price: 34, image: img('mega-chopper'),
    specs: [['Model', 'MCU-260'], ['Hajmi', '3000 ml'], ['Quvvat', '1000 W'], ['Idish', 'Shisha'], ['Tezliklar', '1 ta'], ['Kafolat', '12 oy']] }),
  p({ id: 'bq-gr3007', title: 'BQ GR3007 elektr gril 2000 W', brand: 'BQ', cat: 'kitchen', art: 'microwave', price: 48, image: img('bq-gr3007-gril'),
    specs: [['Model', 'GR3007'], ['Quvvat', '2200 W']] }),
  p({ id: 'hantaji-htj606', title: 'HANTAJI HTJ-606 sokovyjimalka 1000 W', brand: 'Hantaji', cat: 'kitchen', art: 'blender', price: 0, hidden: true, image: img('hantaji-htj606-sokovyjimalka'),
    specs: [['Model', 'HTJ-606'], ['Hajmi', '500 ml'], ['Quvvat', '1000 W'], ['Stakanlar', '2 ta'], ['Tezliklar', '2 ta'], ['Kafolat', '12 oy']],
    desc: 'Narxi kiritilmagan — Admin panelida narxini yozib, do‘konda ko‘rsating.' }),
  p({ id: 'ideal-l600', title: 'IDEAL L-600 ECO 4 konforkali elektr plita', brand: 'Ideal', cat: 'stove', art: 'stove', price: 155, image: img('ideal-l600-plita'),
    specs: [['Model', 'L-600 ECO'], ['Konforkalar', '4 ta elektr'], ['Duxovka', 'To‘liq elektr'], ['Taymer', 'Bor'], ['Kafolat', '3 yil']],
    desc: 'Tepasida 4 ta elektr plita, duxovka to‘liq elektr. 3 yil kafolat.' }),
  p({ id: 'ziffler-bio-l60', title: 'ZIFFLER BIO-L60-F5 BG o‘rnatma duxovka, qora', brand: 'Ziffler', cat: 'stove', art: 'stove', price: 165, image: img('ziffler-bio-l60-duxovka'),
    specs: [['Model', 'BIO-L60-F5 BG'], ['Hajmi', '60 L'], ['Harorat', '50–250°C'], ['Lampa', 'Bor'], ['Rang', 'Qora']] }),
  p({ id: 'hantaji-h111', title: 'HANTAJI H-111 sensorli kuler', brand: 'Hantaji', cat: 'small', art: 'kettle', price: 115, image: img('hantaji-h111-kuller'),
    specs: [['Model', 'H-111'], ['Rejimlar', '3 ta'], ['Sovuq suv', '10°C'], ['Issiq suv', '100°C'], ['Boshqaruv', 'Sensor va pult'], ['Bochka', 'Pastdan qo‘yiladi'], ['Kafolat', '1 yil']],
    desc: 'Kulrang, 3 talik, −5 dan +95 gacha. 1 yil kafolat.' }),
  p({ id: 'asus-x1504va', title: 'ASUS Vivobook Core i5 X1504VA 8/512 SSD', brand: 'Asus', cat: 'laptop', art: 'laptop', price: 575, image: img('asus-vivobook-x1504va'),
    specs: [['Protsessor', 'Intel Core 5 120U'], ['Operativ xotira', '8 GB'], ['Xotira', '512 GB SSD'], ['Ekran', '15.6" IPS']],
    desc: '13-avlod protsessor. Ofis va masofaviy ishchilar, mobilograflar, rasmlar bilan ishlash, dasturchilar uchun.' }),
  p({ id: 'epson-l3210', title: 'EPSON L-3210 rangli printer 3 in 1', brand: 'Epson', cat: 'office', art: 'laptop', price: 192, image: img('epson-l3210-printer'),
    specs: [['Model', 'L-3210'], ['Imkoniyatlar', 'Rangli bosma, foto, skaner, nusxa']] }),
  p({ id: 'weirong', title: 'WEIRONG pul sanagich', brand: 'Weirong', cat: 'office', art: 'laptop', price: 75, image: img('weirong-pul-sanagich') }),
  p({ id: 'dreamfit-df102e', title: 'DREAMFIT DF-102E velo-lyja, 110 kg gacha', brand: 'Dreamfit', cat: 'sport', art: 'robot', price: 185, image: img('dreamfit-df102e'),
    specs: [['Model', 'DF-102E'], ['Yuklama darajasi', '8 ta'], ['Maks. vazn', '110 kg'], ['Maxovik', '5 kg'], ['Ekran', 'LED'], ['Kafolat', '1 yil']] }),
  p({ id: 'haley-sushilka', title: 'HALEY zanglamas kiyim quritgich (sushilka)', brand: 'Haley', cat: 'home', art: 'iron', price: 13, image: img('haley-sushilka'),
    desc: 'O‘zbekistonda ishlab chiqarilgan.' }),
  p({ id: 'hitachi-wtp100', title: 'HITACHI WT-P100 GX2 suv nasosi', brand: 'Hitachi', cat: 'home', art: 'kettle', price: 65, image: img('hitachi-wtp100-nasos'),
    specs: [['Model', 'WT-P100 GX2'], ['So‘rish chuqurligi', '8 m'], ['Ko‘tarish balandligi', '12 m'], ['Ishlab chiqarilgan', 'Tailand'], ['Kafolat', '1 yil']],
    desc: 'Tailandda ishlab chiqarilgan. 1 yil kafolat.' }),
]

export const brandsOf = (list: Product[]) => Array.from(new Set(list.map((x) => x.brand))).sort()

export const sampleReviews: Review[] = [
  { name: 'Dilnoza R.', rating: 5, date: '3 kun oldin', text: 'Ertasiga yetkazib berishdi, o‘rnatish ham bepul bo‘ldi. Sifati zo‘r, original ekan!' },
  { name: 'Jasur T.', rating: 5, date: '1 hafta oldin', text: 'Narxi juda qulay, kuryer o‘zi ko‘tarib chiqib o‘rnatib berdi. Rahmat Avangard!' },
  { name: 'Malika S.', rating: 4, date: '2 hafta oldin', text: 'Yaxshi mahsulot, faqat qutisi biroz ezilgan edi. Ishlashi a‘lo.' },
  { name: 'Sardor M.', rating: 5, date: '1 oy oldin', text: 'Narxi boshqa do‘konlardan arzonroq chiqdi. Kafolat taloni bilan berishdi.' },
]

export const discount = (pr: Product) => (pr.oldPrice ? Math.round((1 - pr.price / pr.oldPrice) * 100) : 0)
