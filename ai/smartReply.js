module.exports = function smartReply(text) {
  text = text.toLowerCase();

  const intents = [
    {
      name: "harga",
      keywords: ["harga", "price", "berapa"],
      reply: "💰 **Harga bisa kamu lihat di katalog ya.**\nGunakan command katalog sesuai channel."
    },
    {
      name: "payment",
      keywords: ["bayar", "payment", "qris", "tf"],
      reply: "💳 **Pembayaran via QRIS.**\nSilakan buka ticket lalu klik tombol **Bayar**."
    },
    {
      name: "order",
      keywords: ["order", "pesan", "beli", "ticket"],
      reply: "🎟 **Untuk order, silakan buka ticket.**\nAdmin akan memproses pesanan kamu."
    },
    {
      name: "durasi",
      keywords: ["lama", "durasi", "estimasi", "berapa lama"],
      reply: "⏱ **Estimasi tergantung antrian & layanan.**\nAdmin akan konfirmasi di ticket."
    },
    {
      name: "admin",
      keywords: ["admin", "cs", "support"],
      reply: "👨‍💼 **Admin akan membalas secepatnya.**\nMohon bersabar ya 🙏"
    },
    {
      name: "bukti",
      keywords: ["sudah bayar", "bukti", "transfer"],
      reply: "🧾 **Silakan kirim bukti pembayaran di ticket.**\nAdmin akan segera cek."
    },
    {
      name: "cancel",
      keywords: ["batal", "cancel", "refund"],
      reply: "❌ **Pembatalan mengikuti aturan toko.**\nSilakan diskusikan dengan admin di ticket."
    }
  ];

  return intents.find(i =>
    i.keywords.some(k => text.includes(k))
  );
};
