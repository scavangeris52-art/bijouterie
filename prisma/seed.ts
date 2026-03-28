import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin ──────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@nador.ma" },
    update: {},
    create: {
      email: "admin@nador.ma",
      password: hashedPassword,
      name: "Admin Bijouterie",
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Admin créé : admin@nador.ma / admin123");

  // ── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "bagues" },
      update: {},
      create: {
        slug: "bagues",
        nameFr: "Bagues",
        nameEn: "Rings",
        nameAr: "خواتم",
        nameEs: "Anillos",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "colliers" },
      update: {},
      create: {
        slug: "colliers",
        nameFr: "Colliers",
        nameEn: "Necklaces",
        nameAr: "قلائد",
        nameEs: "Collares",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "bracelets" },
      update: {},
      create: {
        slug: "bracelets",
        nameFr: "Bracelets",
        nameEn: "Bracelets",
        nameAr: "أساور",
        nameEs: "Pulseras",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "boucles-doreilles" },
      update: {},
      create: {
        slug: "boucles-doreilles",
        nameFr: "Boucles d'oreilles",
        nameEn: "Earrings",
        nameAr: "أقراط",
        nameEs: "Pendientes",
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600",
        order: 4,
      },
    }),
  ]);
  console.log("✅ 4 catégories créées");

  // ── Products ──────────────────────────────────────────────────────────────
  const products = [
    {
      slug: "bague-solitaire-diamant-or-18k",
      sku: "BJ-001",
      nameFr: "Bague Solitaire Diamant Or 18K",
      nameEn: "18K Gold Diamond Solitaire Ring",
      nameAr: "خاتم سوليتير ماسي ذهب 18 قيراط",
      nameEs: "Anillo Solitario Diamante Oro 18K",
      descFr: "Magnifique bague solitaire en or jaune 18 carats serties d'un diamant rond brillant de 0,5 carat. Certificat GIA inclus.",
      descEn: "Magnificent solitaire ring in 18K yellow gold set with a round brilliant diamond of 0.5 carat. GIA certificate included.",
      descAr: "خاتم سوليتير رائع من الذهب الأصفر 18 قيراطاً مرصع بماسة دائرية لامعة تزن 0.5 قيراط. يشمل شهادة GIA.",
      descEs: "Magnífico anillo solitario en oro amarillo de 18K engarzado con un diamante redondo brillante de 0,5 quilates. Certificado GIA incluido.",
      price: 8500,
      comparePrice: 9500,
      stock: 3,
      material: "Or 18K",
      stone: "Diamant 0.5ct",
      weight: "4.2g",
      featured: true,
      published: true,
      categorySlug: "bagues",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    },
    {
      slug: "collier-or-rose-perles",
      sku: "BJ-002",
      nameFr: "Collier Or Rose & Perles d'Akoya",
      nameEn: "Rose Gold & Akoya Pearl Necklace",
      nameAr: "قلادة ذهب وردي مع لؤلؤ أكويا",
      nameEs: "Collar de Oro Rosa y Perlas Akoya",
      descFr: "Élégant collier en or rose 18K avec perles d'Akoya naturelles 7-8mm. Fermoir or rose serti d'un rubis. Longueur 45cm.",
      descEn: "Elegant 18K rose gold necklace with natural 7-8mm Akoya pearls. Rose gold clasp set with a ruby. Length 45cm.",
      descAr: "قلادة أنيقة من الذهب الوردي 18 قيراطاً مع لؤلؤ أكويا الطبيعي مقاس 7-8 ملم. إبزيم ذهبي وردي مرصع بياقوتة أحمر. طول 45 سم.",
      descEs: "Elegante collar de oro rosa 18K con perlas Akoya naturales de 7-8mm. Cierre de oro rosa con rubí. Longitud 45cm.",
      price: 4200,
      stock: 5,
      material: "Or Rose 18K",
      stone: "Perles Akoya",
      weight: "12g",
      featured: true,
      published: true,
      categorySlug: "colliers",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
    },
    {
      slug: "bracelet-jonc-or-blanc",
      sku: "BJ-003",
      nameFr: "Bracelet Jonc Or Blanc Saphirs",
      nameEn: "White Gold Bangle with Sapphires",
      nameAr: "سوار من الذهب الأبيض مع الياقوت الأزرق",
      nameEs: "Brazalete de Oro Blanco con Zafiros",
      descFr: "Bracelet jonc rigide en or blanc 18K serti de 12 saphirs bleus ronds totalisant 1.2 carats. Design contemporain et intemporel.",
      descEn: "Rigid bangle in 18K white gold set with 12 round blue sapphires totaling 1.2 carats. Contemporary and timeless design.",
      descAr: "سوار صلب من الذهب الأبيض 18 قيراطاً مرصع بـ 12 ياقوتة زرقاء دائرية بإجمالي 1.2 قيراط. تصميم معاصر وخالد.",
      descEs: "Brazalete rígido de oro blanco 18K engarzado con 12 zafiros azules redondos con un total de 1,2 quilates.",
      price: 5800,
      comparePrice: 6500,
      stock: 2,
      material: "Or Blanc 18K",
      stone: "Saphirs",
      weight: "18g",
      featured: true,
      published: true,
      categorySlug: "bracelets",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
    },
    {
      slug: "boucles-oreilles-emeraude",
      sku: "BJ-004",
      nameFr: "Boucles d'Oreilles Émeraudes & Diamants",
      nameEn: "Emerald & Diamond Earrings",
      nameAr: "أقراط زمرد وألماس",
      nameEs: "Pendientes de Esmeraldas y Diamantes",
      descFr: "Somptueuses boucles d'oreilles en or jaune 18K serties d'émeraudes colombiennes naturelles et de diamants. Poids total 3.4ct.",
      descEn: "Sumptuous 18K yellow gold earrings set with natural Colombian emeralds and diamonds. Total weight 3.4ct.",
      descAr: "أقراط فاخرة من الذهب الأصفر 18 قيراطاً مرصعة بزمرد كولومبي طبيعي وألماس. الوزن الإجمالي 3.4 قيراط.",
      descEs: "Suntuosos pendientes de oro amarillo 18K con esmeraldas colombianas naturales y diamantes. Peso total 3,4ct.",
      price: 12000,
      stock: 1,
      material: "Or 18K",
      stone: "Émeraudes & Diamants",
      weight: "8g",
      featured: true,
      published: true,
      categorySlug: "boucles-doreilles",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800",
    },
    {
      slug: "bague-alliance-or-jaune",
      sku: "BJ-005",
      nameFr: "Alliance Or Jaune 18K",
      nameEn: "18K Yellow Gold Wedding Band",
      nameAr: "خاتم زواج ذهب أصفر 18 قيراط",
      nameEs: "Alianza de Boda Oro Amarillo 18K",
      descFr: "Alliance classique en or jaune 18K, finition polie brillante. Largeur 4mm. Gravure personnalisée offerte.",
      descEn: "Classic wedding band in 18K yellow gold, bright polished finish. Width 4mm. Free personalized engraving.",
      descAr: "خاتم زواج كلاسيكي من الذهب الأصفر 18 قيراطاً بلمسة نهائية مصقولة. عرض 4 ملم. نقش مجاني حسب الطلب.",
      descEs: "Alianza clásica de oro amarillo 18K con acabado pulido brillante. Ancho 4mm. Grabado personalizado gratuito.",
      price: 2800,
      stock: 8,
      material: "Or 18K",
      stone: null,
      weight: "6g",
      featured: false,
      published: true,
      categorySlug: "bagues",
      image: "https://images.unsplash.com/photo-1586878341523-7ffe4b19c02e?w=800",
    },
    {
      slug: "collier-pendentif-coeur-or-rose",
      sku: "BJ-006",
      nameFr: "Collier Pendentif Cœur Or Rose",
      nameEn: "Rose Gold Heart Pendant Necklace",
      nameAr: "قلادة قلب ذهب وردي",
      nameEs: "Collar Colgante Corazón Oro Rosa",
      descFr: "Délicat collier en or rose 18K avec pendentif cœur serti de rubis. Chaîne maille forçat 42cm. Idéal comme cadeau.",
      descEn: "Delicate 18K rose gold necklace with heart pendant set with rubies. 42cm cable chain. Perfect as a gift.",
      descAr: "قلادة رقيقة من الذهب الوردي 18 قيراطاً مع قلادة قلب مرصعة بالياقوت الأحمر. سلسلة 42 سم. مثالية كهدية.",
      descEs: "Delicado collar de oro rosa 18K con colgante corazón engarzado con rubíes. Cadena eslabón 42cm. Ideal como regalo.",
      price: 1850,
      stock: 6,
      material: "Or Rose 18K",
      stone: "Rubis",
      weight: "3.5g",
      featured: false,
      published: true,
      categorySlug: "colliers",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
    },
    {
      slug: "bracelet-tennis-diamants",
      sku: "BJ-007",
      nameFr: "Bracelet Tennis Diamants Or Blanc",
      nameEn: "White Gold Diamond Tennis Bracelet",
      nameAr: "سوار تنس ألماسي ذهب أبيض",
      nameEs: "Brazalete Tennis Diamantes Oro Blanco",
      descFr: "Bracelet tennis en or blanc 18K pavé de 45 diamants ronds F/VS1 totalisant 3ct. Fermoir sécurité à boîtier.",
      descEn: "18K white gold tennis bracelet paved with 45 round F/VS1 diamonds totaling 3ct. Box safety clasp.",
      descAr: "سوار تنس من الذهب الأبيض 18 قيراطاً مرصع بـ 45 ماسة دائرية F/VS1 بإجمالي 3 قيراط. إبزيم أمان.",
      descEs: "Brazalete tennis de oro blanco 18K pavimentado con 45 diamantes redondos F/VS1 con un total de 3ct.",
      price: 18500,
      stock: 1,
      material: "Or Blanc 18K",
      stone: "Diamants 3ct",
      weight: "22g",
      featured: false,
      published: true,
      categorySlug: "bracelets",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
    },
    {
      slug: "boucles-oreilles-perles-or",
      sku: "BJ-008",
      nameFr: "Boucles d'Oreilles Perles de Tahiti",
      nameEn: "Tahiti Pearl Earrings",
      nameAr: "أقراط لؤلؤ تاهيتي",
      nameEs: "Pendientes de Perlas de Tahití",
      descFr: "Élégantes boucles d'oreilles en or blanc 18K avec perles de Tahiti noires naturelles 10-11mm.",
      descEn: "Elegant 18K white gold earrings with natural black Tahiti pearls 10-11mm.",
      descAr: "أقراط أنيقة من الذهب الأبيض 18 قيراطاً مع لؤلؤ تاهيتي أسود طبيعي مقاس 10-11 ملم.",
      descEs: "Elegantes pendientes de oro blanco 18K con perlas de Tahití negras naturales de 10-11mm.",
      price: 3200,
      comparePrice: 3800,
      stock: 4,
      material: "Or Blanc 18K",
      stone: "Perles de Tahiti",
      weight: "5g",
      featured: false,
      published: true,
      categorySlug: "boucles-doreilles",
      image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800",
    },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug)!;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        sku: p.sku,
        nameFr: p.nameFr,
        nameEn: p.nameEn,
        nameAr: p.nameAr,
        nameEs: p.nameEs,
        descFr: p.descFr,
        descEn: p.descEn,
        descAr: p.descAr,
        descEs: p.descEs,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        stock: p.stock,
        material: p.material ?? null,
        stone: p.stone ?? null,
        weight: p.weight ?? null,
        featured: p.featured,
        published: p.published,
        categoryId: category.id,
        images: {
          create: [{ url: p.image, alt: p.nameFr, order: 0 }],
        },
      },
    });
  }
  console.log("✅ 8 produits créés");

  // ── Blog Posts ────────────────────────────────────────────────────────────
  const posts = [
    {
      slug: "comment-choisir-bague-fiancailles",
      titleFr: "Comment choisir la bague de fiançailles parfaite",
      titleEn: "How to Choose the Perfect Engagement Ring",
      titleAr: "كيفية اختيار خاتم الخطوبة المثالي",
      titleEs: "Cómo Elegir el Anillo de Compromiso Perfecto",
      excerptFr: "Guide complet pour choisir une bague de fiançailles qui symbolise votre amour tout en respectant votre budget.",
      excerptEn: "Complete guide to choosing an engagement ring that symbolizes your love while respecting your budget.",
      excerptAr: "دليل شامل لاختيار خاتم الخطوبة الذي يرمز إلى حبكم مع مراعاة ميزانيتك.",
      excerptEs: "Guía completa para elegir un anillo de compromiso que simbolice tu amor respetando tu presupuesto.",
      contentFr: "Choisir une bague de fiançailles est l'une des décisions les plus importantes de votre vie. Dans ce guide, nous vous accompagnons pas à pas...\n\n## Les 4C du diamant\n\nLa qualité d'un diamant se définit par quatre critères : la Couleur (Color), la Pureté (Clarity), la Taille (Cut) et le Carat (Weight).\n\n## Le choix du métal\n\nOr jaune, or blanc, or rose ou platine — chaque métal a ses particularités et son esthétique propre.\n\n## Le budget\n\nIl n'y a pas de règle universelle. L'important est de choisir quelque chose qui vous ressemble.",
      contentEn: "Choosing an engagement ring is one of the most important decisions of your life...\n\n## The 4C's of Diamonds\n\nDiamond quality is defined by four criteria: Color, Clarity, Cut, and Carat weight.\n\n## Metal Choice\n\nYellow gold, white gold, rose gold or platinum — each metal has its own characteristics.\n\n## Budget\n\nThere is no universal rule. What matters is choosing something that reflects you.",
      contentAr: "اختيار خاتم الخطوبة هو أحد أهم القرارات في حياتك...\n\n## المعايير الأربعة للماس\n\nجودة الماس تحددها أربعة معايير: اللون، الصفاء، القطع، والوزن بالقيراط.\n\n## اختيار المعدن\n\nذهب أصفر أو أبيض أو وردي أو بلاتين — لكل معدن خصائصه الجمالية.",
      contentEs: "Elegir un anillo de compromiso es una de las decisiones más importantes de tu vida...\n\n## Los 4C del diamante\n\nLa calidad de un diamante se define por cuatro criterios: Color, Claridad, Talla y Quilate.\n\n## La elección del metal\n\nOro amarillo, blanco, rosa o platino — cada metal tiene sus características propias.",
      coverImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200",
      tags: ["fiançailles", "diamants", "guide"],
    },
    {
      slug: "tendances-bijoux-2026",
      titleFr: "Les tendances bijoux incontournables de 2026",
      titleEn: "The Must-Have Jewelry Trends of 2026",
      titleAr: "أبرز اتجاهات المجوهرات لعام 2026",
      titleEs: "Las Tendencias de Joyería Imprescindibles de 2026",
      excerptFr: "Découvrez les styles qui dominent le monde de la bijouterie cette année : minimalisme, pièces empilables et or rose.",
      excerptEn: "Discover the styles dominating the jewelry world this year: minimalism, stackable pieces, and rose gold.",
      excerptAr: "اكتشف الأساليب التي تهيمن على عالم المجوهرات هذا العام: البساطة، القطع القابلة للتراص والذهب الوردي.",
      excerptEs: "Descubre los estilos que dominan el mundo de la joyería este año: minimalismo, piezas apilables y oro rosa.",
      contentFr: "2026 est l'année du bijou personnel et significatif. Voici les tendances à suivre...\n\n## Le minimalisme chic\n\nLes bijoux fins et délicats restent au cœur des tendances. Une simple chaîne fine en or ou une bague minimaliste suffisent à sublimer une tenue.\n\n## Les pièces empilables\n\nEmpiler plusieurs bagues, bracelets ou colliers fins est une tendance qui continue de s'affirmer.",
      contentEn: "2026 is the year of personal and meaningful jewelry. Here are the trends to follow...\n\n## Chic Minimalism\n\nFine and delicate jewelry remains at the heart of trends.\n\n## Stackable Pieces\n\nStacking multiple rings, bracelets or thin necklaces is a trend that continues to grow.",
      contentAr: "عام 2026 هو عام المجوهرات الشخصية والمعبّرة...\n\n## الأناقة البسيطة\n\nتظل المجوهرات الرفيعة والناعمة في صميم الاتجاهات الحديثة.\n\n## القطع القابلة للتراص\n\nتراص خواتم ومحابس أو قلائد متعددة هو اتجاه يزداد انتشاراً.",
      contentEs: "2026 es el año de la joyería personal y significativa...\n\n## Minimalismo chic\n\nLas joyas finas y delicadas siguen siendo el núcleo de las tendencias.\n\n## Piezas apilables\n\nApilar varios anillos, pulseras o collares finos es una tendencia que continúa creciendo.",
      coverImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200",
      tags: ["tendances", "2026", "mode"],
    },
    {
      slug: "entretenir-bijoux-or",
      titleFr: "Comment entretenir vos bijoux en or",
      titleEn: "How to Care for Your Gold Jewelry",
      titleAr: "كيفية العناية بمجوهراتك الذهبية",
      titleEs: "Cómo Cuidar tus Joyas de Oro",
      excerptFr: "Conseils pratiques pour préserver l'éclat de vos précieux bijoux en or et prolonger leur durée de vie.",
      excerptEn: "Practical tips to preserve the brilliance of your precious gold jewelry and extend their lifespan.",
      excerptAr: "نصائح عملية للحفاظ على بريق مجوهراتك الذهبية الثمينة وإطالة عمرها.",
      excerptEs: "Consejos prácticos para preservar el brillo de tus preciosas joyas de oro y prolongar su vida útil.",
      contentFr: "L'or est un métal précieux mais qui nécessite des soins réguliers...\n\n## Nettoyage régulier\n\nNettoyez vos bijoux en or avec de l'eau tiède, du liquide vaisselle doux et une brosse douce.\n\n## Conservation\n\nStockez vos bijoux dans des pochettes séparées pour éviter les rayures.\n\n## À éviter\n\nÉvitez le contact avec les produits chimiques, la piscine et le parfum.",
      contentEn: "Gold is a precious metal but requires regular care...\n\n## Regular Cleaning\n\nClean your gold jewelry with warm water, mild dish soap and a soft brush.\n\n## Storage\n\nStore your jewelry in separate pouches to avoid scratches.\n\n## What to Avoid\n\nAvoid contact with chemicals, pool water and perfume.",
      contentAr: "الذهب معدن ثمين لكنه يحتاج إلى عناية منتظمة...\n\n## التنظيف المنتظم\n\nنظف مجوهراتك الذهبية بالماء الدافئ وصابون الأطباق اللطيف وفرشاة ناعمة.\n\n## التخزين\n\nخزّن مجوهراتك في أكياس منفصلة لتجنب الخدش.",
      contentEs: "El oro es un metal precioso que requiere cuidados regulares...\n\n## Limpieza regular\n\nLimpia tus joyas de oro con agua tibia, jabón suave y un cepillo blando.\n\n## Almacenamiento\n\nGuarda tus joyas en bolsas separadas para evitar arañazos.",
      coverImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200",
      tags: ["entretien", "or", "conseils"],
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, published: true },
    });
  }
  console.log("✅ 3 articles blog créés");

  // ── Reviews ───────────────────────────────────────────────────────────────
  const products_db = await prisma.product.findMany({ take: 3 });
  const reviews = [
    {
      rating: 5,
      comment: "Magnifique bague, exactement comme sur les photos. Livraison rapide à Nador, emballage luxueux. Ma femme est ravie !",
      authorName: "Karim B.",
      authorEmail: "karim@example.com",
      status: "APPROVED" as const,
      productId: products_db[0]?.id,
    },
    {
      rating: 4,
      comment: "Très beau bijou, qualité au rendez-vous. Je recommande cette bijouterie.",
      authorName: "Fatima Z.",
      authorEmail: "fatima@example.com",
      status: "APPROVED" as const,
      productId: products_db[1]?.id,
    },
    {
      rating: 4,
      comment: "Très beau collier, la perle est superbe. Petit bémol sur le délai de livraison mais la qualité est au rendez-vous.",
      authorName: "Ahmed M.",
      authorEmail: "ahmed@example.com",
      status: "APPROVED" as const,
      productId: products_db[2]?.id,
    },
  ];

  for (const r of reviews) {
    if (r.productId) {
      await prisma.review.create({ data: r });
    }
  }
  console.log("✅ 3 avis créés");

  // ── Site Settings ─────────────────────────────────────────────────────────
  await prisma.siteSetting.upsert({
    where: { key: "promo_banner" },
    update: {},
    create: {
      key: "promo_banner",
      value: "Livraison offerte dès 1500 MAD | شحن مجاني من 1500 درهم",
    },
  });
  console.log("✅ Paramètres site créés");

  console.log("\n🎉 Seed terminé avec succès !");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin : admin@nador.ma");
  console.log("Password : admin123");
  console.log("URL admin : http://localhost:3000/admin/login");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
