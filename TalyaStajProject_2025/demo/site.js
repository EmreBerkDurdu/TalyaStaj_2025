const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

// Kullanıcıları oku
const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

// Giriş endpoint'i
app.post('/login', (req, res) => {
  const { email, sifre } = req.body;
  const kullanici = users.find(u => u.email === email && u.sifre === sifre);
  if (kullanici) {
    res.json({ id: kullanici.id, ad: kullanici.ad, rol: kullanici.rol });
  } else {
    res.status(401).json({ mesaj: "Giriş başarısız" });
  }
});

// Yetki kontrolü örneği (isteğe bağlı)
app.post('/rezervasyon-yap', (req, res) => {
  const { id, islem } = req.body;
  const kullanici = users.find(u => u.id === id);
  if (!kullanici) return res.status(401).json({ mesaj: "Kullanıcı bulunamadı" });

  const yetkiler = {
    musteri: ["rezervasyonYap", "gecmisRezervasyonlar", "rezervasyonIptal"],
    personel: ["tumRezervasyonlar", "rezervasyonEkle", "rezervasyonDuzenle", "rezervasyonIptal"],
    yonetici: ["raporlama", "kullaniciYonetimi", "hizmetYonetimi", "tumRezervasyonlar", "rezervasyonEkle", "rezervasyonDuzenle", "rezervasyonIptal"]
  };

  if (yetkiler[kullanici.rol].includes(islem)) {
    res.json({ mesaj: "İşlem başarılı, yetkiniz var." });
  } else {
    res.status(403).json({ mesaj: "Bu işlemi yapmaya yetkiniz yok." });
  }
});

app.listen(PORT, () => {
  console.log(`Demo sunucu çalışıyor: http://localhost:${PORT}`);
}); 