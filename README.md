# Avangard

Maishiy texnika marketpleysi — mobil ilova (PWA), React + Vite + Tailwind CSS.

## Imkoniyatlar
- Bosh sahifa: qidiruv, stories, avtomatik bannerlar, kategoriyalar, «Kun chegirmalari» taymer bilan, xitlar, brendlar, tavsiyalar lentasi
- Katalog va kategoriya sahifalari: saralash, brend/narx/chegirma filtrlari (bottom sheet)
- Aqlli qidiruv: takliflar, oldingi qidiruvlar, ommabop so‘rovlar
- Mahsulot sahifasi: galereya, rang tanlash, 0% muddatli to‘lov kalkulyatori (3/6/12/24 oy), yetkazish/kafolat, xususiyatlar, sharhlar, o‘xshash mahsulotlar
- Savat: tanlash, miqdor, chegirma hisobi; Rasmiylashtirish: kuryer/punkt, karta/nasiya/naqd
- Buyurtmalar va holat kuzatuvi, Saralanganlar, Kabinet, Avangard Nasiya sahifasi
- Tungi rejim, ma’lumotlar qurilmada saqlanadi (localStorage)

## Ishga tushirish
```bash
npm install
npm run dev          # ishlab chiqish
npm run build        # dist/ — istalgan statik hostingga (GitHub Pages, Netlify, Vercel)
npm run build:single # dist-single/index.html — bitta fayl
```

Mahsulotlar ro‘yxati: `src/data/products.ts`. Logotip: `src/assets/logo.png`.
