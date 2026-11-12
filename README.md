# Avangard

Maishiy texnika marketpleysi — mobil ilova (PWA), React + Vite + Tailwind CSS.

## Imkoniyatlar
- Bosh sahifa: qidiruv, stories, avtomatik bannerlar, kategoriyalar, «Kun chegirmalari» taymer bilan, xitlar, brendlar, tavsiyalar lentasi
- Katalog va kategoriya sahifalari: saralash, brend/narx/chegirma filtrlari (bottom sheet)
- Aqlli qidiruv: takliflar, oldingi qidiruvlar, ommabop so‘rovlar
- Mahsulot sahifasi: galereya, rang tanlash, yetkazish/kafolat, xususiyatlar, sharhlar, o‘xshash mahsulotlar
- Savat: tanlash, miqdor, chegirma hisobi; Rasmiylashtirish: kuryer/punkt, karta yoki naqd
- Buyurtmalar va holat kuzatuvi, Saralanganlar, Kabinet
- Tungi rejim, ma’lumotlar qurilmada saqlanadi (localStorage)

## Ishga tushirish
```bash
npm install
npm run dev          # ishlab chiqish
npm run build        # dist/ — istalgan statik hostingga (GitHub Pages, Netlify, Vercel)
npm run build:single # dist-single/index.html — bitta fayl
```

Mahsulotlar ro‘yxati: `src/data/products.ts`. Logotip: `src/assets/logo.png`.

## Admin va Boshliq panellari
- **Admin paneli** — bosh sahifadagi logotipni 5 marta ketma-ket bosing, parol: `2019`.
  Buyurtmalar (holatini o‘zgartirish, mijoz ma’lumotlari) va mahsulotlar (qo‘shish, narx/chegirma/qoldiqni tahrirlash, yashirish, o‘chirish).
- **Boshliq paneli** — Admin panelidagi admin belgisini (qalqon) 5 marta bosing, parol: `1988`.
  Hisobot (tushum, buyurtmalar, o‘rtacha chek, top mahsulotlar, kategoriyalar, ombor), buyurtmalar, parollarni o‘zgartirish, katalogni tiklash, xodimlar harakatlari jurnali.

> Diqqat: hozircha server yo‘q — ma’lumotlar va parollar har bir qurilmaning o‘zida saqlanadi. Haqiqiy do‘kon uchun backend (server + ma’lumotlar bazasi) kerak.
