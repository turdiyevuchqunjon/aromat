# AromaLux — Next.js sayt (Meta Pixel + CAPI + Telegram lidlar)

Bu loyiha aromalux.uz uslubidagi aroma-marketing sayti bo'lib, quyidagi funksiyalarni o'z ichiga oladi:

- Next.js 14 (App Router) + TypeScript + Tailwind
- Bosh sahifa: Hero, foyda kartalar, diffuzor katalogi, hid katalogi, biz haqimizda, lid formasi
- Forma to'ldirilganda: `/rahmat` sahifasiga o'tadi, 10 soniyadan keyin Telegram profilingizga yo'naltiradi
- Har bir lid: Telegram botga yuboriladi, xabar ichida **hashlangan (taxminlanmaydigan) shaxsiy havola** bo'ladi
- Havolani bossangiz `/admin/purchase/[token]` sahifasi ochiladi — u yerda to'lov summasini kiritasiz
- Summani kiritganingizda **Meta Conversions API (CAPI)** orqali **Purchase** eventi yuboriladi — mijozning saytga birinchi kelgan paytidagi `_fbp` / `_fbc` cookie va IP/User-Agent bilan, shu orqali Meta bu xaridni to'g'ri reklama/kampaniyaga bog'laydi va **ROAS** to'g'ri hisoblanadi
- Lid yuborilganda ham Pixel (brauzer) va CAPI (server) orqali bir xil `event_id` bilan **Lead** eventi yuboriladi — bu ikkalanishning (deduplication) oldini oladi va event match quality'ni oshiradi

## 1. Talab qilinadigan xizmatlar (bepul boshlash mumkin)

| Xizmat | Nima uchun | Qayerdan olinadi |
|---|---|---|
| Vercel | Saytni joylashtirish (hosting) | vercel.com |
| Upstash Redis | Lidlar va hashlangan linklarni saqlash | console.upstash.com — "Create Database" → "REST API" bo'limidan URL va TOKEN |
| Meta Pixel + CAPI token | Reklama tracking | business.facebook.com → Events Manager → Pixel → Settings (Pixel ID) va "Conversions API" → "Generate access token" |
| Telegram bot | Lidlar xabarini olish | @BotFather orqali `/newbot` — token beradi. Chat ID olish uchun botga bir marta yozing, so'ng `https://api.telegram.org/bot<TOKEN>/getUpdates` ochib `chat.id` ni ko'ring |

## 2. O'rnatish

```bash
npm install
cp .env.example .env.local
# .env.local faylini oching va barcha qiymatlarni to'ldiring
npm run dev
```

Sayt `http://localhost:3000` da ochiladi.

### `.env.local` da to'ldirish kerak bo'lgan asosiy qiymatlar

- `NEXT_PUBLIC_FB_PIXEL_ID`, `FB_CAPI_ACCESS_TOKEN` — Meta'dan
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — Telegram botdan
- `NEXT_PUBLIC_TELEGRAM_REDIRECT_USERNAME` — rahmat sahifasidan yo'naltiriladigan Telegram username (masalan sizning shaxsiy yoki bot username'ingiz, `@` belgisisiz)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — Upstash'dan
- `ADMIN_SECRET` — `/admin` sahifalariga kirish paroli, o'zingiz kuchli parol o'ylab toping
- `LEAD_LINK_SECRET` — tasodifiy uzun matn (masalan `openssl rand -hex 32` buyrug'i bilan generatsiya qiling)

## 3. Vercel'ga joylashtirish (deploy)

1. Bu papkani GitHub'ga yuklang (yoki `vercel` CLI orqali to'g'ridan-to'g'ri deploy qiling)
2. [vercel.com](https://vercel.com) da "New Project" → repo'ni tanlang
3. "Environment Variables" bo'limida yuqoridagi barcha `.env` qiymatlarini kiriting
4. Deploy tugmasini bosing
5. Bepul domen (`sizning-loyiha.vercel.app`) tayyor bo'ladi. O'z domeningizni (masalan `aromalux.uz`) ulash uchun Vercel loyihasida "Settings → Domains" bo'limidan foydalaning, keyin `NEXT_PUBLIC_SITE_URL` qiymatini shu domenga yangilab qayta deploy qiling

## 4. Ishlash tartibi (oqim)

1. Mijoz saytdagi formani to'ldiradi → `/rahmat` sahifasiga o'tadi → 10 soniyadan keyin Telegram'ga yo'naltiriladi
2. Lid ma'lumotlari (ism, tel, `_fbp`, `_fbc`, IP, User-Agent) Upstash Redis'da saqlanadi, shu bilan bir vaqtda Telegram botga xabar + hashlangan admin havola yuboriladi, Meta'ga "Lead" eventi ketadi
3. Siz mijoz bilan gaplashib, sotuv amalga oshsa — Telegram xabaridagi havolani bosasiz
4. `/admin` sahifasiga parol bilan kirasiz (birinchi marta `/admin/login`)
5. Lid tafsilotlarini ko'rasiz, to'lov summasini kiritasiz → tizim shu lidning saqlangan `_fbp`/`_fbc`/IP ma'lumotlari bilan Meta CAPI orqali "Purchase" eventini yuboradi
6. Meta Ads Manager'da bu xarid tegishli reklama/kampaniyaga bog'lanadi, ROAS to'g'ri hisoblanadi

## 5. Test qilish

Meta Events Manager → Test Events bo'limidan test kodini oling va `.env.local` dagi `FB_TEST_EVENT_CODE` ga qo'ying (faqat test uchun, productionga chiqarganda bo'sh qoldiring). Shundan so'ng saytda forma to'ldirib, Events Manager'da "Lead" va "Purchase" eventlari real vaqtda ko'rinishini tekshiring.

## 6. Kontent

Diffuzor va hid kataloglaridagi matnlar (`src/components/Products.tsx`, `src/components/Scents.tsx`), narxlar va telefon raqamlar — namuna sifatida yozilgan. Haqiqiy mahsulotlaringiz, narxlaringiz va kontakt ma'lumotlaringiz bilan almashtiring.
# aromat
