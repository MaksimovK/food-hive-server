import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from './generated/client';

if (!process.env.DATABASE_URL) {
  throw new Error('❌ ОШИБКА: Переменная DATABASE_URL не найдена в .env!');
}
console.log(
  '✅ DATABASE_URL загружен (первые 30 символов):',
  process.env.DATABASE_URL.substring(0, 30) + '...',
);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Запуск seed-данных...');

  // ОЧИСТКА
  await prisma.$transaction([
    prisma.productIngredient.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.ingredient.deleteMany(),
    prisma.banner.deleteMany(),
  ]);
  console.log('✅ Старые демо-данные удалены');

  // ===== ИНГРЕДИЕНТЫ (расширенный список) =====
  await prisma.ingredient.createMany({
    data: [
      // Основа
      { name: 'Пшеничная мука', containsGluten: true },
      { name: 'Рис', containsGluten: false },
      { name: 'Нори', containsGluten: false },
      // Сыры
      { name: 'Моцарелла', containsDairy: true },
      { name: 'Пармезан', containsDairy: true },
      { name: 'Сливочный сыр', containsDairy: true },
      { name: 'Голубой сыр', containsDairy: true },
      { name: 'Чеддер', containsDairy: true },
      // Мясо/Рыба
      { name: 'Куриное филе', containsGluten: false },
      { name: 'Пепперони', containsGluten: false },
      { name: 'Ветчина', containsGluten: false },
      { name: 'Лосось', containsGluten: false },
      { name: 'Угорь', containsGluten: false },
      { name: 'Креветки', containsGluten: false },
      { name: 'Тунец', containsGluten: false },
      // Овощи/Фрукты
      { name: 'Помидоры', containsGluten: false },
      { name: 'Огурец', containsGluten: false },
      { name: 'Авокадо', containsGluten: false },
      { name: 'Базилик', containsGluten: false },
      { name: 'Салат айсберг', containsGluten: false },
      { name: 'Оливки', containsGluten: false },
      { name: 'Ананас', containsGluten: false },
      { name: 'Лук красный', containsGluten: false },
      { name: 'Чеснок', containsGluten: false },
      { name: 'Имбирь', containsGluten: false },
      { name: 'Кинза', containsGluten: false },
      // Соусы/Добавки
      { name: 'Оливковое масло', containsGluten: false },
      { name: 'Соевый соус', containsSoy: true, containsGluten: true },
      { name: 'Соус цезарь', containsDairy: true, containsGluten: true },
      { name: 'Соус унаги', containsGluten: true },
      { name: 'Майонез', containsDairy: true, containsEggs: true },
      { name: 'Сливки', containsDairy: true },
      { name: 'Гренки', containsGluten: true },
      { name: 'Кунжут', containsNuts: true },
      { name: 'Васаби', containsGluten: false },
      { name: 'Икра тобико', containsGluten: false },
      // Напитки
      { name: 'Кола', containsGluten: false },
      { name: 'Лимон', containsGluten: false },
      { name: 'Мята', containsGluten: false },
      { name: 'Клюква', containsGluten: false },
      { name: 'Зеленый чай', containsGluten: false },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Ингредиенты созданы');

  // ===== КАТЕГОРИИ =====
  await prisma.category.createMany({
    data: [
      {
        name: 'Пицца',
        image: '/images/categories/pizza.jpg',
        description: 'Горячие и ароматные пиццы ручной работы',
        order: 1,
        isActive: true,
      },
      {
        name: 'Суши и Роллы',
        image: '/images/categories/sushi.jpg',
        description: 'Свежие суши от профессиональных мастеров',
        order: 2,
        isActive: true,
      },
      {
        name: 'Салаты',
        image: '/images/categories/salad.jpg',
        description: 'Свежие и полезные салаты',
        order: 3,
        isActive: true,
      },
      {
        name: 'Напитки',
        image: '/images/categories/drinks.jpg',
        description: 'Освежающие напитки и десерты',
        order: 4,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // Получаем ВСЕ категории по имени
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));
  console.log('✅ Категории созданы:', Object.keys(catMap).join(', '));

  // ===== ПРОДУКТЫ (18 шт) =====
  const products = [
    // ПИЦЦА (5)
    {
      name: 'Маргарита',
      description: 'Классическая пицца с томатами, моцареллой и базиликом',
      image: '/images/products/margarita.jpg',
      price: 499,
      caloriesPer100g: 250,
      proteinPer100g: 12,
      fatPer100g: 10,
      carbsPer100g: 30,
      servingSize: 450,
      categoryId: catMap['Пицца'],
      ingredients: [
        { name: 'Пшеничная мука', amount: 200, unit: 'г' },
        { name: 'Моцарелла', amount: 150, unit: 'г' },
        { name: 'Помидоры', amount: 100, unit: 'г' },
        { name: 'Базилик', amount: 10, unit: 'г' },
        { name: 'Оливковое масло', amount: 15, unit: 'мл' },
      ],
    },
    {
      name: 'Пепперони',
      description: 'Пицца с острыми колбасками пепперони и двойным сыром',
      image: '/images/products/pepperoni.jpg',
      price: 599,
      caloriesPer100g: 280,
      proteinPer100g: 14,
      fatPer100g: 15,
      carbsPer100g: 28,
      servingSize: 500,
      categoryId: catMap['Пицца'],
      ingredients: [
        { name: 'Пшеничная мука', amount: 220, unit: 'г' },
        { name: 'Моцарелла', amount: 180, unit: 'г' },
        { name: 'Пепперони', amount: 100, unit: 'г' },
      ],
    },
    {
      name: 'Четыре сыра',
      description: 'Пицца с моцареллой, пармезаном, чеддером и голубым сыром',
      image: '/images/products/four_cheese.jpg',
      price: 649,
      caloriesPer100g: 300,
      proteinPer100g: 16,
      fatPer100g: 18,
      carbsPer100g: 25,
      servingSize: 480,
      categoryId: catMap['Пицца'],
      ingredients: [
        { name: 'Пшеничная мука', amount: 200, unit: 'г' },
        { name: 'Моцарелла', amount: 100, unit: 'г' },
        { name: 'Пармезан', amount: 50, unit: 'г' },
        { name: 'Чеддер', amount: 50, unit: 'г' },
        { name: 'Голубой сыр', amount: 30, unit: 'г' },
      ],
    },
    {
      name: 'Гавайская',
      description: 'Пицца с ветчиной, ананасами и моцареллой',
      image: '/images/products/hawaiian.jpg',
      price: 579,
      caloriesPer100g: 260,
      proteinPer100g: 13,
      fatPer100g: 12,
      carbsPer100g: 29,
      servingSize: 470,
      categoryId: catMap['Пицца'],
      ingredients: [
        { name: 'Пшеничная мука', amount: 210, unit: 'г' },
        { name: 'Моцарелла', amount: 140, unit: 'г' },
        { name: 'Ветчина', amount: 80, unit: 'г' },
        { name: 'Ананас', amount: 70, unit: 'г' },
      ],
    },
    {
      name: 'Мясная',
      description: 'Пицца с пепперони, ветчиной, курицей и двойным сыром',
      image: '/images/products/meat_lovers.jpg',
      price: 699,
      caloriesPer100g: 310,
      proteinPer100g: 18,
      fatPer100g: 20,
      carbsPer100g: 26,
      servingSize: 520,
      categoryId: catMap['Пицца'],
      ingredients: [
        { name: 'Пшеничная мука', amount: 230, unit: 'г' },
        { name: 'Моцарелла', amount: 200, unit: 'г' },
        { name: 'Пепперони', amount: 70, unit: 'г' },
        { name: 'Ветчина', amount: 60, unit: 'г' },
        { name: 'Куриное филе', amount: 60, unit: 'г' },
      ],
    },

    // СУШИ (5)
    {
      name: 'Филадельфия с лососем',
      description: 'Ролл с лососем, авокадо и сливочным сыром',
      image: '/images/products/philadelphia.jpg',
      price: 399,
      caloriesPer100g: 180,
      proteinPer100g: 8,
      fatPer100g: 9,
      carbsPer100g: 18,
      servingSize: 220,
      categoryId: catMap['Суши и Роллы'],
      ingredients: [
        { name: 'Рис', amount: 100, unit: 'г' },
        { name: 'Нори', amount: 5, unit: 'г' },
        { name: 'Лосось', amount: 60, unit: 'г' },
        { name: 'Авокадо', amount: 40, unit: 'г' },
        { name: 'Сливочный сыр', amount: 30, unit: 'г' },
      ],
    },
    {
      name: 'Калифорния',
      description: 'Ролл с крабовым мясом, авокадо и огурцом',
      image: '/images/products/california.jpg',
      price: 349,
      caloriesPer100g: 160,
      proteinPer100g: 7,
      fatPer100g: 6,
      carbsPer100g: 20,
      servingSize: 200,
      categoryId: catMap['Суши и Роллы'],
      ingredients: [
        { name: 'Рис', amount: 90, unit: 'г' },
        { name: 'Нори', amount: 4, unit: 'г' },
        { name: 'Крабовое мясо', amount: 50, unit: 'г' },
        { name: 'Авокадо', amount: 35, unit: 'г' },
        { name: 'Огурец', amount: 30, unit: 'г' },
        { name: 'Кунжут', amount: 5, unit: 'г' },
      ],
    },
    {
      name: 'Унаги',
      description: 'Ролл с угрем и соусом унаги',
      image: '/images/products/unagi.jpg',
      price: 449,
      caloriesPer100g: 200,
      proteinPer100g: 10,
      fatPer100g: 8,
      carbsPer100g: 22,
      servingSize: 210,
      categoryId: catMap['Суши и Роллы'],
      ingredients: [
        { name: 'Рис', amount: 100, unit: 'г' },
        { name: 'Нори', amount: 5, unit: 'г' },
        { name: 'Угорь', amount: 70, unit: 'г' },
        { name: 'Огурец', amount: 25, unit: 'г' },
        { name: 'Соус унаги', amount: 20, unit: 'мл' },
      ],
    },
    {
      name: 'Темпура',
      description: 'Ролл с креветкой в темпуре и авокадо',
      image: '/images/products/tempura.jpg',
      price: 429,
      caloriesPer100g: 210,
      proteinPer100g: 9,
      fatPer100g: 12,
      carbsPer100g: 19,
      servingSize: 230,
      categoryId: catMap['Суши и Роллы'],
      ingredients: [
        { name: 'Рис', amount: 110, unit: 'г' },
        { name: 'Нори', amount: 5, unit: 'г' },
        { name: 'Креветки', amount: 60, unit: 'г' },
        { name: 'Авокадо', amount: 40, unit: 'г' },
        { name: 'Темпура', amount: 30, unit: 'г' },
      ],
    },
    {
      name: 'Сет Нежность',
      description: '8 шт: 4 Филадельфия + 4 Калифорния',
      image: '/images/products/set_nежность.jpg',
      price: 699,
      caloriesPer100g: 170,
      proteinPer100g: 7.5,
      fatPer100g: 7.5,
      carbsPer100g: 19,
      servingSize: 420,
      categoryId: catMap['Суши и Роллы'],
      ingredients: [
        { name: 'Рис', amount: 200, unit: 'г' },
        { name: 'Лосось', amount: 60, unit: 'г' },
        { name: 'Крабовое мясо', amount: 50, unit: 'г' },
        { name: 'Авокадо', amount: 75, unit: 'г' },
        { name: 'Огурец', amount: 60, unit: 'г' },
      ],
    },

    // САЛАТЫ (4)
    {
      name: 'Цезарь с курицей',
      description: 'Салат с курицей, пармезаном, гренками и соусом цезарь',
      image: '/images/products/caesar.jpg',
      price: 349,
      caloriesPer100g: 160,
      proteinPer100g: 10,
      fatPer100g: 8,
      carbsPer100g: 12,
      servingSize: 300,
      categoryId: catMap['Салаты'],
      ingredients: [
        { name: 'Куриное филе', amount: 100, unit: 'г' },
        { name: 'Салат айсберг', amount: 80, unit: 'г' },
        { name: 'Пармезан', amount: 20, unit: 'г' },
        { name: 'Гренки', amount: 30, unit: 'г' },
        { name: 'Соус цезарь', amount: 25, unit: 'мл' },
      ],
    },
    {
      name: 'Греческий',
      description:
        'Салат с огурцами, помидорами, оливками, фетой и оливковым маслом',
      image: '/images/products/greek.jpg',
      price: 299,
      caloriesPer100g: 120,
      proteinPer100g: 6,
      fatPer100g: 7,
      carbsPer100g: 8,
      servingSize: 280,
      categoryId: catMap['Салаты'],
      ingredients: [
        { name: 'Огурец', amount: 70, unit: 'г' },
        { name: 'Помидоры', amount: 70, unit: 'г' },
        { name: 'Оливки', amount: 30, unit: 'г' },
        { name: 'Фета', amount: 40, unit: 'г' },
        { name: 'Оливковое масло', amount: 20, unit: 'мл' },
        { name: 'Лук красный', amount: 20, unit: 'г' },
      ],
    },
    {
      name: 'Оливье',
      description: 'Классический салат с колбасой, овощами и майонезом',
      image: '/images/products/olivier.jpg',
      price: 279,
      caloriesPer100g: 180,
      proteinPer100g: 8,
      fatPer100g: 12,
      carbsPer100g: 10,
      servingSize: 250,
      categoryId: catMap['Салаты'],
      ingredients: [
        { name: 'Колбаса', amount: 60, unit: 'г' },
        { name: 'Картофель', amount: 70, unit: 'г' },
        { name: 'Морковь', amount: 30, unit: 'г' },
        { name: 'Огурец', amount: 30, unit: 'г' },
        { name: 'Яйцо', amount: 40, unit: 'г' },
        { name: 'Майонез', amount: 30, unit: 'г' },
      ],
    },
    {
      name: 'С креветками',
      description: 'Салат с креветками, авокадо, рукколой и лимонной заправкой',
      image: '/images/products/shrimp_salad.jpg',
      price: 429,
      caloriesPer100g: 140,
      proteinPer100g: 12,
      fatPer100g: 6,
      carbsPer100g: 9,
      servingSize: 260,
      categoryId: catMap['Салаты'],
      ingredients: [
        { name: 'Креветки', amount: 80, unit: 'г' },
        { name: 'Авокадо', amount: 50, unit: 'г' },
        { name: 'Руккола', amount: 60, unit: 'г' },
        { name: 'Черри', amount: 40, unit: 'г' },
        { name: 'Лимон', amount: 15, unit: 'мл' },
        { name: 'Оливковое масло', amount: 15, unit: 'мл' },
      ],
    },

    // НАПИТКИ (4)
    {
      name: 'Кола',
      description: 'Охлаждённая классическая кола 0.5л',
      image: '/images/products/cola.jpg',
      price: 99,
      caloriesPer100g: 42,
      proteinPer100g: 0,
      fatPer100g: 0,
      carbsPer100g: 10.6,
      servingSize: 500,
      categoryId: catMap['Напитки'],
      ingredients: [{ name: 'Кола', amount: 500, unit: 'мл' }],
    },
    {
      name: 'Мохито безалкогольный',
      description: 'Освежающий напиток с мятой, лаймом и содовой',
      image: '/images/products/mojito.jpg',
      price: 179,
      caloriesPer100g: 35,
      proteinPer100g: 0,
      fatPer100g: 0,
      carbsPer100g: 8.5,
      servingSize: 300,
      categoryId: catMap['Напитки'],
      ingredients: [
        { name: 'Лайм', amount: 30, unit: 'г' },
        { name: 'Мята', amount: 10, unit: 'г' },
        { name: 'Сахарный сироп', amount: 20, unit: 'мл' },
        { name: 'Содовая', amount: 240, unit: 'мл' },
      ],
    },
    {
      name: 'Морс клюквенный',
      description: 'Домашний морс из свежей клюквы',
      image: '/images/products/cranberry.jpg',
      price: 149,
      caloriesPer100g: 45,
      proteinPer100g: 0.3,
      fatPer100g: 0,
      carbsPer100g: 11,
      servingSize: 300,
      categoryId: catMap['Напитки'],
      ingredients: [
        { name: 'Клюква', amount: 100, unit: 'г' },
        { name: 'Сахар', amount: 30, unit: 'г' },
        { name: 'Вода', amount: 170, unit: 'мл' },
      ],
    },
    {
      name: 'Зеленый чай',
      description: 'Ароматный зеленый чай 0.3л',
      image: '/images/products/green_tea.jpg',
      price: 129,
      caloriesPer100g: 1,
      proteinPer100g: 0,
      fatPer100g: 0,
      carbsPer100g: 0.2,
      servingSize: 300,
      categoryId: catMap['Напитки'],
      ingredients: [{ name: 'Зеленый чай', amount: 300, unit: 'мл' }],
    },
  ];

  // Создаём продукты + связи с ингредиентами
  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        image: p.image,
        price: p.price,
        caloriesPer100g: p.caloriesPer100g,
        proteinPer100g: p.proteinPer100g,
        fatPer100g: p.fatPer100g,
        carbsPer100g: p.carbsPer100g,
        servingSize: p.servingSize,
        categoryId: p.categoryId,
        isActive: true,
      },
    });

    // Связываем ингредиенты
    for (const ing of p.ingredients) {
      const ingredient = await prisma.ingredient.findUnique({
        where: { name: ing.name },
      });
      if (ingredient) {
        await prisma.productIngredient.create({
          data: {
            productId: product.id,
            ingredientId: ingredient.id,
            amount: ing.amount,
            unit: ing.unit,
          },
        });
      }
    }
    console.log(`✅ ${p.name}`);
  }

  // ===== БАННЕРЫ =====
  await prisma.banner.createMany({
    data: [
      {
        image: '/images/banners/promo_summer.jpg',
        title: 'Летняя акция!',
        description: 'Скидка 50% на все напитки при заказе от 1500₽',
        link: '/category/4',
        order: 1,
        isActive: true,
      },
      {
        image: '/images/banners/new_pizza.jpg',
        title: 'Новинка меню!',
        description: 'Пицца "Четыре сыра" уже в продаже',
        link: '/category/1',
        order: 2,
        isActive: true,
      },
      {
        image: '/images/banners/free_delivery.jpg',
        title: 'Бесплатная доставка',
        description: 'При заказе от 2000₽',
        link: null,
        order: 3,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Баннеры созданы');

  console.log(
    `🎉 Seed завершён! Создано: ${products.length} продуктов, ${Object.keys(catMap).length} категорий`,
  );
}

main()
  .catch((e) => {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Соединение с БД закрыто');
  });
