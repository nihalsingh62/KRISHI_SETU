const fs = require('fs');
const path = require('path');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

console.log("=== CHECKLIST POINT 1: AADHAAR & BANK ACCOUNT VISIBILITY TOGGLE ===");

const landingPageContent = fs.readFileSync(path.join(__dirname, '../src/components/LandingPage.jsx'), 'utf8');
const profileContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/FarmerProfile.jsx'), 'utf8');
const paymentContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/PaymentTracker.jsx'), 'utf8');

// 1. LandingPage Aadhaar toggle
assert(landingPageContent.includes('const [showAadhaar, setShowAadhaar] = useState(false)'), "LandingPage initializes showAadhaar to false (masked by default)");
assert(landingPageContent.includes('type={showAadhaar ? "text" : "password"}'), "LandingPage Aadhaar input type toggles between text and password");
assert(landingPageContent.includes('onClick={() => setShowAadhaar(!showAadhaar)}'), "LandingPage has Aadhaar toggle button onClick handler");
assert(landingPageContent.includes('EyeOff') && landingPageContent.includes('Eye'), "LandingPage uses Eye/EyeOff icons for Aadhaar toggle");
assert(landingPageContent.includes('cursor-pointer') && landingPageContent.includes('setShowAadhaar'), "LandingPage Aadhaar eye button has cursor-pointer");

// 2. LandingPage Bank Account toggle
assert(landingPageContent.includes('const [showAccountNumber, setShowAccountNumber] = useState(false)'), "LandingPage initializes showAccountNumber to false (masked by default)");
assert(landingPageContent.includes('type={showAccountNumber ? "text" : "password"}'), "LandingPage Bank Account input type toggles between text and password");
assert(landingPageContent.includes('onClick={() => setShowAccountNumber(!showAccountNumber)}'), "LandingPage has Bank Account toggle button onClick handler");
assert(landingPageContent.includes('cursor-pointer') && landingPageContent.includes('setShowAccountNumber'), "LandingPage Bank Account eye button has cursor-pointer");

// 3. LandingPage Confirm Bank Account toggle
assert(landingPageContent.includes('const [showConfirmAccountNumber, setShowConfirmAccountNumber] = useState(false)'), "LandingPage initializes showConfirmAccountNumber to false (masked by default)");
assert(landingPageContent.includes('type={showConfirmAccountNumber ? "text" : "password"}'), "LandingPage Confirm Bank Account input type toggles between text and password");
assert(landingPageContent.includes('onClick={() => setShowConfirmAccountNumber(!showConfirmAccountNumber)}'), "LandingPage has Confirm Bank Account toggle button onClick handler");

// 4. FarmerProfile Bank Account toggles
assert(profileContent.includes('const [showAccount, setShowAccount] = useState(false)'), "FarmerProfile initializes showAccount to false (masked by default)");
assert(profileContent.includes('const [showConfirmAccount, setShowConfirmAccount] = useState(false)'), "FarmerProfile initializes showConfirmAccount to false (masked by default)");
assert(profileContent.includes('type={showAccount ? "text" : "password"}'), "FarmerProfile account input type toggles between text and password");
assert(profileContent.includes('type={showConfirmAccount ? "text" : "password"}'), "FarmerProfile confirm account input type toggles between text and password");
assert(profileContent.includes('onClick={() => setShowAccount(!showAccount)}'), "FarmerProfile has account toggle button");
assert(profileContent.includes('onClick={() => setShowConfirmAccount(!showConfirmAccount)}'), "FarmerProfile has confirm account toggle button");

// 5. PaymentTracker Bank Account toggles
assert(paymentContent.includes('const [showAccount, setShowAccount] = useState(false)'), "PaymentTracker initializes showAccount to false (masked by default)");
assert(paymentContent.includes('const [showConfirmAccount, setShowConfirmAccount] = useState(false)'), "PaymentTracker initializes showConfirmAccount to false (masked by default)");
assert(paymentContent.includes('type={showAccount ? "text" : "password"}'), "PaymentTracker account input type toggles between text and password");
assert(paymentContent.includes('type={showConfirmAccount ? "text" : "password"}'), "PaymentTracker confirm account input type toggles between text and password");

console.log("\n=== CHECKLIST POINT 2: HINDI I18N IMPLEMENTATION ===");
const translations = require('../src/data/translations.js').translations;

assert(translations.en && translations.hi, "Both 'en' and 'hi' translation dictionaries exist");

