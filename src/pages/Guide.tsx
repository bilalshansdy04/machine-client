export default function Guide() {
  return (
    <div className="h-full">
        <div className="flex items-center gap-2 bg-[#eff3f8] px-[10.5rem] py-2 h-20 justify-between">
          <h1 className="text-3xl font-normal text-slate-600">Guide</h1>
          <p>
            <a href="/">Home</a> / Guide
          </p>
        </div>
        <div className="px-[10.5rem] py-10">
          <div className="prose lg:prose-xl justify">
            <h1>Panduan Pengguna Website Dashboard</h1>

            <h2>1. Navigasi di Website</h2>

            <h3>1.1 Navbar (Navigasi)</h3>
            <p>
              Di bagian atas halaman, terdapat menu navigasi yang memungkinkan
              kamu untuk berpindah antar bagian website. Menu yang tersedia
              adalah:
            </p>
            <ul>
              <li>
                <strong>Chart:</strong> Menampilkan visualisasi data dalam
                bentuk grafik.
              </li>
              <li>
                <strong>Productivity:</strong> Menampilkan tabel produktivitas
                mesin.
              </li>
              <li>
                <strong>Record:</strong> Menyediakan catatan atau riwayat data.
              </li>
              <li>
                <strong>Maps:</strong> Menunjukkan representasi data dalam
                bentuk peta.
              </li>
            </ul>

            <h3>1.2 Dashboard</h3>
            <p>
              Bagian utama dari website ini adalah Dashboard, yang terdiri dari
              berbagai komponen untuk menampilkan data kinerja. Berikut
              penjelasan masing-masing komponen:
            </p>

            <h4>Chart</h4>
            <p>
              Ini adalah grafik interaktif yang memperlihatkan data performa
              mesin dalam jangka waktu tertentu. Kamu bisa melihat pola tren
              atau perubahan performa dengan lebih mudah melalui visualisasi
              ini.
            </p>

            <h4>Productivity Table</h4>
            <p>
              Tabel ini menampilkan data produktivitas dari mesin-mesin yang
              sedang dikelola. Setiap baris dalam tabel menunjukkan performa per
              mesin, seperti waktu aktif, downtime, dan produktivitas harian.
            </p>

            <h4>Record Table</h4>
            <p>
              Di sini, kamu bisa melihat riwayat penggunaan dan catatan
              operasional dari mesin-mesin tersebut.
            </p>

            <h4>Maps</h4>
            <p>Peta ini menampilkan lokasi mesin atau area yang dikelola.</p>

            <h3>1.3 Filter dan Sortir Data</h3>
            <p>
              Beberapa komponen (seperti tabel) mendukung fitur filter dan
              sortir:
            </p>
            <ul>
              <li>
                <strong>Filter:</strong> Kamu bisa memfilter data berdasarkan
                periode waktu, jenis mesin, atau kriteria lainnya.
              </li>
              <li>
                <strong>Sortir:</strong> Klik pada header kolom di tabel untuk
                mengurutkan data secara naik atau turun.
              </li>
            </ul>

            <h2>2. FAQ (Frequently Asked Questions)</h2>

            <h3>2.1 Apakah saya perlu login untuk mengakses dashboard ini?</h3>
            <p>
              Saat ini, dashboard ini bersifat publik, sehingga siapa saja dapat
              mengaksesnya tanpa login.
            </p>

            <h3>2.2 Data apa saja yang ditampilkan di dashboard ini?</h3>
            <p>
              Dashboard ini menampilkan data terkait performa mesin,
              produktivitas, dan riwayat penggunaan.
            </p>

            <h3>2.3 Apa yang harus dilakukan jika data tidak muncul?</h3>
            <ul>
              <li>
                Coba refresh halaman dengan menekan Ctrl + R (Windows) atau Cmd
                + R (Mac).
              </li>
              <li>Pastikan koneksi internet kamu stabil.</li>
              <li>
                Jika masalah tetap berlanjut, coba akses website dari browser
                lain atau perangkat lain.
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
}