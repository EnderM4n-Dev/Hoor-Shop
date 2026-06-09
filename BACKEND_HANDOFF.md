# HOOR — راهنمای ساخت بک‌اند (Backend Handoff)

این سند برای ساختِ بک‌اندِ فروشگاهِ اینترنتیِ «هور» (عینک چوبی دست‌ساز) نوشته شده.
فرانت‌اند کامل و آماده است؛ هدف، اتصالِ آن به یک بک‌اندِ واقعی است.

> **نحوه‌ی استفاده:** این فایل را به **Claude Code** بده و بگو مرحله‌به‌مرحله پیش برود.
> از بالای فایل شروع کن و هر بخش (Phase) را کامل کن، تست کن، بعد به بخش بعد برو.

---

## 0) وضعیت فعلی فرانت‌اند

- **استک:** React 18 + Babel (در مرورگر، بدون build) + CSS خالص. کاملاً RTL و فارسی.
- **داده‌ها:** الان همه‌چیز در `localStorage` ذخیره می‌شود (کلیدها با پیشوند `hoor_`).
- **فایل‌های کلیدی:**
  - `data.jsx` → محصولات، دسته‌ها، کاربرِ نمونه، سفارش‌های نمونه
  - `app.jsx` → state سراسری و router ساده (route در state)
  - `components.jsx`, `pages1/2/3.jsx`, `admin.jsx` → UI
- **چیزهایی که الان شبیه‌سازی‌اند و باید واقعی شوند:**
  1. ذخیره‌ی محصولات/سفارش‌ها/کاربر → دیتابیس
  2. درگاه پرداخت (در `pages2.jsx` تابع `pay()`) → درگاهِ واقعی
  3. ورود/ثبت‌نام کاربر → احراز هویت واقعی
  4. پنل مدیریت (CRUD در `app.jsx`) → API واقعی

---

## 1) استک پیشنهادی بک‌اند

- **فریم‌ورک:** Next.js 14 (App Router) — هم فرانت هم بک (API Routes) یک‌جا. مناسبِ مهاجرتِ تدریجیِ این UI.
- **دیتابیس:** PostgreSQL
- **ORM:** Prisma
- **احراز هویت:** ورود با شماره موبایل + کد پیامکی (OTP) — رایجِ ایران
- **آپلود عکس:** ذخیره روی فضای ابری (S3/آروان) یا پوشه‌ی محلی در فاز اول
- **اعتبارسنجی:** Zod

> **توجه مهاجرت:** UI فعلی با Babel-in-browser است. در Next.js باید کامپوننت‌ها به فایل‌های `.jsx`/`.tsx` واقعی منتقل و با bundler ساخته شوند. ساختار و استایل‌ها (`styles.css`) قابل استفاده‌ی مجدد است.

---

## 2) مدل داده (Prisma Schema)

```prisma
model Product {
  id          String   @id @default(cuid())
  slug        String   @unique          // مثل: sarmeh
  name        String                    // عینک سرمه
  tagline     String?
  description String?
  price       Int                       // به تومان
  oldPrice    Int?
  wood        String                    // walnut | beech | chenar | wenge
  woodColor   String                    // light | walnut | orange | dark
  shape       String                    // cateye | round | square | rect | hex
  gender      String                    // women | men | uni
  stock       Int      @default(0)
  badge       String?
  rating      Float    @default(5)
  reviews     Int      @default(0)
  images      ProductImage[]
  orderItems  OrderItem[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  url       String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  sort      Int     @default(0)
}

model User {
  id        String   @id @default(cuid())
  phone     String   @unique            // ۰۹xxxxxxxxx
  name      String?
  email     String?
  city      String?
  address   String?
  postal    String?
  orders    Order[]
  createdAt DateTime @default(now())
}

model Order {
  id         String      @id @default(cuid())
  code       String      @unique         // HR-1403xx
  user       User        @relation(fields: [userId], references: [id])
  userId     String
  status     String      @default("processing") // processing|shipped|delivered|canceled
  total      Int
  shipMethod String?
  items      OrderItem[]
  // snapshot نشانی در زمان خرید
  shipName   String?
  shipPhone  String?
  shipCity   String?
  shipAddress String?
  shipPostal String?
  payRef     String?                     // کد پیگیری درگاه
  createdAt  DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  qty       Int
  price     Int                          // قیمت در لحظه‌ی خرید
}

model OtpCode {
  id        String   @id @default(cuid())
  phone     String
  code      String
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Admin {
  id        String @id @default(cuid())
  username  String @unique
  passHash  String
}
```

> **داده‌ی اولیه (seed):** ۸ محصولِ موجود در `data.jsx` (سرمه، زهره، نگار، هما، افسون، دوران، زاویه، کویر) را در یک فایل seed وارد کن. تمام مقادیرِ تَکسونومی (چوب، رنگ، فرم، جنسیت) همان idهای انگلیسیِ موجود در `data.jsx` هستند.

---

## 3) API Endpoints موردنیاز

