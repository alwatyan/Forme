/**
 * Fills an empty database with an admin account, categories and a few sample products so the shop can be
 * previewed. Run with `npm run seed`. Sample products are marked "[Sample]" and can be deleted in /admin.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

const payload = await getPayload({ config })

const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
const password = process.env.SEED_ADMIN_PASSWORD || 'change-me-now'

const { totalDocs: users } = await payload.count({ collection: 'users' })
if (!users) {
  await payload.create({ collection: 'users', data: { email, password, name: 'Store admin' } })
  payload.logger.info(`Created admin ${email}`)
}

const { totalDocs: existing } = await payload.count({ collection: 'products' })
if (existing) {
  payload.logger.info('Products already exist, skipping sample data')
  process.exit(0)
}

async function placeholder(name: string, top: string, bottom: string, width = 900, height = 1200) {
  // A soft gradient with a simple figure, standing in for real product photography.
  const cx = width / 2
  const unit = Math.min(width, height * 0.75) / 900
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
    <g transform="translate(${cx} ${height * 0.12}) scale(${unit * (height / 1200) * 1.1})">
      <ellipse cx="0" cy="190" rx="70" ry="86" fill="rgba(255,255,255,0.35)"/>
      <path d="M-120 330 Q0 280 120 330 L190 940 Q0 980 -190 940 Z" fill="rgba(255,255,255,0.28)"/>
    </g>
  </svg>`
  const data = await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
  return payload.create({
    collection: 'media',
    data: { alt: name },
    file: {
      data,
      mimetype: 'image/jpeg',
      name: `${name.toLowerCase().replace(/\W+/g, '-')}.jpg`,
      size: data.length,
    },
  })
}

type Cat = { en: string; ar: string; brand: 'forme' | 'siena'; colors: [string, string] }
const categoryDefs: Cat[] = [
  { en: 'Darra’a', ar: 'دراعات', brand: 'forme', colors: ['#d9cfc4', '#a8957f'] },
  { en: 'Kaftans', ar: 'قفاطين', brand: 'forme', colors: ['#3a3735', '#141312'] },
  { en: 'Leggings', ar: 'ليقنز', brand: 'siena', colors: ['#8e7965', '#4f4337'] },
  { en: 'Sports bras', ar: 'حمالات رياضية', brand: 'siena', colors: ['#e6d9ca', '#b89f86'] },
  { en: 'Sets', ar: 'أطقم', brand: 'siena', colors: ['#cdb59c', '#76624f'] },
]
const categories: Record<string, number> = {}
for (const [i, c] of categoryDefs.entries()) {
  const doc = await payload.create({
    collection: 'categories',
    locale: 'en',
    data: {
      name: c.en,
      brand: c.brand,
      sortOrder: i,
      image: (await placeholder(c.en, ...c.colors)).id,
    },
  })
  await payload.update({ collection: 'categories', id: doc.id, locale: 'ar', data: { name: c.ar } })
  categories[c.en] = doc.id
}

type Sample = {
  en: string
  ar: string
  brand: 'forme' | 'siena'
  category: string
  price: number
  compareAtPrice?: number
  colors: [string, string][]
  sizes: string[]
  featured?: boolean
}
const samples: Sample[] = [
  {
    en: 'Noor Darra’a',
    ar: 'دراعة نور',
    brand: 'forme',
    category: 'Darra’a',
    price: 38,
    colors: [
      ['#d9cfc4', '#b9a998'],
      ['#cbbfb1', '#a8957f'],
    ],
    sizes: ['52', '54', '56', '58'],
    featured: true,
  },
  {
    en: 'Layal Darra’a',
    ar: 'دراعة ليال',
    brand: 'forme',
    category: 'Darra’a',
    price: 45,
    colors: [
      ['#2b2b2b', '#111111'],
      ['#3a3735', '#1c1a19'],
    ],
    sizes: ['52', '54', '56'],
    featured: true,
  },
  {
    en: 'Reem Kaftan',
    ar: 'قفطان ريم',
    brand: 'forme',
    category: 'Kaftans',
    price: 52,
    compareAtPrice: 65,
    colors: [
      ['#e8e1d6', '#cfc3b2'],
      ['#ddd3c5', '#bfb19e'],
    ],
    sizes: ['One size'],
    featured: true,
  },
  {
    en: 'Dana Kaftan',
    ar: 'قفطان دانة',
    brand: 'forme',
    category: 'Kaftans',
    price: 48,
    colors: [
      ['#b8a48f', '#8d7863'],
      ['#a99580', '#7d6a57'],
    ],
    sizes: ['S/M', 'L/XL'],
    featured: true,
  },
  {
    en: 'Sculpt Legging',
    ar: 'ليقنز سكلبت',
    brand: 'siena',
    category: 'Leggings',
    price: 18,
    colors: [
      ['#6b5a4a', '#4f4337'],
      ['#5e4f41', '#43392f'],
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    featured: true,
  },
  {
    en: 'Flow Bra',
    ar: 'حمالة فلو',
    brand: 'siena',
    category: 'Sports bras',
    price: 12,
    colors: [
      ['#d8c3ad', '#b89f86'],
      ['#cdb59c', '#a88e74'],
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    featured: true,
  },
  {
    en: 'Studio Set',
    ar: 'طقم ستوديو',
    brand: 'siena',
    category: 'Sets',
    price: 29,
    colors: [
      ['#efe5d9', '#d6c6b3'],
      ['#e6d9ca', '#cbb8a2'],
    ],
    sizes: ['S', 'M', 'L'],
    featured: true,
  },
  {
    en: 'Pace Legging',
    ar: 'ليقنز بيس',
    brand: 'siena',
    category: 'Leggings',
    price: 17,
    colors: [
      ['#9a8571', '#76624f'],
      ['#8e7965', '#6a5745'],
    ],
    sizes: ['XS', 'S', 'M'],
    featured: true,
  },
]

for (const s of samples) {
  const images = []
  for (const [i, [top, bottom]] of s.colors.entries())
    images.push((await placeholder(`${s.en} ${i + 1}`, top, bottom)).id)
  const doc = await payload.create({
    collection: 'products',
    locale: 'en',
    data: {
      name: `[Sample] ${s.en}`,
      slug: s.en,
      brand: s.brand,
      category: categories[s.category],
      price: s.price,
      compareAtPrice: s.compareAtPrice,
      images,
      featured: s.featured,
      status: 'active',
      sizes: s.sizes.map((size) => ({ size, stock: 5 })),
      description:
        'A sample product. Replace this text with your own description in the admin panel.',
      details: '100% viscose. Gentle hand wash.',
    },
  })
  await payload.update({
    collection: 'products',
    id: doc.id,
    locale: 'ar',
    data: {
      name: `[نموذج] ${s.ar}`,
      description: 'منتج تجريبي. استبدلي هذا النص بالوصف الخاص بك من لوحة التحكم.',
      details: '١٠٠٪ فسكوز. غسيل يدوي لطيف.',
    },
  })
}

await payload.updateGlobal({
  slug: 'settings',
  locale: 'en',
  data: {
    announcements: [
      { text: 'Free delivery over 40 KWD' },
      { text: 'New Formé darra’a for the season' },
    ],
    formeTagline: 'Darra’a & kaftans',
    sienaTagline: 'Activewear, made to move',
    shippingFee: 2,
    freeShippingThreshold: 40,
  },
})
const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
await payload.updateGlobal({
  slug: 'settings',
  locale: 'ar',
  data: {
    announcements: (settings.announcements ?? []).map((a, i) => ({
      id: a.id,
      text: ['توصيل مجاني للطلبات فوق ٤٠ د.ك', 'دراعات فورميه الجديدة للموسم'][i],
    })),
    formeTagline: 'دراعات وقفاطين',
    sienaTagline: 'ملابس رياضية للحركة',
  },
})

const formeHero = await placeholder('Formé cover', '#cfc4b8', '#8d7b69', 1800, 1100)
const formeHeroMobile = await placeholder('Formé cover phone', '#cfc4b8', '#8d7b69', 900, 1500)
const sienaHero = await placeholder('Siena cover', '#9a8571', '#43392f', 1800, 1100)
const sienaHeroMobile = await placeholder('Siena cover phone', '#9a8571', '#43392f', 900, 1500)

await payload.updateGlobal({
  slug: 'homepage',
  locale: 'en',
  data: {
    sections: [
      {
        blockType: 'hero',
        media: formeHero.id,
        mobileMedia: formeHeroMobile.id,
        logo: 'forme',
        title: 'The new season',
        linkBrand: 'forme',
      },
      {
        blockType: 'products',
        title: 'Formé — New in',
        brand: 'forme',
        show: 'featured',
        limit: 8,
      },
      {
        blockType: 'statement',
        text: 'Best selling pieces',
        subtitle: 'Feminine and flattering.',
        linkBrand: 'forme',
      },
      {
        blockType: 'hero',
        media: sienaHero.id,
        mobileMedia: sienaHeroMobile.id,
        logo: 'siena',
        title: 'Made to move',
        linkBrand: 'siena',
      },
      {
        blockType: 'products',
        title: 'Siena — New in',
        brand: 'siena',
        show: 'featured',
        limit: 8,
      },
      { blockType: 'categories', title: 'Shop by category', categories: Object.values(categories) },
    ],
  },
})
const home = await payload.findGlobal({ slug: 'homepage', depth: 0 })
const arText: Record<string, Record<string, string>> = {
  0: { title: 'الموسم الجديد' },
  1: { title: 'فورميه — وصل حديثاً' },
  2: { text: 'القطع الأكثر مبيعاً', subtitle: 'أنيقة ومريحة.' },
  3: { title: 'صُممت للحركة' },
  4: { title: 'سيينا — وصل حديثاً' },
  5: { title: 'تسوّقي حسب الفئة' },
}
await payload.updateGlobal({
  slug: 'homepage',
  locale: 'ar',
  data: {
    sections: (home.sections ?? []).map((section, i) => ({
      ...section,
      ...arText[i],
    })) as typeof home.sections,
  },
})

payload.logger.info('Sample data created')
process.exit(0)
