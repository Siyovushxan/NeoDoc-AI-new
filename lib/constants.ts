// Language type
export type Language = 'uz' | 'ru' | 'en';

// Document types
export type DocumentType = 'presentation' | 'referat' | 'kurs_ishi' | 'mustaqil_talim' | 'infografika';

// User interface
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  credits: number;
  plan: 'free' | 'premium';
  createdAt: Date;
  lastActiveAt: Date;
}

// Document interface
export interface Document {
  id: string;
  userId: string;
  title: string;
  type: DocumentType;
  language: Language;
  status: 'generating' | 'ready' | 'failed';
  fileUrl?: string;
  fileName?: string;
  storagePath?: string; // Added storagePath
  fileSize?: number;
  pageCount?: number;
  createdAt: Date;
  expiresAt: Date;
}

// Translations
export const translations: Record<Language, Record<string, string>> = {
  uz: {
    // Header
    'header.features': 'Xususiyatlar',
    'header.pricing': 'Narxlar',
    'header.docs': 'Hujjatlar',
    'header.login': 'Kirish',
    'header.start': 'Bepul Boshlash',

    // Pricing
    'pricing.title': 'Oddiy Narxlash',
    'pricing.subtitle': 'Barcha tarif sifatli talab etadi va hech qanday yashirin xarajatlar yo\'q',
    'pricing.buy': 'Harid qilish',
    'pricing.subscribe': 'Obuna bo\'lish',

    // Hero
    'hero.title': 'Sun\'iy intellekt bilan professional hujjatlar',
    'hero.subtitle': '30 soniyada prezentatsiya, referat yoki infografika — tayyor formatda',
    'hero.cta-primary': 'Bepul Boshlash',
    'hero.cta-secondary': 'Namuna Ko\'rish',
    'hero.badge': '10 000+ hujjat yaratildi',
    'hero.stats.docs': 'Hujjatlar',
    'hero.stats.time': 'Tezlik',
    'hero.stats.langs': 'Tillarda',

    // Footer
    'footer.desc': 'Sun\'iy intellekt yordamida professional hujjatlar yaratishning eng oson usuli',
    'footer.links': 'Havolalar',
    'footer.product': 'Mahsulot',
    'footer.news': 'Yangiliklar',
    'footer.news-desc': 'Eng oxirgi yangiliklar uchun obuna bo\'ling',
    'footer.rights': 'Barcha huquqlar himoyalangan.',
    'footer.privacy': 'Maxfiylik siyosati',
    'footer.terms': 'Shartlar va qoidalar',
    'footer.contact': 'Aloqa',
    'footer.blog': 'Blog',
    'footer.api': 'API',
    'footer.guide': 'Qo\'llanma',

    // Features
    'features.presentation': 'Prezentatsiya',
    'features.presentation-desc': 'AI zamonaviy slaydlar tuzilmasini yaratadi — tayyor PPTX',
    'features.referat': 'Ilmiy referat',
    'features.referat-desc': '8 sahifali to\'liq ilmiy referat — kirish, boblar, xulosa, adabiyotlar',
    'features.kurs': 'Kurs ishi',
    'features.kurs-desc': '20 sahifali kurs ishi — mundarija, bo\'limlar, izohlar',
    'features.mustaqil': 'Must. ta\'lim ishi',
    'features.mustaqil-desc': '12 sahifali mustaqil ta\'lim ishi — standartlarga mos',
    'features.infografika': 'Infografika',
    'features.infografika-desc': 'Bir betlik vizual infografika rasmi — PNG formatida',
    'features.multilang': '3 tilda',
    'features.multilang-desc': 'O\'zbek, rus va ingliz tillarida yuqori sifatli matn',

    // Dashboard
    'dashboard.title': 'Mening Hujjatlarim',
    'dashboard.new-doc': 'Yangi Hujjat',
    'dashboard.topic': 'Mavzu',
    'dashboard.topic-placeholder': 'Masalan: Barqaror rivojlanish va ekologiya',
    'dashboard.history': 'Hujjatlar tarixi',
    'dashboard.filter_all': 'Barchasi',
    'dashboard.filter_pptx': 'PPTX (Prezentatsiya)',
    'dashboard.filter_docx': 'DOCX (Hujjatlar)',
    'dashboard.filter_png': 'PNG (Infografika)',
    'dashboard.type': 'Hujjat turi',
    'dashboard.language': 'Til',
    'dashboard.notes': 'Qo\'shimcha yo\'riqnoma',
    'dashboard.create': 'Yaratish',
    'dashboard.credits': 'Kreditlar',
    'dashboard.no-credits': 'Kreditlar yetarli emas',
    'dashboard.no-documents': 'Hali hujjatlar yo\'q. Birinchi hujjatni yarating!',

    // Auth
    'auth.login': 'Kirish',
    'auth.signup': 'Ro\'yxatdan o\'tish',
    'auth.email': 'Email',
    'auth.password': 'Parol',
    'auth.signin-google': 'Google orqali kirish',
    'auth.signin-email': 'Email orqali kirish',
    'auth.signup-email': 'Email orqali ro\'yxatdan o\'tish',

    // Common
    'common.loading': 'Yuklanmoqda...',
    'common.error': 'Xato',
    'common.success': 'Muvaffaqiyat',
    'common.cancel': 'Bekor qilish',
    'common.download': 'Yuklab olish',
    'common.delete': 'O\'chirish',
    'common.view': 'Ko\'rish',
  },
  ru: {
    // Header
    'header.features': 'Функции',
    'header.pricing': 'Цены',
    'header.docs': 'Документы',
    'header.login': 'Вход',
    'header.start': 'Начать бесплатно',

    // Pricing
    'pricing.title': 'Простые цены',
    'pricing.subtitle': 'Все тарифы прозрачны и не имеют скрытых комиссий',
    'pricing.buy': 'Купить',
    'pricing.subscribe': 'Подписаться',

    // Hero
    'hero.title': 'Профессиональные документы с помощью ИИ',
    'hero.subtitle': 'Презентация, реферат или инфографика за 30 секунд — готово к использованию',
    'hero.cta-primary': 'Начать бесплатно',
    'hero.cta-secondary': 'Посмотреть пример',
    'hero.badge': '10 000+ документов создано',
    'hero.stats.docs': 'Документов',
    'hero.stats.time': 'Скорость',
    'hero.stats.langs': 'Языках',

    // Footer
    'footer.desc': 'Самый простой способ создавать профессиональные документы с помощью ИИ',
    'footer.links': 'Ссылки',
    'footer.product': 'Продукт',
    'footer.news': 'Новости',
    'footer.news-desc': 'Подпишитесь на последние новости',
    'footer.rights': 'Все права защищены.',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия и положения',
    'footer.contact': 'Контакт',
    'footer.blog': 'Блог',
    'footer.api': 'API',
    'footer.guide': 'Руководство',

    // Features
    'features.presentation': 'Презентация',
    'features.presentation-desc': 'ИИ создает современные слайды — готовый PPTX',
    'features.referat': 'Научный реферат',
    'features.referat-desc': 'Полный научный реферат на 8 страниц — введение, главы, заключение',
    'features.kurs': 'Курсовая работа',
    'features.kurs-desc': 'Курсовая работа на 20 страниц — содержание, разделы, пояснения',
    'features.mustaqil': 'Самостоятельная работа',
    'features.mustaqil-desc': 'Самостоятельная работа на 12 страниц — соответствует стандартам',
    'features.infografika': 'Инфографика',
    'features.infografika-desc': 'Одностраничная визуальная инфографика — PNG формат',
    'features.multilang': '3 языка',
    'features.multilang-desc': 'Высокое качество текста на узбекском, русском и английском',

    // Dashboard
    'dashboard.title': 'Мои документы',
    'dashboard.new-doc': 'Новый документ',
    'dashboard.topic': 'Тема',
    'dashboard.topic-placeholder': 'Например: Устойчивое развитие и экология',
    'dashboard.history': 'История документов',
    'dashboard.filter_all': 'Все',
    'dashboard.filter_pptx': 'PPTX (Презентация)',
    'dashboard.filter_docx': 'DOCX (Документы)',
    'dashboard.filter_png': 'PNG (Инфографика)',
    'dashboard.type': 'Тип документа',
    'dashboard.language': 'Язык',
    'dashboard.notes': 'Дополнительные примечания',
    'dashboard.create': 'Создать',
    'dashboard.credits': 'Кредиты',
    'dashboard.no-credits': 'Недостаточно кредитов',
    'dashboard.no-documents': 'Документов пока нет. Создайте первый документ!',

    // Auth
    'auth.login': 'Вход',
    'auth.signup': 'Регистрация',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.signin-google': 'Вход через Google',
    'auth.signin-email': 'Вход по email',
    'auth.signup-email': 'Регистрация по email',

    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.cancel': 'Отмена',
    'common.download': 'Скачать',
    'common.delete': 'Удалить',
    'common.view': 'Просмотр',
  },
  en: {
    // Header
    'header.features': 'Features',
    'header.pricing': 'Pricing',
    'header.docs': 'Documents',
    'header.login': 'Login',
    'header.start': 'Start Free',

    // Pricing
    'pricing.title': 'Simple Pricing',
    'pricing.subtitle': 'All plans are transparent with no hidden costs',
    'pricing.buy': 'Buy Now',
    'pricing.subscribe': 'Subscribe',

    // Hero
    'hero.title': 'Professional documents with AI',
    'hero.subtitle': 'Presentation, essay, or infographic in 30 seconds — ready to use',
    'hero.cta-primary': 'Start Free',
    'hero.cta-secondary': 'View Example',
    'hero.badge': '10,000+ documents created',
    'hero.stats.docs': 'Documents',
    'hero.stats.time': 'Speed',
    'hero.stats.langs': 'Languages',

    // Footer
    'footer.desc': 'The easiest way to create professional documents with AI',
    'footer.links': 'Links',
    'footer.product': 'Product',
    'footer.news': 'Newsletter',
    'footer.news-desc': 'Subscribe for the latest news',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.contact': 'Contact',
    'footer.blog': 'Blog',
    'footer.api': 'API',
    'footer.guide': 'Guide',

    // Features
    'features.presentation': 'Presentation',
    'features.presentation-desc': 'AI creates modern slides — ready PPTX',
    'features.referat': 'Academic Essay',
    'features.referat-desc': 'Complete 8-page academic essay — intro, chapters, conclusion',
    'features.kurs': 'Term Paper',
    'features.kurs-desc': '20-page term paper — table of contents, sections, explanations',
    'features.mustaqil': 'Independent Work',
    'features.mustaqil-desc': '12-page independent work — meets standards',
    'features.infografika': 'Infographic',
    'features.infografika-desc': 'One-page visual infographic — PNG format',
    'features.multilang': '3 Languages',
    'features.multilang-desc': 'High-quality text in Uzbek, Russian, and English',

    // Dashboard
    'dashboard.title': 'My Documents',
    'dashboard.new-doc': 'New Document',
    'dashboard.topic': 'Topic',
    'dashboard.topic-placeholder': 'E.g: Sustainable Development and Ecology',
    'dashboard.history': 'Document History',
    'dashboard.filter_all': 'All',
    'dashboard.filter_pptx': 'PPTX (Presentation)',
    'dashboard.filter_docx': 'DOCX (Documents)',
    'dashboard.filter_png': 'PNG (Infographic)',
    'dashboard.type': 'Document Type',
    'dashboard.language': 'Language',
    'dashboard.notes': 'Additional Notes',
    'dashboard.create': 'Create',
    'dashboard.credits': 'Credits',
    'dashboard.no-credits': 'Insufficient credits',
    'dashboard.no-documents': 'No documents yet. Create your first one!',

    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin-google': 'Sign in with Google',
    'auth.signin-email': 'Sign in with Email',
    'auth.signup-email': 'Sign up with Email',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.download': 'Download',
    'common.delete': 'Delete',
    'common.view': 'View',
  },
};

// Get translation
export const t = (key: string, lang: Language = 'uz'): string => {
  return translations[lang][key as keyof typeof translations.uz] || key;
};
