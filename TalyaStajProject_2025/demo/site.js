const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.'));

const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

app.post('/login', (req, res) => {
  const { email, sifre } = req.body;
  const kullanici = users.find(u => u.email === email && u.sifre === sifre);
  if (kullanici) {
    res.json({ id: kullanici.id, ad: kullanici.ad, rol: kullanici.rol });
  } else {
    res.status(401).json({ mesaj: "Giriş başarısız" });
  }
});

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

app.post('/spa-rezervasyon', (req, res) => {
  const { name, surname, phone, email, date, time, service } = req.body;
  if (!name || !surname || !phone || !email || !date || !time || !service) {
    return res.status(400).json({ mesaj: 'Tüm alanlar zorunludur.' });
  }

  let reservations = [];
  try {
    reservations = JSON.parse(fs.readFileSync('./reservations.json', 'utf-8'));
  } catch (e) {
    reservations = [];
  }

  const newReservation = {
    id: reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1,
    type: 'spa',
    name,
    surname,
    phone,
    email,
    date,
    time,
    service,
    status: 'aktif',
    createdAt: new Date().toISOString()
  };

  reservations.push(newReservation);
  fs.writeFileSync('./reservations.json', JSON.stringify(reservations, null, 2), 'utf-8');
  res.json({ mesaj: 'Rezervasyon başarıyla oluşturuldu!', reservation: newReservation });
});

app.listen(PORT); 