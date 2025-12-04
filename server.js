const express = require("express");
const fs = require("fs");
const path = require("path");

const ADMIN_PASS = "1234";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const DATA_PATH = path.join(__dirname, "data", "latest.json");
const ARCHIVE_PATH = path.join(__dirname, "data", "archive.json");

// ✅ Ana sayfa için son gönderi
app.get("/get-post", (req, res) => {
  const data = fs.readFileSync(DATA_PATH, "utf-8");
  res.json(JSON.parse(data));
});

// ✅ Arşiv verisi
app.get("/get-archive", (req, res) => {
  const data = fs.readFileSync(ARCHIVE_PATH, "utf-8");
  res.json(JSON.parse(data));
});

// ✅ Admin yeni içerik kaydı
app.post("/admin-save", (req, res) => {
  const { text, password } = req.body;

  if (password !== ADMIN_PASS) {
    return res.send("HATALI ŞİFRE");
  }

  const now = new Date();
  const tarih = now.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const newPost = {
    text: text,
    date: tarih
  };

  // ✅ Son içerik (ana sayfa)
  fs.writeFileSync(DATA_PATH, JSON.stringify(newPost, null, 2));

  // ✅ Arşiv kaydı (geçmiş)
  let archive = [];

  if (fs.existsSync(ARCHIVE_PATH)) {
    const raw = fs.readFileSync(ARCHIVE_PATH, "utf-8");
    archive = raw ? JSON.parse(raw) : [];
  }

  archive.unshift(newPost);
  fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(archive, null, 2));

  res.send("KAYDEDİLDİ");
});

app.listen(3000, () => {
  console.log("Site çalışıyor → http://localhost:3000");
  const ARCHIVE_PATH = path.join(__dirname, "data", "archive.json");

app.get("/get-archive", (req, res) => {
  if (!fs.existsSync(ARCHIVE_PATH)) {
    return res.json([]);
  }

  const data = fs.readFileSync(ARCHIVE_PATH, "utf-8");
  const archive = JSON.parse(data);
  res.json(archive.reverse()); // en yeni en üstte
});

});
