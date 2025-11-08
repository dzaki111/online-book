/**
 * File: app.js
 * Bertanggung jawab untuk logika umum: Greeting, Render Katalog Grid, Detail Modal, Pencarian, dan Cart.
 * Solusi untuk masalah: Modal tidak muncul, dan Greeting yang menampilkan nama user lama.
 * Asumsi: data.js (dataKatalogBuku, formatRupiah) sudah dimuat sebelumnya.
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Elemen DOM ---
    const bookGrid = document.getElementById('book-grid');
    const bookDetailModal = document.getElementById('book-detail-modal');
    const closeDetailBtn = document.querySelector('.detail-close-btn');
    const modalBeliBtn = document.getElementById('modal-beli-btn');
    const searchInput = document.getElementById('search-input'); 
    
    // Pastikan dataKatalogBuku tersedia dari data.js
    if (typeof dataKatalogBuku === 'undefined') {
        console.error("Data katalog buku tidak ditemukan. Pastikan data.js dimuat.");
        return;
    }


    // --- 1. Logika Greeting (FINAL FIX) ---
    function showGreeting() {
        const greetingElement = document.getElementById('greeting-message');
        
        // 🔥 FIX PENTING: Hapus data user lama (Agus Pranoto) dan atur default
        localStorage.removeItem('currentUser'); 
        let userName = "Pengunjung"; 

        if (greetingElement) {
            const hour = new Date().getHours();
            let greeting;
            
            if (hour >= 4 && hour < 11) { greeting = "Selamat Pagi"; } 
            else if (hour >= 11 && hour < 15) { greeting = "Selamat Siang"; } 
            else if (hour >= 15 && hour < 18) { greeting = "Selamat Sore"; } 
            else { greeting = "Selamat Malam"; }

            greetingElement.textContent = `${greeting}, ${userName}`; 
        }
    }
    showGreeting(); // Panggil saat DOMContentLoaded


    // --- 2. Fungsi Render Grid Katalog ---
    function renderKatalogGrid(booksToRender) { 
        if (!bookGrid) return; 

        bookGrid.innerHTML = ''; 
        
        if (booksToRender.length === 0) {
            bookGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; padding-top: 20px;">Tidak ada buku yang ditemukan. Coba kata kunci lain.</p>';
            return;
        }

        booksToRender.forEach(buku => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            
            // Logika Klik (Memanggil fungsi global showBookDetail)
            // Mengganti .onclick langsung pada div agar lebih rapih.
            bookItem.addEventListener('click', () => window.showBookDetail(buku.kodeBarang)); 

            bookItem.innerHTML = `
                <img 
                    src="${buku.cover}" 
                    alt="Cover ${buku.namaBarang}" 
                    class="book-cover-img"
                    onerror="this.onerror=null;this.src='assets/img/placeholder.png';"
                >
                <div class="book-title" title="${buku.namaBarang}">${buku.namaBarang}</div>
                <p style="color: var(--secondary-color); font-weight: bold;">${window.formatRupiah(buku.harga)}</p>
                <button class="book-action-button">
                    <i class="fas fa-eye"></i> Lihat Detail
                </button>
            `;
            
            bookGrid.appendChild(bookItem);
        });
    }

    // Panggil pertama kali untuk menampilkan semua buku
    renderKatalogGrid(dataKatalogBuku); 


    // --- 3. Logika Pencarian Buku (Search Filter) ---
    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        const filteredBooks = dataKatalogBuku.filter(buku => 
            buku.namaBarang.toLowerCase().includes(searchTerm) ||
            buku.kodeBarang.toLowerCase().includes(searchTerm) ||
            buku.jenisBarang.toLowerCase().includes(searchTerm)
        );

        renderKatalogGrid(filteredBooks);
    }

    // Event Listener untuk Search Input
    if (searchInput) {
        searchInput.addEventListener('keyup', filterBooks); 
        searchInput.addEventListener('input', filterBooks); 
    }


    // --- 4. Logika Menampilkan Detail Buku (Modal) ---
    // Dibuat global agar bisa dipanggil dari renderKatalogGrid
    window.showBookDetail = function(kodeBarang) {
        const buku = dataKatalogBuku.find(b => b.kodeBarang === kodeBarang);
        
        if (!buku) {
            alert("Detail buku tidak ditemukan.");
            return;
        }
        
        // Isi konten modal
        document.getElementById('detail-cover-img').src = buku.cover; 
        document.getElementById('detail-cover-img').alt = `Cover ${buku.namaBarang}`;
        document.getElementById('detail-judul').textContent = buku.namaBarang;
        document.getElementById('detail-kode').textContent = buku.kodeBarang;
        document.getElementById('detail-harga').textContent = window.formatRupiah(buku.harga);
        document.getElementById('detail-jenis').textContent = buku.jenisBarang;
        document.getElementById('detail-edisi').textContent = buku.edisi;
        document.getElementById('detail-stok').textContent = buku.stok;
        
        // Teks Keterangan (Contoh/Dummy)
        document.getElementById('detail-keterangan').textContent = 
            `Buku ajar ${buku.namaBarang}, edisi ${buku.edisi}, merupakan sumber utama mata kuliah ${buku.kodeBarang}. Saat ini tersedia ${buku.stok} kopi di gudang.`;

        // Atur tombol Beli
        modalBeliBtn.textContent = (buku.stok > 0) ? `Beli Sekarang (${window.formatRupiah(buku.harga)})` : 'Stok Habis';
        modalBeliBtn.disabled = (buku.stok <= 0);
        modalBeliBtn.dataset.kode = buku.kodeBarang;
        
        // Tampilkan Modal
        bookDetailModal.style.display = 'block';
    }


    // --- 5. Logika Tombol Aksi "Beli Sekarang" di Modal ---
    if (modalBeliBtn) {
        modalBeliBtn.addEventListener('click', function() {
            const kode = this.dataset.kode;
            const buku = dataKatalogBuku.find(b => b.kodeBarang === kode);

            if (buku && buku.stok > 0) {
                window.addToCart(kode);
                bookDetailModal.style.display = 'none'; // Tutup modal
            } else {
                alert("Maaf, stok buku habis.");
            }
        });
    }

    // --- 6. Logika Tambah ke Keranjang (Harus Global/Window) ---
    window.addToCart = function(kodeBarang) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.kodeBarang === kodeBarang);
        const buku = dataKatalogBuku.find(b => b.kodeBarang === kodeBarang);
        
        if (!buku || buku.stok <= 0) {
            alert("Maaf, stok buku ini habis.");
            return;
        }
        
        if (existingItem) {
            existingItem.jumlah += 1;
        } else {
            cart.push({
                kodeBarang: buku.kodeBarang,
                namaBarang: buku.namaBarang,
                harga: buku.harga,
                jumlah: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`"${buku.namaBarang}" ditambahkan ke keranjang!`);
    }

    // --- 7. Logika Modal Close ---
    if (closeDetailBtn) {
        closeDetailBtn.onclick = function() {
            bookDetailModal.style.display = 'none';
        }
    }

    // Tutup modal jika klik di luar area modal
    window.onclick = function(event) {
        if (event.target === bookDetailModal) {
            bookDetailModal.style.display = "none";
        }
    }

    // --- 8. Logika Reset Data (Bottom Nav) ---
    const resetBtnNav = document.getElementById('logout-btn-nav');
    if (resetBtnNav) {
        resetBtnNav.addEventListener('click', function(e) {
            e.preventDefault(); 
            if (confirm("Reset Aplikasi? Ini akan MENGOSONGKAN Keranjang Belanja Anda.")) {
                localStorage.removeItem('currentUser'); 
                localStorage.removeItem('cart'); 
                window.location.href = 'index.html';
            }
        });
    }

    // --- 9. Format Rupiah Fallback (Jika belum didefinisikan di data.js) ---
    if (typeof window.formatRupiah === 'undefined') {
        window.formatRupiah = function(angka) {
            if (typeof angka !== 'number') return 'Rp 0';
            const numberString = Math.floor(angka).toString(); // Ambil bilangan bulat
            const sisa = numberString.length % 3;
            let rupiah = numberString.substr(0, sisa);
            const ribuan = numberString.substr(sisa).match(/\d{3}/g);
            
            if (ribuan) {
                const separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }
            return 'Rp ' + rupiah;
        }
    }
});