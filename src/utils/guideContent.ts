export const guideContent = `
<div class="prose lg:prose-xl justify">
  <h1>Panduan Pengguna Website Dashboard</h1>

  <h2>1. Navigasi di Website</h2>
  <h3>1.1 Navbar (Navigasi)</h3>
  <p>
    Di bagian atas halaman, terdapat menu navigasi yang memungkinkan kamu untuk berpindah antar bagian website. Menu yang tersedia adalah:
  </p>
  <ul>
    <li><strong>Chart:</strong> Menampilkan visualisasi data dalam bentuk grafik.</li>
    <li><strong>Productivity:</strong> Menampilkan tabel produktivitas mesin.</li>
    <li><strong>Record:</strong> Menyediakan catatan atau riwayat data.</li>
    <li><strong>Maps:</strong> Menunjukkan representasi data dalam bentuk peta.</li>
  </ul>

  <h3>1.2 Dashboard</h3>
  <p>
    Bagian utama dari website ini adalah Dashboard, yang terdiri dari berbagai komponen untuk menampilkan data kinerja. Berikut penjelasan masing-masing komponen:
  </p>

  <h4>Chart</h4>
  <p>
    Ini adalah grafik interaktif yang memperlihatkan data performa mesin dalam jangka waktu tertentu. Kamu bisa melihat pola tren atau perubahan performa dengan lebih mudah melalui visualisasi ini.
  </p>

  <h4>Productivity Table</h4>
  <p>
    Tabel ini menampilkan data produktivitas dari mesin-mesin yang sedang dikelola. Setiap baris dalam tabel menunjukkan performa per mesin, seperti waktu aktif, downtime, dan produktivitas harian.
  </p>

  <h4>Record Table</h4>
  <p>Di sini, kamu bisa melihat riwayat penggunaan dan catatan operasional dari mesin-mesin tersebut.</p>

  <h4>Maps</h4>
  <p>Peta ini menampilkan lokasi mesin atau area yang dikelola.</p>

  <h3>1.3 Filter dan Sortir Data</h3>
  <p>
    Beberapa komponen (seperti tabel) mendukung fitur filter dan sortir:
  </p>
  <ul>
    <li><strong>Filter:</strong> Kamu bisa memfilter data berdasarkan periode waktu, jenis mesin, atau kriteria lainnya.</li>
    <li><strong>Sortir:</strong> Klik pada header kolom di tabel untuk mengurutkan data secara naik atau turun.</li>
  </ul>

  <div class="mt-5">
    <h3 class="text-2xl font-bold mb-2">Penjelasan Warna Marker di Peta</h3>
    
    <div class="flex items-center mb-4">
      <div class="w-8 h-8 flex justify-center items-center text-3xl">
        <i class="fas fa-map-marker-alt" style="color: #063599; font-size: 32px;"></i>
      </div>
      <p class="ml-4 text-base">Marker Biru: Output capacity di atas rata-rata.</p>
    </div>

    <div class="flex items-center mb-4">
      <div class="w-8 h-8 flex justify-center items-center text-3xl">
        <i class="fas fa-map-marker-alt" style="color: #910d06; font-size: 32px;"></i>
      </div>
      <p class="ml-4 text-base">Marker Merah: Output capacity di bawah rata-rata.</p>
    </div>

    <div class="flex items-center">
      <div class="relative w-8 h-8 flex justify-center items-center">
        <i class="fas fa-map-marker-alt" style="color: #063599; font-size: 32px;"></i>
        <i class="fas fa-star absolute" style="color: #FFD700; font-size: 16px; top: -10px; left: 10px;"></i>
      </div>
      <p class="ml-4 text-base">Marker dengan Bintang: Output capacity paling tinggi.</p>
    </div>
  </div>

  <h2>2. FAQ (Frequently Asked Questions)</h2>

  <h3>2.1 Apakah saya perlu login untuk mengakses dashboard ini?</h3>
  <p>
    Saat ini, dashboard ini bersifat publik, sehingga siapa saja dapat mengaksesnya tanpa login.
  </p>

  <h3>2.2 Data apa saja yang ditampilkan di dashboard ini?</h3>
  <p>
    Dashboard ini menampilkan data terkait performa mesin, produktivitas, dan riwayat penggunaan.
  </p>

  <h3>2.3 Apa yang harus dilakukan jika data tidak muncul?</h3>
  <ul>
    <li>Coba refresh halaman dengan menekan Ctrl + R (Windows) atau Cmd + R (Mac).</li>
    <li>Pastikan koneksi internet kamu stabil.</li>
    <li>Jika masalah tetap berlanjut, coba akses website dari browser lain atau perangkat lain.</li>
  </ul>
</div>
`;
