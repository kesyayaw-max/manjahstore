module.exports = function isWorkingTime() {
  const now = new Date();

  // WIB (UTC+7)
  const wibHour = (now.getUTCHours() + 7) % 24;

  // Jam kerja 09.00 – 21.00 WIB
  return wibHour >= 9 && wibHour < 21;
};
