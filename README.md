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
- **Admin paneli**: bosh sahifadagi logotipni 5 marta ketma-ket bosing, parol `2019`.
- **Boshliq paneli**: Admin panelidagi qalqon belgisini 5 marta bosing, parol `1988`.
- Ikkala panelda ham mahsulot qo'shish, tahrirlash, rasm yuklash, yashirish va o'chirish bor.
  Boshliq panelida qo'shimcha: hisobot, parollarni o'zgartirish, katalogni tiklash, xodimlar jurnali.

## Server (Firebase)
Ilova `avangard-447ad` Firebase loyihasiga ulangan (`src/firebase.ts`). Firestore'da:
`products` (mahsulotlar va rasmlar), `orders` (buyurtmalar), `settings/main` (parollar), `logs` (jurnal).
Baza bo'sh bo'lsa, birinchi ochilishda boshlang'ich katalog avtomatik yoziladi.

1. Firebase Console → Firestore Database → **Rules** bo'limiga `firestore.rules` faylidagi matnni qo'yib, **Publish** bosing.
2. Saytga joylash — **https://avangard.web.app**. GitHub Actions har bir push'da saytni avtomatik yangilaydi.
   Bir martalik sozlash:
   - Firebase Console → avangard-447ad loyihasi → ⚙️ Project settings → **Service accounts** → **Generate new private key** (JSON fayl yuklanadi).
   - GitHub → repozitoriy → Settings → Secrets and variables → Actions → **New repository secret**:
     nomi `FIREBASE_SERVICE_ACCOUNT`, qiymati — JSON faylning butun matni.
   - Actions → «Saytga joylash» → **Run workflow**.
   Qo'lda joylash: `npm run build && npx firebase-tools deploy --only hosting`.

> Diqqat: panellar hozircha faqat ilova ichidagi parol bilan himoyalangan, bazaga yozish esa ochiq.
> Haqiqiy savdodan oldin Firebase Authentication qo'shib, qoidalarni faqat admin hisoblariga cheklash kerak.

Namuna (serversiz) versiya: `npm run build:demo` → `dist-single/index.html`, hamma ma'lumot qurilmada saqlanadi.

Sinov uchun mahalliy emulyator: `VITE_FIRESTORE_EMULATOR=1 npm run dev` (emulyator 127.0.0.1:8080 da ishlashi kerak).
