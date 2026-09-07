const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("VERIFYING 4 TARGETED UI/UX REQUIREMENTS");
console.log("==================================================");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

const root = 'c:/Users/nihal/OneDrive/Documents/sih26';

// 1. AADHAAR + BANK ACCOUNT VISIBILITY TOGGLE
const landingPage = fs.readFileSync(path.join(root, 'src/components/LandingPage.jsx'), 'utf8');
const farmerProfile = fs.readFileSync(path.join(root, 'src/components/farmer/FarmerProfile.jsx'), 'utf8');
const paymentTracker = fs.readFileSync(path.join(root, 'src/components/farmer/PaymentTracker.jsx'), 'utf8');

// A) Aadhaar Toggle in LandingPage
assert(landingPage.includes('showAadhaar') && landingPage.includes('setShowAadhaar'), "LandingPage: showAadhaar state hook exists");
assert(landingPage.includes('showAadhaar ? "text" : "password"'), "LandingPage: Aadhaar input toggles between text and password");
assert(landingPage.includes('onClick={() => setShowAadhaar(!showAadhaar)}'), "LandingPage: Aadhaar eye toggle click handler switches state");
assert(landingPage.includes('<EyeOff') && landingPage.includes('<Eye'), "LandingPage: Eye and EyeOff icons used for toggle");
assert(landingPage.includes('cleanAadhaar = aadhaarNumber.replace(/\\s/g, \'\')') && landingPage.includes('^\\d{12}$'), "LandingPage: Aadhaar validation uses real clean value");

// B) Bank Account Toggle in LandingPage
assert(landingPage.includes('showAccountNumber') && landingPage.includes('setShowAccountNumber'), "LandingPage: showAccountNumber state hook exists");
assert(landingPage.includes('showAccountNumber ? "text" : "password"'), "LandingPage: Bank account input toggles between text and password");
assert(landingPage.includes('showConfirmAccountNumber') && landingPage.includes('setShowConfirmAccountNumber'), "LandingPage: showConfirmAccountNumber state hook exists");
assert(landingPage.includes('showConfirmAccountNumber ? "text" : "password"'), "LandingPage: Confirm account input toggles between text and password");

// C) Bank Account Toggle in FarmerProfile
assert(farmerProfile.includes('showAccount') && farmerProfile.includes('setShowAccount'), "FarmerProfile: showAccount state hook exists");
assert(farmerProfile.includes('showAccount ? "text" : "password"'), "FarmerProfile: Account input toggles between text and password");
assert(farmerProfile.includes('showConfirmAccount') && farmerProfile.includes('setShowConfirmAccount'), "FarmerProfile: showConfirmAccount state hook exists");
assert(farmerProfile.includes('showConfirmAccount ? "text" : "password"'), "FarmerProfile: Confirm account input toggles between text and password");

// D) Bank Account Toggle in PaymentTracker
assert(paymentTracker.includes('showAccount') && paymentTracker.includes('setShowAccount'), "PaymentTracker: showAccount state hook exists");
assert(paymentTracker.includes('showAccount ? "text" : "password"'), "PaymentTracker: Account input toggles between text and password");
assert(paymentTracker.includes('showConfirmAccount') && paymentTracker.includes('setShowConfirmAccount'), "PaymentTracker: showConfirmAccount state hook exists");
assert(paymentTracker.includes('showConfirmAccount ? "text" : "password"'), "PaymentTracker: Confirm account input toggles between text and password");

// 2. FIX HINDI PROPERLY
const translations = fs.readFileSync(path.join(root, 'src/data/translations.js'), 'utf8');
assert(translations.includes('hi: {'), "Translations: Hindi dictionary exists");
assert(translations.includes('tabDashboard: "डैशबोर्ड"'), "Translations: Dashboard translated to हिंदी");
assert(translations.includes('tabBookSlot: "स्लॉट बुक करें"'), "Translations: Book slot translated to हिंदी");
assert(translations.includes('tabQueue: "टोकन और कतार"'), "Translations: Queue translated to हिंदी");
assert(translations.includes('tabProcurement: "खरीद प्रक्रिया"'), "Translations: Procurement translated to हिंदी");
assert(translations.includes('tabPayment: "भुगतान ट्रैकिंग"'), "Translations: Payment translated to हिंदी");
assert(translations.includes('tabProfile: "प्रोफ़ाइल"'), "Translations: Profile translated to हिंदी");
assert(translations.includes('goodMorning: "नमस्ते"'), "Translations: Namaste greeting exists in Hindi");
assert(translations.includes('viewLiveQueue: "लाइव कतार देखें"'), "Translations: Live queue button translated in Hindi");

