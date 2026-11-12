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
}

export const categories: Category[] = [
  { id: 'fridge', name: 'Muzlatgichlar', art: 'fridge', tint: '#E6F4FF' },
  { id: 'washer', name: 'Kir yuvish mashinalari', art: 'washer', tint: '#EEF0FF' },
  { id: 'tv', name: 'Televizorlar', art: 'tv', tint: '#F1EAFF' },
  { id: 'ac', name: 'Konditsionerlar', art: 'ac', tint: '#E5FBF6' },
  { id: 'vacuum', name: 'Changyutgichlar', art: 'vacuum', tint: '#FFF1E6' },
  { id: 'kitchen', name: 'Oshxona texnikasi', art: 'microwave', tint: '#FFEDEF' },
  { id: 'stove', name: 'Gaz plitalar', art: 'stove', tint: '#FFF6DB' },
  { id: 'small', name: 'Kichik texnika', art: 'kettle', tint: '#EAF7EA' },
  { id: 'phone', name: 'Smartfonlar', art: 'phone', tint: '#ECEEF5' },
  { id: 'laptop', name: 'Noutbuklar', art: 'laptop', tint: '#E8F1FF' },
  { id: 'climate', name: 'Isitgichlar', art: 'heater', tint: '#FFEDE3' },
  { id: 'dish', name: 'Idish yuvgichlar', art: 'dishwasher', tint: '#E9F8FF' },
]

const silver = { name: 'Kumush', hex: '#C9CCD3' }
const white = { name: 'Oq', hex: '#F7F7F9' }
const black = { name: 'Qora', hex: '#22232A' }
const beige = { name: 'Bej', hex: '#E9DCC6' }
const blue = { name: 'Moviy', hex: '#5C7CFA' }

const p = (x: Partial<Product> & Pick<Product, 'id' | 'title' | 'brand' | 'cat' | 'price' | 'art'>): Product => ({
  rating: 4.8,
  reviews: 120,
  orders: 800,
  colors: [white],
  specs: [],
  desc: '',
  stock: 25,
  ...x,
})

