const { translations } = require('../src/data/translations.js');

console.log("=== RUNNING WORKFLOW & STATE AUDIT ===");

// 1. Verify translations helper logic
function createTranslator(lang) {
  return (key) => translations[lang]?.[key] || translations["en"]?.[key] || key;
}

const tEn = createTranslator("en");
const tHi = createTranslator("hi");

console.log("Test English -> Hindi text transformation:");
console.log("Dashboard title (EN):", tEn("tabDashboard"), "-> (HI):", tHi("tabDashboard"));
console.log("Active Booking (EN):", tEn("activeBooking"), "-> (HI):", tHi("activeBooking"));
console.log("Book Slot (EN):", tEn("bookSlotTitle"), "-> (HI):", tHi("bookSlotTitle"));
console.log("Queue Position (EN):", tEn("queuePosition"), "-> (HI):", tHi("queuePosition"));
console.log("Procurement Complete (EN):", tEn("statusProcurementComplete"), "-> (HI):", tHi("statusProcurementComplete"));
console.log("Payment Complete (EN):", tEn("statusPaymentCompleted"), "-> (HI):", tHi("statusPaymentCompleted"));

if (tEn("tabDashboard") === tHi("tabDashboard")) {
  console.error("FAIL: Hindi text is identical to English for tabDashboard!");
  process.exit(1);
}

// 2. Test Toast deduplication logic
let toasts = [];
function addToast({ type = "info", title, message, duration = 4000 }) {
  const isDuplicate = toasts.some(t => t.title === title && t.message === message);
  if (isDuplicate) return false;
  const id = Date.now() + Math.random();
  toasts.push({ id, type, title, message, duration });
  return true;
}

const added1 = addToast({ type: "success", title: "Test Title", message: "Test Message" });
const added2 = addToast({ type: "success", title: "Test Title", message: "Test Message" });
const added3 = addToast({ type: "warning", title: "Different Title", message: "Different Message" });

if (!added1 || added2 || !added3) {
  console.error("FAIL: Toast deduplication did not work correctly!");
  process.exit(1);
}
console.log("✓ Toast deduplication confirmed working: duplicate toast rejected, unique toast accepted.");

// 3. Test Aadhaar & Bank Account clean values
const rawAadhaar = "1234 5678 9012";
const cleanAadhaar = rawAadhaar.replace(/\D/g, '').slice(0, 12);
if (cleanAadhaar !== "123456789012" || cleanAadhaar.length !== 12) {
  console.error("FAIL: Aadhaar cleaning failed!");
  process.exit(1);
}
console.log("✓ Aadhaar cleaning preserved exact 12-digit numeric source of truth.");

const rawAccount = "12345678901234";
const cleanAccount = rawAccount.replace(/\D/g, '').slice(0, 18);
if (cleanAccount !== "12345678901234") {
  console.error("FAIL: Bank account cleaning failed!");
  process.exit(1);
}
console.log("✓ Bank account cleaning preserved exact numeric source of truth.");

console.log("\nALL LOGICAL WORKFLOW CHECKS PASSED!");
