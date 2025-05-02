# ☕ Website Kasir Cafe

Website kasir cafe ini dibangun menggunakan **Next.js**, **Prisma**, dan **NextAuth** sebagai bagian dari tugas kelompok. Sistem ini mendukung dua jenis pembayaran:

- 💳 Payment Gateway (Midtrans)
- 💵 Pembayaran langsung ke waiter

---

## 🚀 Tech Stack

- [Next.js](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [NextAuth.js](https://authjs.dev/)
- [Material UI](https://mui.com/)
- [Midtrans](https://midtrans.com/) — Payment Integration

---

## ⚙️ Setup dan Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/namamu/website-kasir.git
cd website-kasir
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Environment

Buat file `.env` di root project dan isi seperti berikut:

```env
# === DATABASE ===
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/NAMA_DATABASE"

# === AUTH ===
AUTH_SECRET="jzxzvnpGZUhy/XhdGXBYpo4V6CVfST0ikn7g1d4ZsxA=" # Added by `npx auth`
NEXTAUTH_SECRET=${AUTH_SECRET}
NEXTAUTH_URL=http://localhost:3000

# === API URL ===
NEXT_PUBLIC_API_URL=http://localhost:3000

# === MIDTRANS ===
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

> 📌 Ganti `USERNAME`, `PASSWORD`, `HOST`, `PORT`, dan `NAMA_DATABASE` sesuai dengan pengaturan PostgreSQL lokalmu.

### 4. Setup Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Jika kamu punya file seed:

```bash
npx prisma db seed
```

### 5. Jalankan Project

```bash
npm run dev
```

Akses di: [http://localhost:3000](http://localhost:3000)

---

## 📦 Perintah Penting

| Perintah                 | Fungsi                                     |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Menjalankan website dalam mode development |
| `npm run build`          | Build production                           |
| `npm run start`          | Menjalankan hasil build                    |
| `npx prisma studio`      | Membuka Prisma UI (data explorer)          |
| `npx prisma migrate dev` | Menjalankan migration database             |
| `npx prisma generate`    | Generate Prisma Client                     |

---

## 🔒 Auth & Role

Sistem ini menggunakan **NextAuth.js** untuk otentikasi, dan mendukung peran user seperti:

- Admin
- Kasir
- Pembeli

---

## 💳 Pembayaran

- **Payment Gateway** menggunakan Midtrans (Snap).
- **Bayar Langsung** → akan dicatat ke waiter.

---

## ✨ Fitur Unggulan

- Manajemen Menu & Stok
- Riwayat Penjualan
- Dashboard Kasir
- Pembayaran dengan Midtrans
- Otentikasi & Role-Based Access

---

## 📁 Struktur Direktori (ringkasan)

```
.
├── app/                # Next.js App Router
├── prisma/             # Prisma schema & seed
├── lib/                # Helpers (e.g., API, utils)
├── components/         # UI components
├── public/images/      # Gambar menu, produk, dll
└── .env                # Environment config
```

---

## 🙋‍♂️ Kontribusi

Project ini adalah bagian dari tugas kelompok. Jika kamu ingin kontribusi lebih lanjut, silakan open pull request atau fork dulu.

---

## 📜 Lisensi

MIT © 2025 - Kasir Cafe Team