// Check UI Components use t(...)
const farmerDashboard = fs.readFileSync(path.join(root, 'src/components/farmer/FarmerDashboard.jsx'), 'utf8');
assert(farmerDashboard.includes('t("goodMorning")') && farmerDashboard.includes('t("activeBooking")'), "FarmerDashboard: Uses t(...) for greetings and status");

const liveQueue = fs.readFileSync(path.join(root, 'src/components/farmer/LiveQueueView.jsx'), 'utf8');
assert(liveQueue.includes('t("digitalTokenTitle")') && liveQueue.includes('t("myToken")'), "LiveQueueView: Uses t(...) for live queue text");

const smartBooking = fs.readFileSync(path.join(root, 'src/components/farmer/SmartBooking.jsx'), 'utf8');
assert(smartBooking.includes('t("duplicateBookingTitle")') && smartBooking.includes('t("confirmBooking")'), "SmartBooking: Uses t(...) for booking flow");

const headerNav = fs.readFileSync(path.join(root, 'src/components/common/HeaderNav.jsx'), 'utf8');
assert(headerNav.includes('setLanguage("en")') && headerNav.includes('setLanguage("hi")'), "HeaderNav: Language switcher triggers setLanguage");

// 3. CLEAN TOP-SIDE TOAST / POPUP MESSAGES
const toastContainer = fs.readFileSync(path.join(root, 'src/components/common/ToastContainer.jsx'), 'utf8');
assert(toastContainer.includes('fixed top-5 right-5 z-50'), "ToastContainer: Positioned at top-right (fixed top-5 right-5 z-50)");
assert(toastContainer.includes('pointer-events-none') && toastContainer.includes('pointer-events-auto'), "ToastContainer: Non-blocking container with interactive cards");
assert(toastContainer.includes('border-emerald-500') && toastContainer.includes('border-red-500'), "ToastContainer: Color-coded for success and error");

const contextFile = fs.readFileSync(path.join(root, 'src/context/KisanSetuContext.jsx'), 'utf8');
assert(contextFile.includes('addToast = ({ type = "info", title, message, duration = 4000 })'), "Context: addToast exists with default duration");
assert(contextFile.includes('const isDuplicate = prev.some'), "Context: addToast deduplication prevents duplicate notifications for the same event");
assert(contextFile.includes('setTimeout') && contextFile.includes('removeToast'), "Context: Auto-dismisses after duration");

const appFile = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');
assert(appFile.includes('<ToastContainer />'), "App: ToastContainer is rendered within the application tree");

// Verify no browser alert() is used in src/
const allJsxFiles = [
  'src/App.jsx',
  'src/context/KisanSetuContext.jsx',
  'src/components/LandingPage.jsx',
  'src/components/common/HeaderNav.jsx',
  'src/components/common/ToastContainer.jsx',
  'src/components/farmer/FarmerDashboard.jsx',
  'src/components/farmer/FarmerPortalView.jsx',
  'src/components/farmer/FarmerProfile.jsx',
  'src/components/farmer/LiveQueueView.jsx',
  'src/components/farmer/PaymentTracker.jsx',
  'src/components/farmer/ProcurementHistory.jsx',
  'src/components/farmer/ProcurementReceipt.jsx',
  'src/components/farmer/ProcurementTimeline.jsx',
  'src/components/farmer/SmartBooking.jsx'
];
let alertFound = false;
allJsxFiles.forEach(f => {
  const content = fs.readFileSync(path.join(root, f), 'utf8');
  if (content.match(/\balert\s*\(/)) {
    console.error(`Found alert() in ${f}`);
    alertFound = true;
  }
});
assert(!alertFound, "No browser alert() used anywhere in application");

// 4. CORRECT CLICKABLE CURSOR BEHAVIOR
const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
assert(indexCss.includes('button:not(:disabled)'), "index.css: button:not(:disabled) has cursor: pointer");
assert(indexCss.includes('[role="button"]:not(:disabled)'), "index.css: [role=\"button\"] has cursor: pointer");
assert(indexCss.includes('a[href]'), "index.css: a[href] has cursor: pointer");
assert(indexCss.includes('.cursor-pointer'), "index.css: .cursor-pointer utility has cursor: pointer");
assert(indexCss.includes('input:not([type="button"])') && indexCss.includes('cursor: text'), "index.css: inputs retain cursor: text");
assert(indexCss.includes('button:disabled') && indexCss.includes('cursor: not-allowed'), "index.css: disabled buttons have cursor: not-allowed");

console.log("==================================================");
console.log(`TOTAL: ${passed} PASSED, ${failed} FAILED`);
console.log("==================================================");
if (failed > 0) process.exit(1);
