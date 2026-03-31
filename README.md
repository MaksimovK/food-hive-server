# Food Hive API 🍕

Серверная часть приложения для доставки еды с полным циклом обработки заказов: от выбора продуктов до оформления доставки.

[![NestJS](https://img.shields.io/badge/NestJS-11-red?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-blue?logo=prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Возможности](#-возможности)
- [Технологический стек](#-технологический-стек)
- [Архитектура проекта](#-архитектура-проекта)
- [Быстрый старт](#-быстрый-старт)
- [API Документация](#-api-документация)
- [Структура базы данных](#-структура-базы-данных)
- [Примеры запросов](#-примеры-запросов)
- [Безопасность](#-безопасность)
- [Контакты](#-контакты)

---

## 🍽️ О проекте

**Food Hive** — это современное REST API для сервиса доставки еды, разработанное с использованием NestJS и Prisma ORM. Проект демонстрирует лучшие практики разработки серверных приложений: модульную архитектуру, типобезопасность, валидацию данных, JWT-аутентификацию и полное покрытие API документацией.

Проект создан для портфолио и демонстрирует навыки backend-разработки.

**Связанные проекты:**
- [Food Hive Mobile](https://github.com/MaksimovK/food-hive-mobile) — клиентская часть

---

## ✨ Возможности

### 🔐 Аутентификация и авторизация
- Регистрация и вход пользователей
- JWT access + refresh токены
- Привязка сессий к устройствам
- Отзыв токенов при выходе и смене пароля
- Ролевая модель (USER / ADMIN)

### 👤 Профиль пользователя
- Просмотр и редактирование профиля
- Загрузка и удаление аватара
- Управление адресами доставки

### 🛒 Корзина и заказы
- Добавление/удаление товаров
- Bulk-операции с корзиной
- Оформление заказа с выбором адреса и способа оплаты
- Повтор предыдущих заказов
- История заказов со статусами

### ❤️ Избранное
- Добавление товаров в избранное
- Bulk-операции
- Быстрая очистка

### 📦 Продукты и категории
- CRUD продуктов (админ)
- Поиск продуктов
- Фильтрация по категориям
- Ингредиенты с информацией об аллергенах

### 🏠 Главная страница
- Баннеры с акциями
- Категории товаров
- Популярные продукты

---

## 🛠️ Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Фреймворк** | NestJS 11 |
| **Язык** | TypeScript 5 |
| **ORM** | Prisma 7 |
| **База данных** | PostgreSQL |
| **Аутентификация** | JWT, Passport |
| **Хеширование** | Argon2id |
| **Валидация** | class-validator, class-transformer |
| **Документация** | Swagger (OpenAPI) |
| **Статика** | @nestjs/serve-static |
| **Сборка** | Bun / npm |

---

## 🏗️ Архитектура проекта

```
src/
├── common/                    # Общие модули
│   ├── constants/             # Константы валидации
│   ├── decorators/            # Кастомные декораторы
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── guards/                # Гварды безопасности
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── utils/                 # Утилиты
│       ├── hash.util.ts       # Argon2 хеширование
│       ├── is-dev.util.ts
│       └── ms.util.ts
│
├── config/                    # Конфигурация
│   └── auth.config.ts
│
├── database/                  # Работа с БД
│   └── prisma/
│       ├── prisma.module.ts
│       ├── prisma.service.ts
│       └── seed-data.ts       # Сиды для БД
│
├── modules/                   # Бизнес-модули
│   ├── auth/                  # Аутентификация
│   ├── user/                  # Пользователи
│   ├── product/               # Продукты
│   ├── category/              # Категории
│   ├── cart/                  # Корзина
│   ├── order/                 # Заказы
│   ├── favorite/              # Избранное
│   ├── address/               # Адреса
│   ├── banner/                # Баннеры
│   ├── ingredient/            # Ингредиенты
│   ├── home/                  # Главная страница
│   └── upload/                # Загрузка файлов
│
├── app.module.ts              # Корневой модуль
└── main.ts                    # Точка входа
```

---

## 🚀 Быстрый старт

### Требования

- Node.js 18+ или Bun 1.0+
- PostgreSQL 14+
- npm или bun

### Установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/MaksimovK/food-hive-server.git
cd food-hive/server
```

2. **Установите зависимости**
```bash
npm install
# или
bun install
```

3. **Настройте переменные окружения**

Создайте файл `.env` в корне проекта:

```env
NODE_ENV=development

APPLICATION_PORT=4200
APPLICATION_URL=http://localhost:4200
ALLOWED_ORIGIN=http://localhost:8081

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food-hive?schema=public

JWT_SECRET=your_strong_secret_here_min_32_chars
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=7d

MAX_AVATAR_SIZE=5242880
AVATAR_UPLOAD_PATH=./public/avatars
ALLOWED_AVATAR_TYPES=image/jpeg,image/png,image/webp
```

4. **Инициализируйте базу данных**
```bash
# Генерация Prisma клиента
npm run db:generate

# Применение миграций
npx prisma migrate dev

# Заполнение тестовыми данными (опционально)
npm run db:seed
```

5. **Запуск приложения**
```bash
# Режим разработки
npm run start:dev

# Продакшен
npm run build
npm run start:prod
```

6. **Откройте Swagger документацию**
```
http://localhost:4200/api/docs
```

---

## 📖 API Документация

### Swagger UI

Полная интерактивная документация доступна по адресу:
**`http://localhost:4200/api/docs`**

### Основные endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/auth/register` | Регистрация | ❌ |
| POST | `/api/auth/login` | Вход | ❌ |
| POST | `/api/auth/refresh` | Обновление токена | ❌ |
| POST | `/api/auth/logout` | Выход | ✅ |
| GET | `/api/users/profile` | Профиль | ✅ |
| PATCH | `/api/users/profile` | Обновление профиля | ✅ |
| GET | `/api/products` | Список продуктов | ❌ |
| GET | `/api/products/search` | Поиск | ❌ |
| POST | `/api/cart/add` | В корзину | ✅ |
| GET | `/api/cart` | Корзина | ✅ |
| POST | `/api/orders` | Создать заказ | ✅ |
| GET | `/api/orders` | История заказов | ✅ |
| POST | `/api/orders/:id/repeat` | Повтор заказа | ✅ |
| GET | `/api/favorites` | Избранное | ✅ |
| POST | `/api/favorites/toggle` | В избранное | ✅ |
| GET | `/api/addresses` | Адреса | ✅ |
| POST | `/api/addresses` | Новый адрес | ✅ |
| GET | `/api/banners` | Баннеры | ❌ |
| GET | `/api/home` | Главная страница | ❌ |

### Статусы ответов

| Код | Описание |
|-----|----------|
| 200 | Успешный запрос |
| 201 | Ресурс создан |
| 204 | Ресурс удалён |
| 400 | Ошибка валидации |
| 401 | Неавторизован |
| 403 | Недостаточно прав |
| 404 | Ресурс не найден |
| 409 | Конфликт (дублирование) |

---

## 🗄️ Структура базы данных

### Основные сущности

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER                                      │
│  id, email, password, name, phone, avatar, dateOfBirth, role        │
└─────────────────────────────────────────────────────────────────────┘
           │              │              │              │
           │              │              │              │
    ┌──────┘         ┌────┘         ┌───┘         ┌────┘
    │                │              │             │
    ▼                ▼              ▼             ▼
┌──────────┐   ┌──────────┐  ┌──────────┐  ┌──────────────┐
│ Address  │   │ Favorite │  │ CartItem │  │ RefreshToken │
│ (адреса) │   │(избран.) │  │ (корзина)│  │   (токены)   │
└──────────┘   └────┬─────┘  └────┬─────┘  └──────────────┘
                    │              │
                    │              │
                    ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PRODUCT                                    │
│  id, name, description, image, price, КБЖУ, servingSize, unit       │
└─────────────────────────────────────────────────────────────────────┘
           │                    │
           │                    │
    ┌──────┘               ┌────┘
    │                      │
    ▼                      ▼
┌──────────┐         ┌──────────────────┐
│ Category │         │ ProductIngredient│
│(категории)│         │  (состав продукта)│
└──────────┘         └────────┬─────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │  Ingredient  │
                       │(аллергены)   │
                       └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           ORDER                                     │
│  id, userName, status, paymentMethod, totalAmount, delivery_*, ...  │
└─────────────────────────────────────────────────────────────────────┘
           │
           │
           ▼
    ┌──────────────┐
    │  OrderItem   │
    │(позиции заказа)│
    └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          BANNER                                     │
│  id, image, title, description, link, order, isActive               │
└─────────────────────────────────────────────────────────────────────┘
```

### Ключевые модели

| Модель | Описание |
|--------|----------|
| **User** | Пользователи (email, телефон, аватар, дата рождения, роль USER/ADMIN) |
| **RefreshToken** | Refresh-токены с хешем, deviceId, сроком действия и отзывом |
| **Address** | Адреса доставки (улица, дом, квартира, подъезд, этаж, комментарий) |
| **Product** | Товары (цена, КБЖУ на 100г, размер порции, категория) |
| **Category** | Категории товаров (название, изображение, описание, порядок) |
| **Ingredient** | Ингредиенты (флаги: глютен, молочка, орехи, соя, яйца) |
| **ProductIngredient** | Связь продуктов с ингредиентами (количество, единица) |
| **CartItem** | Корзина (связь пользователь + товар + количество) |
| **Favorite** | Избранное (связь пользователь + товар) |
| **Order** | Заказы (статусы: PENDING→CONFIRMED→PREPARING→ON_THE_WAY→DELIVERED) |
| **OrderItem** | Позиции заказа (продукт, количество, цена, название) |
| **Banner** | Баннеры для главной страницы (изображение, заголовок, ссылка) |

---

## 📝 Примеры запросов

### Регистрация
```bash
curl -X POST http://localhost:4200/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "Иван Иванов",
    "phone": "+79991234567",
    "dateOfBirth": "15-05-1990"
  }'
```

### Вход
```bash
curl -X POST http://localhost:4200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

### Создание заказа
```bash
curl -X POST http://localhost:4200/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "addressId": "uuid-адреса",
    "paymentMethod": "CARD",
    "orderComment": "Не звонить в дверь"
  }'
```

### Повтор заказа
```bash
curl -X POST http://localhost:4200/api/orders/{orderId}/repeat \
  -H "Authorization: Bearer {accessToken}"
```

---

## 🔒 Безопасность

### Аутентификация
- **Access токен**: 15 минут, передаётся в заголовке `Authorization: Bearer <token>`
- **Refresh токен**: 7 дней, хранится в БД с хешем (Argon2id)
- Привязка к устройству через заголовок `X-Device-Id` или fingerprint

### Хеширование
- Пароли: **Argon2id** (OWASP 2024 рекомендации)
  - memoryCost: 64 MB
  - timeCost: 3 итерации
  - parallelism: 1

### Валидация
- Все входящие данные валидируются через `class-validator`
- Строгая типизация через TypeScript
- DTO для каждого endpoint

### Защита роутов
- `JwtAuthGuard` — проверка JWT токена
- `RolesGuard` — проверка роли пользователя

---


## 👤 Контакты

**Автор**: Максимов Кирилл  
**Email**: kmakismov@yandex.ru  
**GitHub**: [github.com/MaksimovK](https://github.com/MaksimovK)  

**Связанные проекты:**
- [Food Hive Mobile](https://github.com/MaksimovK/food-hive-mobile) — клиентская часть


---


<div align="center">

**Food Hive API** — создано с ❤️ для портфолио

</div>
