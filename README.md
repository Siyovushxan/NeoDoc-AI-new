# NeoDoc AI — Mahsulot Yaratish Loyihasi

![NeoDoc AI](./public/logo.png)

> Sun'iy intellekt yordamida professional hujjatlar yaratishning eng tezkor usuli. 30 soniyada prezentatsiya, referat, kurs ishi yoki infografika yarating.

## 🚀 Loyiha Haqida

**NeoDoc AI** — O'zbekiston, Rossiya va ingliz tilida ta'lim olayotgan talabalar uchun AI-powered hujjat generatsiyoni platformasi.

### Asosiy Xususiyatlar

- ✨ **5 ta hujjat turi**: Prezentatsiya (PPTX), Referat, Kurs ishi, Mustaqil ta'lim, Infografika
- 🌍 **3 tilda**: O'zbek, Русский, English
- ⚡ **30 sekundda yaratiladi**: Juda tezkor generatsiya
- 🤖 **Google Gemini AI**: Professional sifatli matn
- 💰 **Bepul boshlanish**: 10 ta boshlang'ich kredit
- 🎨 **Zamonaviy dizayn**: Professional ko'rinish

## 📋 Texnik Stack

| Qatlam | Texnologiya |
| --- | --- |
| Frontend | Next.js 15, React 18, Tailwind CSS, Framer Motion |
| Backend | Firebase Cloud Functions |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| AI | Google Gemini 1.5 Pro |
| Document Gen | pptxgenjs, docx-js, Puppeteer |
| Auth | Firebase Authentication |
| Payments | Stripe, Click, Payme |
| Deployment | Vercel, Railway |

## 🛠️ Natomilyash O'rnatish

### Talablar

- Node.js 18+
- npm yoki yarn
- Firebase Account
- Google AI API Key

### O'rnatish

```bash
# Loyihani klonlash
cd neodoc-ai

# Bog'lanishlarni o'rnatish
npm install

# Environment variables ni o'rnatish
cp .env.example .env.local
# .env.local ni tahrirlang va API kalitlarini qo'shing

# Development serverini boshlang
npm run dev
```

Sahifa ochiladi: <http://localhost:3000>

## 📁 Loyiha Tuzilmasi

```tree
neodoc-ai/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Dashboard pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── header.tsx
│   ├── hero-section.tsx
│   ├── features-section.tsx
│   ├── pricing-section.tsx
│   └── footer.tsx
├── lib/                     # Utility functions
│   ├── firebase.ts          # Firebase config
│   ├── constants.ts         # Constants & translations
│   ├── ai.ts               # AI generation
│   ├── docx-generator.ts   # Word doc generation
│   ├── pptx-generator.ts   # PowerPoint generation
│   └── png-generator.ts    # Infographic generation
├── styles/                  # Global styles
└── public/                  # Static assets
```

## 🔑 Boshlang'ich O'rnatish

### 1. Firebase O'rnatish

```typescript
// Firebase loyiha yaratish
// 1. Firebase Console ga o'ting
// 2. Yangi loyiha yaratish
// 3. Web app qo'shing
// 4. Credentials nusxalash
```

### 2. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

GOOGLE_AI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Boshlanish

```bash
npm run dev
```

## 📚 API Endpointlar

### `POST /api/generate`

Hujjat generatsiyasi uchun asosiy endpoint.

**So'rov:**

```json
{
  "type": "referat",
  "topic": "Barqaror rivojlanish",
  "language": "uz",
  "additionalNotes": "Muayyan ma'lumot qo'shing"
}
```

**Javob:**

```json
{
  "success": true,
  "documentId": "abc123",
  "downloadUrl": "https://...",
  "fileName": "document.docx"
}
```

## 🎨 Rang Palitralari

| Nomi | Hex | Ishlatilish |
| --- | --- | --- |
| Primary | `#4F46E5` | CTA tugmalar |
| Primary Dark | `#3730A3` | Hover holat |
| Background | `#0F0F1A` | Sahifa foni |
| Surface | `#1A1A2E` | Card fonlari |
| Text Primary | `#F1F5F9` | Asosiy matn |
| Text Secondary | `#94A3B8` | Ikkinchi darajali |
| Success | `#10B981` | Muvaffaqiyat |
| Error | `#EF4444` | Xato |

## 🚀 Deployment

### Vercel'ga Deploy

```bash
# 1. Vercel CLI o'rnatish
npm install -g vercel

# 2. Deploy
vercel

# 3. Environment variables ni o'rnatish
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```

### Railway'ga Deploy (Puppeteer server uchun)

```bash
# Railway CLI o'rnatish
npm install -g railway

# Deploy
railway up
```

## 📅 Roadmap

- [x] Landing page dizayni
- [x] Firebase integratsiyasi
- [x] AI generation framework
- [ ] Referat generatsiyasi
- [ ] Presentation generatsiyasi
- [ ] Watermark tizimi
- [ ] Stripe integratsiyasi
- [ ] Production deployment

## 📝 Litsenziya

MIT License — batafsil uchun [LICENSE](./LICENSE) ni ko'ring.

## 👨‍💻 Kontribut

Ishtirok uchun marhamat! Pull request yuborishdan avval:

1. Fork qiling
2. Feature branch yaratish (`git checkout -b feature/amazing`)
3. O'zgarishlarni commit qiling (`git commit -am 'Add amazing feature'`)
4. Branch'ga push qiling (`git push origin feature/amazing`)
5. Pull Request ochish

## 📞 Aloqa

- Email: <info@neodocai.com>
- Website: <https://neodocai.com>
- Telegram: @neodocai

---

**Versiya:** 1.0.0  
**Oxirgi yangilanish:** May 2026
