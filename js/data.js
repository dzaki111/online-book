// File: data.js (Final Check Path Gambar)

const dataUsers = [
    // ... data users ...
    { id: 1, nama: "Rina Wulandari", email: "rina@gmail.com", password: "rina123", role: "User" },
    { id: 2, nama: "Dzaki Arif Rahman", email: "zaki@gmail.com", password: "zaki", role: "User" },
    { id: 3, nama: "Siti Marlina", email: "siti@gmail.com", password: "siti123", role: "Admin" }
];

// Data Katalog Buku
let dataKatalogBuku = [ 
    {
        kodeBarang: "ASIP4301",
        namaBarang: "Pengantar Ilmu Komunikasi",
        jenisBarang: "Buku Ajar",
        edisi: "2",
        stok: 548,
        harga: 180000, 
        cover: "assets/img/pengantar_komunikasi.jpg" 
    },
    {
        kodeBarang: "EKMA4002",
        namaBarang: "Manajemen Keuangan",
        jenisBarang: "Buku Ajar",
        edisi: "3",
        stok: 312,
        harga: 195000, 
        cover: "assets/img/manajemen_keuangan.jpg" 
    },
    {
        kodeBarang: "PEBI4201",
        namaBarang: "Mikrobiologi Dasar",
        jenisBarang: "Buku Ajar",
        edisi: "1",
        stok: 250,
        harga: 170000, 
        cover: "assets/img/mikrobiologi.jpg" 
    },
    {
        kodeBarang: "PAUD4302",
        namaBarang: "Perkembangan Anak Usia Dini",
        jenisBarang: "Buku Ajar",
        edisi: "4",
        stok: 400,
        harga: 165000, 
        cover: "assets/img/paud_perkembangan.jpg" 
    },
    {
        kodeBarang: "ADPU4334",
        namaBarang: "Kepemimpinan",
        jenisBarang: "Buku Ajar",
        edisi: "2",
        stok: 150,
        harga: 155000, 
        cover: "assets/img/kepemimpinan.jpg" 
    }
];

// Data Tracking Pengiriman (dikosongkan untuk kesederhanaan)
const dataTrackingPengiriman = {};

// Fungsi Format Rupiah (Fall-back)
if (typeof window.formatRupiah === 'undefined') {
    window.formatRupiah = function(angka) {
        if (typeof angka !== 'number') return 'Rp 0';
        const numberString = Math.floor(angka).toString(); 
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