export const seedProducts: Product[] = [
  p({ id: 'f1', title: 'Muzlatgich Samsung RB38 No Frost, 385 L', brand: 'Samsung', cat: 'fridge', art: 'fridge', price: 8_490_000, oldPrice: 10_200_000, rating: 4.9, reviews: 1284, orders: 6200, colors: [silver, black, white], badges: ['hit', 'original'],
    specs: [['Hajmi', '385 L'], ['Tizim', 'Total No Frost'], ['Energiya sinfi', 'A++'], ['Shovqin', '35 dB'], ['O‘lchamlari', '59.5×65.8×203 sm'], ['Kafolat', '3 yil']],
    desc: 'Ikki kamerali muzlatgich: Digital Inverter kompressori 10 yil kafolatlangan, ko‘p tomonlama sovutish (All-Around Cooling) mahsulotlarni uzoq yangi saqlaydi.' }),
  p({ id: 'f2', title: 'Muzlatgich Artel HD 455 FWEN, inverter', brand: 'Artel', cat: 'fridge', art: 'fridge', price: 5_990_000, oldPrice: 6_900_000, rating: 4.7, reviews: 932, orders: 4100, colors: [beige, white, silver], badges: ['sale', 'fast'],
    specs: [['Hajmi', '350 L'], ['Tizim', 'No Frost'], ['Energiya sinfi', 'A+'], ['Kafolat', '3 yil']],
    desc: 'O‘zbekistonda ishlab chiqarilgan ishonchli muzlatgich. Elektron boshqaruv paneli, tez muzlatish rejimi.' }),
  p({ id: 'f3', title: 'Side-by-Side muzlatgich LG GC-B257, 694 L', brand: 'LG', cat: 'fridge', art: 'fridge', price: 21_500_000, oldPrice: 24_990_000, rating: 4.9, reviews: 211, orders: 640, colors: [black, silver], badges: ['original', 'new'],
    specs: [['Hajmi', '694 L'], ['Kompressor', 'Smart Inverter'], ['Wi‑Fi', 'ThinQ'], ['Kafolat', '10 yil kompressorga']],
    desc: 'Katta oila uchun premium muzlatgich. Door Cooling+ va Multi Air Flow texnologiyalari.' }),

  p({ id: 'w1', title: 'Kir yuvish mashinasi LG F2V5, 8 kg, bug‘ bilan', brand: 'LG', cat: 'washer', art: 'washer', price: 6_790_000, oldPrice: 7_990_000, rating: 4.9, reviews: 2140, orders: 9800, colors: [white, black], badges: ['hit', 'fast'],
    specs: [['Yuklash', '8 kg'], ['Siqish', '1200 ayl/min'], ['Motor', 'Inverter Direct Drive'], ['Rejimlar', '14 ta'], ['Bug‘', 'Steam+']],
    desc: 'AI DD texnologiyasi mato turini aniqlab, eng mos yuvish rejimini tanlaydi. Bug‘ bilan yuvish allergenlarni 99.9% yo‘qotadi.' }),
  p({ id: 'w2', title: 'Kir yuvish mashinasi Samsung WW70, 7 kg', brand: 'Samsung', cat: 'washer', art: 'washer', price: 4_890_000, oldPrice: 5_600_000, rating: 4.8, reviews: 1530, orders: 7300, colors: [white], badges: ['sale'],
    specs: [['Yuklash', '7 kg'], ['Siqish', '1400 ayl/min'], ['Texnologiya', 'Eco Bubble'], ['Energiya sinfi', 'A+++']],
    desc: 'Eco Bubble — sovuq suvda ham chuqur tozalash. Diamond baraban kiyimlarni asraydi.' }),
  p({ id: 'w3', title: 'Kir yuvish mashinasi Artel WF60, 6 kg', brand: 'Artel', cat: 'washer', art: 'washer', price: 3_190_000, rating: 4.6, reviews: 860, orders: 5200, colors: [white, silver], badges: ['fast'],
    specs: [['Yuklash', '6 kg'], ['Siqish', '1000 ayl/min'], ['Rejimlar', '15 ta']],
    desc: 'Ixcham va tejamkor. Bolalar kiyimi va jun uchun alohida rejimlar.' }),

  p({ id: 't1', title: 'Televizor Samsung 55" Crystal UHD 4K Smart', brand: 'Samsung', cat: 'tv', art: 'tv', price: 6_490_000, oldPrice: 8_100_000, rating: 4.9, reviews: 3020, orders: 12400, colors: [black], badges: ['hit', 'sale', 'original'],
    specs: [['Diagonal', '55" (139 sm)'], ['O‘lcham', '3840×2160 4K'], ['HDR', 'HDR10+'], ['Smart TV', 'Tizen'], ['Ovoz', '20 W']],
    desc: 'Crystal Processor 4K har bir kadrni yorqin va tiniq qiladi. YouTube, Netflix va boshqa ilovalar o‘rnatilgan.' }),
  p({ id: 't2', title: 'Televizor LG OLED 65" evo C4, 120 Hz', brand: 'LG', cat: 'tv', art: 'tv', price: 24_900_000, oldPrice: 29_500_000, rating: 5.0, reviews: 418, orders: 960, colors: [black], badges: ['new', 'original'],
    specs: [['Diagonal', '65"'], ['Matritsa', 'OLED evo'], ['Chastota', '120 Hz'], ['Protsessor', 'α9 Gen7 AI']],
    desc: 'Mukammal qora rang va cheksiz kontrast. O‘yinchilar uchun G‑Sync va 0.1 ms javob vaqti.' }),
  p({ id: 't3', title: 'Televizor Xiaomi TV A Pro 43" 4K Google TV', brand: 'Xiaomi', cat: 'tv', art: 'tv', price: 3_290_000, oldPrice: 3_900_000, rating: 4.7, reviews: 2210, orders: 8800, colors: [black], badges: ['fast'],
    specs: [['Diagonal', '43"'], ['O‘lcham', '4K UHD'], ['OS', 'Google TV'], ['Ovoz', 'Dolby Audio']],
    desc: 'Metall ramkasiz dizayn, ovozli boshqaruv va Chromecast o‘rnatilgan.' }),

  p({ id: 'a1', title: 'Konditsioner Artel Shahrisabz 12 Inverter', brand: 'Artel', cat: 'ac', art: 'ac', price: 4_290_000, oldPrice: 4_990_000, rating: 4.8, reviews: 1670, orders: 7600, colors: [white], badges: ['hit', 'fast'],
    specs: [['Maydon', '35 m² gacha'], ['Rejim', 'Sovutish / isitish'], ['Inverter', 'Ha'], ['Shovqin', '22 dB']],
    desc: '−15°C gacha isitish rejimida ishlaydi. Wi‑Fi orqali telefondan boshqarish.' }),
  p({ id: 'a2', title: 'Konditsioner Samsung WindFree 18, Wi‑Fi', brand: 'Samsung', cat: 'ac', art: 'ac', price: 9_800_000, oldPrice: 11_200_000, rating: 4.9, reviews: 340, orders: 1100, colors: [white], badges: ['original'],
    specs: [['Maydon', '50 m² gacha'], ['Texnologiya', 'WindFree'], ['Energiya sinfi', 'A+++']],
    desc: '23 000 mikroteshik orqali shamolsiz sovutish — sovuq havo to‘g‘ridan‑to‘g‘ri tushmaydi.' }),

  p({ id: 'v1', title: 'Robot changyutgich Xiaomi Robot Vacuum S20+', brand: 'Xiaomi', cat: 'vacuum', art: 'robot', price: 4_590_000, oldPrice: 5_490_000, rating: 4.8, reviews: 1890, orders: 6900, colors: [white, black], badges: ['hit', 'new'],
    specs: [['Tortish kuchi', '6000 Pa'], ['Nam tozalash', 'Ha, aylanuvchi mop'], ['Navigatsiya', 'LDS lazer'], ['Baza', 'Avto bo‘shatish']],
    desc: 'Uyni o‘zi tozalaydi, o‘zi yuvadi va changni o‘zi bo‘shatadi. Mi Home ilovasi orqali xonalar xaritasi.' }),
  p({ id: 'v2', title: 'Changyutgich Samsung Jet 75 simsiz', brand: 'Samsung', cat: 'vacuum', art: 'vacuum', price: 5_290_000, rating: 4.8, reviews: 512, orders: 2100, colors: [silver, blue],
    specs: [['Quvvat', '200 W'], ['Batareya', '60 daqiqa'], ['Filtr', 'HEPA 5 qatlamli']],
    desc: 'Yengil simsiz changyutgich: bir tugma bilan konteynerni bo‘shatish.' }),
  p({ id: 'v3', title: 'Changyutgich Artel VCC 0120, konteynerli', brand: 'Artel', cat: 'vacuum', art: 'vacuum', price: 990_000, oldPrice: 1_250_000, rating: 4.6, reviews: 2430, orders: 11800, colors: [blue, black], badges: ['sale', 'fast'],
    specs: [['Quvvat', '2000 W'], ['Konteyner', '2 L'], ['Filtr', 'HEPA']],
    desc: 'Arzon va kuchli. Ciklon tizimi qopsiz ishlaydi.' }),

  p({ id: 'k1', title: 'Mikroto‘lqinli pech LG MS2042, 20 L', brand: 'LG', cat: 'kitchen', art: 'microwave', price: 1_290_000, oldPrice: 1_490_000, rating: 4.8, reviews: 980, orders: 5400, colors: [white, black], badges: ['fast'],
    specs: [['Hajmi', '20 L'], ['Quvvat', '700 W'], ['Boshqaruv', 'Elektron']],
    desc: 'I‑Wave tizimi taomni bir tekis isitadi. EasyClean ichki qoplama.' }),
  p({ id: 'k2', title: 'Qahva mashinasi Philips 3200 LatteGo', brand: 'Philips', cat: 'kitchen', art: 'coffee', price: 7_900_000, oldPrice: 9_100_000, rating: 4.9, reviews: 260, orders: 870, colors: [black], badges: ['original', 'new'],
    specs: [['Ichimliklar', '5 tur'], ['Bosim', '15 bar'], ['Sut tizimi', 'LatteGo']],
    desc: 'Bir tugma bilan kapuchino va latte. Sut tizimi 10 soniyada yuviladi.' }),
  p({ id: 'k3', title: 'Blender Tefal Perfectmix+, 1200 W', brand: 'Tefal', cat: 'kitchen', art: 'blender', price: 1_590_000, rating: 4.7, reviews: 410, orders: 1900, colors: [black, silver],
    specs: [['Quvvat', '1200 W'], ['Idish', '2 L shisha'], ['Tezlik', '28 000 ayl/min']],
    desc: 'Smuzi, muzni maydalash va sho‘rvalar uchun 3 ta avtomatik dastur.' }),
  p({ id: 'd1', title: 'Idish yuvish mashinasi Bosch Serie 4, 13 komplekt', brand: 'Bosch', cat: 'dish', art: 'dishwasher', price: 7_390_000, oldPrice: 8_400_000, rating: 4.9, reviews: 300, orders: 1200, colors: [white, silver], badges: ['original'],
    specs: [['Sig‘im', '13 komplekt'], ['Shovqin', '44 dB'], ['Dasturlar', '6 ta']],
    desc: 'Suvni 60% gacha tejaydi. Home Connect orqali boshqarish.' }),

  p({ id: 's1', title: 'Gaz plita Hofmann 4 konforkali, duxovkali', brand: 'Hofmann', cat: 'stove', art: 'stove', price: 2_890_000, oldPrice: 3_300_000, rating: 4.7, reviews: 760, orders: 3900, colors: [white, black], badges: ['sale', 'fast'],
    specs: [['Konforkalar', '4 ta gaz'], ['Duxovka', '50 L'], ['Gaz nazorati', 'Ha']],
    desc: 'Emal qoplama, elektr yoqish va gaz nazorati tizimi xavfsizlikni ta‘minlaydi.' }),
  p({ id: 's2', title: 'Varochnaya panel Beko induksion, 60 sm', brand: 'Beko', cat: 'stove', art: 'stove', price: 4_190_000, rating: 4.8, reviews: 190, orders: 620, colors: [black], badges: ['new'],
    specs: [['Turi', 'Induksion'], ['Zonalar', '4 ta'], ['Taymer', 'Ha']],
    desc: 'Tez qizish va oson tozalanadigan shisha‑keramik sirt.' }),

  p({ id: 'sm1', title: 'Elektr choynak Xiaomi Mi Smart Kettle 2', brand: 'Xiaomi', cat: 'small', art: 'kettle', price: 449_000, oldPrice: 590_000, rating: 4.9, reviews: 4120, orders: 21000, colors: [white], badges: ['hit', 'sale'],
    specs: [['Hajmi', '1.7 L'], ['Quvvat', '1800 W'], ['Haroratni ushlab turish', '12 soat']],
    desc: 'Ilova orqali kerakli haroratni tanlang: 40°C dan 90°C gacha.' }),
  p({ id: 'sm2', title: 'Dazmol Philips 7000 bug‘li, 3000 W', brand: 'Philips', cat: 'small', art: 'iron', price: 990_000, rating: 4.8, reviews: 1120, orders: 4800, colors: [blue, white], badges: ['fast'],
    specs: [['Quvvat', '3000 W'], ['Bug‘', '55 g/min'], ['Taglik', 'SteamGlide Elite']],
    desc: 'OptimalTEMP — haroratni sozlamasdan barcha matolarni dazmollash.' }),

  p({ id: 'ph1', title: 'Smartfon Samsung Galaxy S25, 256 GB', brand: 'Samsung', cat: 'phone', art: 'phone', price: 11_990_000, oldPrice: 13_500_000, rating: 4.9, reviews: 2860, orders: 9200, colors: [black, blue, silver], badges: ['hit', 'original'],
    specs: [['Ekran', '6.2" Dynamic AMOLED 120 Hz'], ['Xotira', '12 / 256 GB'], ['Kamera', '50 + 12 + 10 MP'], ['Batareya', '4000 mAh']],
    desc: 'Galaxy AI bilan tarjima, fotosuratlarni tahrirlash va qidiruv yangi darajada.' }),
  p({ id: 'ph2', title: 'Smartfon Xiaomi Redmi Note 14 Pro, 256 GB', brand: 'Xiaomi', cat: 'phone', art: 'phone', price: 3_690_000, oldPrice: 4_290_000, rating: 4.8, reviews: 5340, orders: 26000, colors: [black, blue, white], badges: ['hit', 'sale', 'fast'],
    specs: [['Ekran', '6.67" AMOLED 120 Hz'], ['Xotira', '8 / 256 GB'], ['Kamera', '200 MP'], ['Zaryadlash', '45 W']],
    desc: '200 MP kamera va IP68 himoya. Kun bo‘yi yetadigan batareya.' }),
  p({ id: 'lp1', title: 'Noutbuk Lenovo IdeaPad Slim 5, Ryzen 7, 16 GB', brand: 'Lenovo', cat: 'laptop', art: 'laptop', price: 8_990_000, oldPrice: 10_400_000, rating: 4.8, reviews: 420, orders: 1500, colors: [silver], badges: ['new'],
    specs: [['Ekran', '14" OLED 2.8K'], ['Protsessor', 'AMD Ryzen 7'], ['Xotira', '16 GB / 512 GB SSD'], ['Og‘irligi', '1.46 kg']],
    desc: 'Ish va o‘qish uchun yengil va kuchli noutbuk, 12 soatgacha batareya.' }),
  p({ id: 'h1', title: 'Moyli isitgich Shivaki 11 seksiyali', brand: 'Shivaki', cat: 'climate', art: 'heater', price: 890_000, oldPrice: 1_090_000, rating: 4.7, reviews: 1340, orders: 6100, colors: [white], badges: ['sale', 'fast'],
    specs: [['Quvvat', '2500 W'], ['Seksiyalar', '11'], ['Maydon', '25 m²']],
    desc: 'Havoni quritmaydi, ag‘darilishdan himoya va termostat.' }),
  p({ id: 'h2', title: 'Fanli isitgich Midea NTH20, keramik', brand: 'Midea', cat: 'climate', art: 'heater', price: 520_000, rating: 4.6, reviews: 640, orders: 3300, colors: [white, black],
    specs: [['Quvvat', '2000 W'], ['Element', 'Keramik PTC']],
    desc: 'Bir necha soniyada xonani isitadi. Tebranish rejimi.' }),
]

export const brandsOf = (list: Product[]) => Array.from(new Set(list.map((x) => x.brand))).sort()

export const sampleReviews: Review[] = [
  { name: 'Dilnoza R.', rating: 5, date: '3 kun oldin', text: 'Ertasiga yetkazib berishdi, o‘rnatish ham bepul bo‘ldi. Sifati zo‘r, original ekan!' },
  { name: 'Jasur T.', rating: 5, date: '1 hafta oldin', text: 'Narxi juda qulay, kuryer o‘zi ko‘tarib chiqib o‘rnatib berdi. Rahmat Avangard!' },
  { name: 'Malika S.', rating: 4, date: '2 hafta oldin', text: 'Yaxshi mahsulot, faqat qutisi biroz ezilgan edi. Ishlashi a‘lo.' },
  { name: 'Sardor M.', rating: 5, date: '1 oy oldin', text: 'Narxi boshqa do‘konlardan arzonroq chiqdi. Kafolat taloni bilan berishdi.' },
]

export const discount = (pr: Product) => (pr.oldPrice ? Math.round((1 - pr.price / pr.oldPrice) * 100) : 0)