const requiredKeys = [
  "appName", "selectRole", "farmerRole", "operatorRole", "adminRole",
  "tabDashboard", "tabBookSlot", "tabQueue", "tabProcurement", "tabPayment", "tabProfile", "tabHistory",
  "goodMorning", "activeBooking", "myToken", "queuePosition", "estimatedWait", "servingToken",
  "commodity", "quantity", "procurementCentre", "slotTime", "viewLiveQueue", "noActiveBooking",
  "bookNewSlot", "identityVerified", "procurementCompleted", "yourToken", "currentInstruction",
  "instructionBooked", "instructionWaitingNear", "instructionWaitingFar", "instructionWeighing",
  "instructionQC", "farmersAhead", "minutes", "procurementProgress", "printTicket", "digitalTokenTitle",
  "surroundingQueueTitle", "surroundingQueueDesc", "liveSync", "you", "bookSlotTitle", "recommendedCentres",
  "whyRecommended", "availableSlots", "confirmBooking", "duplicateBookingTitle", "duplicateBookingMsg",
  "statusBooked", "statusConfirmed", "statusArrived", "statusWaiting", "statusCalled", "statusWeighing",
  "statusQualityCheck", "statusApproved", "statusProcurementComplete", "statusPaymentProcessing",
  "statusPaymentCompleted", "statusRejected", "liveProcurementStatus", "realTimeProgress", "activeTokenLabel",
  "noActiveProcurement", "recordedWeight", "qualityPassed", "dbtRef", "profileTitle", "mobileNumber",
  "aadhaarLinked", "village", "district", "preferredLanguage", "bankAccountDetails", "beneficiaryAccount",
  "bankName", "accountHolder", "accountNumber", "confirmAccountNumber", "ifscCode", "saveDetails",
  "editBankDetails", "addBankAccount", "bankDetailsUpdated", "noBankDetailsAdded", "procurementHistory",
  "allFilter", "activeFilter", "completedFilter", "rejectedFilter", "viewDetails", "noRecords",
  "tokenAndId", "cropAndQty", "dateAndSlot", "action", "lifecycleTimeline", "officialReceipt",
  "closeDetails", "prototypePaymentFlow", "directBankPaymentStatus", "dbtSubtext", "totalCalculatedPayable",
  "quantityProcured", "govMspRate", "noBankAccountLinked", "prototypeVerified", "transactionRef",
  "noActivePayment", "cancel", "saveBankDetails", "editBeneficiaryAccount", "linkBeneficiaryAccount",
  "receiptFarmerName", "receiptTokenNumber", "receiptBookingId", "receiptBookedQty", "receiptAcceptedQty",
  "receiptMoisture", "receiptQualityGrade", "downloadPdf"
];

let missingEn = [];
let missingHi = [];

requiredKeys.forEach(k => {
  if (!translations.en[k]) missingEn.push(k);
  if (!translations.hi[k]) missingHi.push(k);
});

assert(missingEn.length === 0, `All required keys present in English (missing: ${missingEn.join(', ')})`);
assert(missingHi.length === 0, `All required keys present in Hindi (missing: ${missingHi.join(', ')})`);

// Check components consume t(...)
const dashboardContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/FarmerDashboard.jsx'), 'utf8');
const queueContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/LiveQueueView.jsx'), 'utf8');
const bookingContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/SmartBooking.jsx'), 'utf8');
const timelineContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/ProcurementTimeline.jsx'), 'utf8');
const historyContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/ProcurementHistory.jsx'), 'utf8');
const receiptContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/ProcurementReceipt.jsx'), 'utf8');
const farmerPortalContent = fs.readFileSync(path.join(__dirname, '../src/components/farmer/FarmerPortalView.jsx'), 'utf8');

assert(dashboardContent.includes('t("activeBooking")') && dashboardContent.includes('getStatusLabel'), "FarmerDashboard uses t(...) for active booking and status badges");
assert(queueContent.includes('t("digitalTokenTitle")') && queueContent.includes('t("printTicket")'), "LiveQueueView uses t(...) for digital token ticket");
assert(bookingContent.includes('t("bookSlotTitle")') && bookingContent.includes('t("whyRecommended")'), "SmartBooking uses t(...) for titles and recommendations");
assert(timelineContent.includes('t("liveProcurementStatus")') && timelineContent.includes('t("statusBooked")'), "ProcurementTimeline uses t(...) for stages and status");
assert(historyContent.includes('t("procurementHistory")') && historyContent.includes('t("allFilter")'), "ProcurementHistory uses t(...) for history and filter pills");
assert(receiptContent.includes('t("procurementCompleted")') && receiptContent.includes('t("receiptFarmerName")'), "ProcurementReceipt uses t(...) for receipt fields");
assert(farmerPortalContent.includes('t("tabDashboard")') && farmerPortalContent.includes('t("tabBookSlot")'), "FarmerPortalView uses t(...) for navigation tabs");

console.log("\n=== CHECKLIST POINT 3: TOAST NOTIFICATION SYSTEM ===");
const toastContainerContent = fs.readFileSync(path.join(__dirname, '../src/components/common/ToastContainer.jsx'), 'utf8');
const contextContent = fs.readFileSync(path.join(__dirname, '../src/context/KisanSetuContext.jsx'), 'utf8');
const appContent = fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf8');

assert(appContent.includes('<ToastContainer />') || appContent.includes('<ToastContainer/>'), "App.jsx renders <ToastContainer /> inside provider");
assert(toastContainerContent.includes('fixed top-5 right-5 z-50'), "ToastContainer is positioned in the upper right (top-5 right-5 z-50)");
assert(toastContainerContent.includes('pointer-events-none') && toastContainerContent.includes('pointer-events-auto'), "ToastContainer does not block page interactions");
assert(toastContainerContent.includes('removeToast('), "Toast has interactive dismiss button");
assert(contextContent.includes('const addToast ='), "KisanSetuContext implements addToast");
assert(contextContent.includes('const removeToast ='), "KisanSetuContext implements removeToast");
assert(contextContent.includes('addToast({') && contextContent.includes('type: toastType'), "addNotification automatically forwards notifications to addToast");

console.log("\n=== CHECKLIST POINT 4: CLICKABLE CURSOR BEHAVIOR ===");
const cssContent = fs.readFileSync(path.join(__dirname, '../src/index.css'), 'utf8');

assert(cssContent.includes('button:not(:disabled)'), "index.css sets cursor: pointer on button:not(:disabled)");
assert(cssContent.includes('[role="button"]:not(:disabled)'), "index.css sets cursor: pointer on role='button'");
assert(cssContent.includes('a[href]'), "index.css sets cursor: pointer on a[href]");
assert(cssContent.includes('.cursor-pointer'), "index.css defines .cursor-pointer");
assert(cssContent.includes('textarea') && cssContent.includes('cursor: text'), "index.css preserves cursor: text for inputs and textareas");

console.log("\n==================================================");
console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log("==================================================");

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
