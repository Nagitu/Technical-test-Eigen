# README

## Penggunaan Aplikasi

### Persiapan Awal

1. **Masuk ke Direktori Proyek**

   ```bash
   cd ./Backend-test-case
   ```

2. ** Install Dependencies **

Untuk menginstal semua dependencies yang dibutuhkan, jalankan perintah berikut:

  ```bash
  npm install
```

3.**Konfigurasi Database**


Aplikasi ini menggunakan database PostgreSQL yang sudah dikonfigurasi di knexfile.js.

Jika Anda ingin menggunakan database lain, ubah konfigurasi connection di knexfile.js sesuai dengan database yang ingin digunakan.

Migrasi dan Seed Database
Setelah mengonfigurasi database, jalankan perintah berikut untuk melakukan migrasi database:

```bash
npx knex migrate:latest
```
Kemudian, jalankan perintah berikut untuk memasukkan data awal (seed):

```bash
npx knex seed:run
```

4.**Menjalankan Server**

Untuk memulai server, jalankan perintah berikut:

```bash
npm run dev
```

Aplikasi ini akan berjalan di port 3000.

5.**Unit Testing**

Aplikasi ini menggunakan Jest untuk unit testing. Untuk menjalankan tes, ketik perintah berikut:

```bash
npm test
```
