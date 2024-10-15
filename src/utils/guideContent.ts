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

  <h2>2. Penjelasan Warna Marker di Peta</h2>
  <p>
    Peta pada dashboard ini dilengkapi dengan marker warna-warni yang menunjukkan status output capacity setiap mesin atau area. Berikut adalah penjelasan mengenai warna-warna marker:
  </p>

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

  <h2>3. Export Data ke PDF</h2>
  <p>
    Di dashboard ini, terdapat fitur untuk mengekspor data produktivitas dan catatan (records) ke dalam bentuk PDF. Fitur ini memudahkan pengguna untuk menyimpan laporan atau data dalam format yang dapat dibagikan atau diarsipkan.
  </p>

  <h3>3.1 Cara Menggunakan Fitur Export ke PDF</h3>
  <ol>
    <li><strong>Filter Data (Opsional):</strong> Sebelum mengekspor data, Anda dapat memfilter atau mencari data yang relevan menggunakan fitur pencarian dan dropdown filter.</li>
    <li><strong>Pilih Halaman yang Ingin Diekspor:</strong> Di bagian atas tabel, Anda bisa memilih halaman awal <em>(Start Page)</em> dan halaman akhir <em>(End Page)</em> yang ingin diekspor. Jika Anda ingin mengekspor seluruh data yang terlihat, tentukan halaman awal sebagai 1 dan halaman akhir sesuai jumlah halaman yang tersedia.</li>
    <li><strong>Klik Tombol Export:</strong> Setelah menentukan halaman, klik tombol <strong>Export Productivity to PDF</strong> untuk mengekspor data produktivitas, atau tombol <strong>Export Record to PDF</strong> untuk mengekspor catatan data. File PDF akan otomatis diunduh ke perangkat Anda.</li>
  </ol>

  <h3>3.2 Contoh Kasus Penggunaan</h3>
  <ul>
    <li><strong>Export Data Produktivitas:</strong> Jika Anda ingin mengekspor data produktivitas dari mesin-mesin yang telah difilter dan ditampilkan di tabel, masukkan halaman yang ingin diekspor, lalu klik tombol <strong>Export Productivity to PDF</strong>.</li>
    <li><strong>Export Record:</strong> Jika Anda ingin mengekspor riwayat penggunaan mesin, pilih tab <em>Records</em> dan gunakan fitur ekspor untuk mengekspor data tersebut ke PDF.</li>
  </ul>

  <h3>3.3 Tips</h3>
  <ul>
    <li>Jika Anda hanya ingin mengekspor sebagian data, gunakan fitur filter terlebih dahulu agar data yang diekspor lebih relevan dan terfokus.</li>
    <li>Pastikan koneksi internet stabil agar proses ekspor berjalan lancar.</li>
  </ul>

  <h2>4. FAQ (Frequently Asked Questions)</h2>

  <h3>4.1 Apakah saya perlu login untuk mengakses dashboard ini?</h3>
  <p>
    Saat ini, dashboard ini bersifat publik, sehingga siapa saja dapat mengaksesnya tanpa login.
  </p>

  <h3>4.2 Data apa saja yang ditampilkan di dashboard ini?</h3>
  <p>
    Dashboard ini menampilkan data terkait performa mesin, produktivitas, dan riwayat penggunaan.
  </p>

  <h3>4.3 Apa yang harus dilakukan jika data tidak muncul?</h3>
  <ul>
    <li>Coba refresh halaman dengan menekan Ctrl + R (Windows) atau Cmd + R (Mac).</li>
    <li>Pastikan koneksi internet kamu stabil.</li>
    <li>Jika masalah tetap berlanjut, coba akses website dari browser lain atau perangkat lain.</li>
  </ul>
</div>
`;