### عمومی (فروشگاه)
- `GET  /api/products` — لیست، با فیلتر `?gender=&wood=&shape=&q=&sort=`
- `GET  /api/products/[slug]` — جزئیات یک محصول
- `GET  /api/products/featured` — منتخب‌ها

### سبد و سفارش
- سبد خرید سمتِ کلاینت می‌ماند (localStorage)؛ فقط در لحظه‌ی پرداخت به سرور می‌رود.
- `POST /api/orders` — ساخت سفارش (آیتم‌ها + نشانی) → خروجی: `orderCode` و لینک پرداخت
- `GET  /api/orders/[code]` — وضعیت یک سفارش
- `GET  /api/me/orders` — سفارش‌های کاربرِ واردشده

### احراز هویت (OTP)
- `POST /api/auth/request-otp` — ورودی `{phone}` → ارسال پیامک کد
- `POST /api/auth/verify-otp` — ورودی `{phone, code}` → ساخت session/JWT
- `POST /api/auth/logout`
- `GET  /api/me` — پروفایل کاربر
- `PUT  /api/me` — ویرایش پروفایل/نشانی

### پرداخت
- `POST /api/payment/start` — ورودی `{orderCode}` → ریدایرکت به درگاه (زرین‌پال)
- `GET  /api/payment/callback` — بازگشت از درگاه → تأیید تراکنش → آپدیت وضعیت سفارش

### مدیریت (محافظت‌شده با لاگین ادمین)
- `POST   /api/admin/login`
- `GET/POST/PUT/DELETE /api/admin/products` — CRUD محصولات
- `GET  /api/admin/orders` + `PUT /api/admin/orders/[id]` — تغییر وضعیت
- `GET  /api/admin/customers`
- `POST /api/admin/upload` — آپلود عکس محصول

---

## 4) درگاه پرداخت (زرین‌پال — نمونه)

جریان کار:
1. کاربر «پرداخت» را می‌زند → `POST /api/payment/start` با `orderCode`.
2. سرور به زرین‌پال `PaymentRequest` می‌زند، `Authority` می‌گیرد، کاربر را به صفحه‌ی درگاه ریدایرکت می‌کند.
3. بعد از پرداخت، زرین‌پال به `callback` برمی‌گردد → سرور `PaymentVerification` می‌زند.
4. اگر موفق بود: وضعیت سفارش `processing`، `payRef` ذخیره، موجودی محصولات کم می‌شود، کاربر به صفحه‌ی «سفارش ثبت شد» می‌رود.

> **پیش‌نیاز:** مرچنت‌کدِ زرین‌پال (نیازمندِ نمادِ اعتماد/اینماد و حساب بانکیِ کسب‌وکار).
> در فاز توسعه می‌توان از **سندباکسِ زرین‌پال** استفاده کرد.

محلِ فعلیِ شبیه‌سازی برای جایگزینی: تابع `pay()` در `pages2.jsx` (کامپوننت `Checkout`).

---

## 5) ترتیب اجرا (به Claude Code همین ترتیب را بده)

- **Phase 1 — راه‌اندازی:** پروژه‌ی Next.js + Prisma + PostgreSQL. اسکیمای بالا را بساز و migrate کن. seed را با ۸ محصول بزن.
- **Phase 2 — API عمومی:** endpointهای محصولات. اتصال صفحه‌ی فروشگاه و محصول به API واقعی (به‌جای `data.jsx`).
- **Phase 3 — احراز هویت OTP:** request/verify + session. پنل مشتری به داده‌ی واقعی وصل شود.
- **Phase 4 — سفارش:** ساخت سفارش از سبد، صفحه‌ی پیگیری.
- **Phase 5 — پرداخت:** اتصال زرین‌پال (اول سندباکس).
- **Phase 6 — پنل مدیریت:** لاگین ادمین + CRUD محصولات + آپلود عکس + مدیریت سفارش‌ها.
- **Phase 7 — استقرار:** دامنه، هاست، SSL، متغیرهای محیطی.

بعد از هر Phase: تست کن که کار می‌کند، بعد برو مرحله‌ی بعد.

---

## 6) متغیرهای محیطی (.env)

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
SMS_API_KEY=...              # سرویس پیامک (مثل کاوه‌نگار/فراز)
ZARINPAL_MERCHANT_ID=...
NEXT_PUBLIC_BASE_URL=https://hoor.ir
```

---

## 7) کارهای غیرفنیِ موازی (به‌عهده‌ی صاحبِ کسب‌وکار)

این‌ها زمان‌برند، از همین حالا شروع کن:
- ثبتِ کسب‌وکار/شرکت
- گرفتنِ **نماد اعتماد الکترونیکی (اینماد)**
- افتتاح/معرفیِ حساب بانکیِ کسب‌وکار برای درگاه
- خرید دامنه (مثلاً `hoor.ir` از ایرنیک) و هاست
- ثبت‌نام در سرویس پیامک (برای OTP)

---

ساخته‌شده برای برندِ **هور ایرانی** 🌿
