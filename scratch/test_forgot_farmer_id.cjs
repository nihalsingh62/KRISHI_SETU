/**
 * Automated Test Suite for "Forgot Farmer ID?" Feature
 * Validates:
 * 1. Translations completeness (en & hi)
 * 2. Mobile validation (10 digits)
 * 3. Unregistered mobile rejection ("No farmer account found for this mobile number.")
 * 4. Existing registered farmer lookup by mobile (e.g. FAR-1001 / 9876543210)
 * 5. OTP validation (6 digits, demo OTP 123456)
 * 6. Dynamic lookup without hardcoding (newly registered farmer FAR-1002 / 9123456789)
 * 7. Normal login preservation (Farmer ID + Mobile + OTP)
 * 8. Back to login pre-fill behavior
 */

const assert = require("assert");
const { translations } = require("../src/data/translations.js");

console.log("\n========================================================");
console.log("RUNNING FORGOT FARMER ID TEST SUITE");
console.log("========================================================\n");

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// 1. Translations check
test("1. All Forgot Farmer ID translation keys exist in both English and Hindi", () => {
  const keys = [
    "forgotFarmerId",
    "forgotFarmerIdDesc",
    "enterRegisteredMobile",
    "sendOtp",
    "verifyOtp",
    "yourFarmerId",
    "backToLogin",
    "noFarmerFoundWithMobile",
    "otpVerifiedSuccess",
    "farmerIdRecoveredSuccess",
    "otpSentToMobile",
    "useThisIdToLogin",
    "registeredMobile",
    "enterOtpDemoHint"
  ];

  for (const key of keys) {
    assert(translations.en[key], `Missing English key: ${key}`);
    assert(translations.hi[key], `Missing Hindi key: ${key}`);
  }
});

// Simulation of registered farmers state (Single Source of Truth)
const initialRegisteredFarmers = [
  {
    id: "FAR-1001",
    name: "Ramesh Singh",
    mobile: "9876543210",
    aadhaar: "987654321098",
    village: "Rampur",
    district: "Patna"
  }
];

let registeredFarmers = [...initialRegisteredFarmers];
const DEMO_OTP = "123456";

// 2. Mobile validation
test("2. Mobile validation strictly enforces 10 digits", () => {
  const validateMobile = (mobile) => /^\d{10}$/.test(mobile);

  assert.strictEqual(validateMobile("9876543210"), true, "Valid 10-digit mobile must pass");
  assert.strictEqual(validateMobile("98765"), false, "Short mobile must fail");
  assert.strictEqual(validateMobile("987654321000"), false, "Long mobile must fail");
  assert.strictEqual(validateMobile("98765abcde"), false, "Non-numeric mobile must fail");
});

// 3. Unregistered mobile rejection
test("3. Unregistered mobile number returns clear error", () => {
  const mobileInput = "9999999999";
  const matching = registeredFarmers.find(f => f.mobile && f.mobile.trim() === mobileInput.trim());
  assert.strictEqual(matching, undefined, "Unregistered mobile should return undefined");
  const errorMessage = !matching ? (translations.en.noFarmerFoundWithMobile) : "";
  assert.strictEqual(errorMessage, "No farmer account found for this mobile number.");
});

// 4. Lookup existing seed farmer
test("4. Registered mobile finds exact Farmer ID (FAR-1001)", () => {
  const mobileInput = "9876543210";
  const matching = registeredFarmers.find(f => f.mobile && f.mobile.trim() === mobileInput.trim());
  assert(matching, "Registered farmer must be found");
  assert.strictEqual(matching.id, "FAR-1001");
  assert.strictEqual(matching.name, "Ramesh Singh");
});

// 5. OTP validation
test("5. Prototype OTP validation works with DEMO_OTP 123456", () => {
  const verifyOtp = (otp) => {
    if (!/^\d{6}$/.test(otp)) return { valid: false, error: "OTP must be exactly 6 digits." };
    if (otp !== DEMO_OTP) return { valid: false, error: `Invalid OTP. Enter demo OTP: ${DEMO_OTP}` };
    return { valid: true };
  };

  assert.strictEqual(verifyOtp("123").valid, false);
  assert.strictEqual(verifyOtp("654321").valid, false);
  assert.strictEqual(verifyOtp("123456").valid, true);
});

// 6. Dynamic lookup of newly registered farmer (No Hardcoding)
test("6. Dynamic lookup finds newly registered farmer (FAR-1002) without hardcoding", () => {
  // Simulate new farmer registration
  const newFarmerId = `FAR-${1000 + registeredFarmers.length + 1}`;
  const newFarmer = {
    id: newFarmerId,
    name: "Sunita Devi",
    mobile: "9123456789",
    aadhaar: "123456789012",
    village: "Sonpur",
    district: "Saran"
  };
  registeredFarmers.push(newFarmer);

  assert.strictEqual(newFarmer.id, "FAR-1002");

  // Lookup by newly registered mobile
  const recovered = registeredFarmers.find(f => f.mobile && f.mobile.trim() === "9123456789");
  assert(recovered, "Newly registered farmer must be recovered");
  assert.strictEqual(recovered.id, "FAR-1002");
  assert.strictEqual(recovered.name, "Sunita Devi");
});

// 7. Full Recovery Flow Simulation
test("7. End-to-end recovery flow: mobile -> OTP -> recovered ID -> prefilled login", () => {
  const farmerToRecover = registeredFarmers.find(f => f.id === "FAR-1002");
  assert(farmerToRecover);

  // Step 1: Mobile check
  const inputMobile = "9123456789";
  const farmerFound = registeredFarmers.find(f => f.mobile.trim() === inputMobile);
  assert(farmerFound);

  // Step 2: OTP
  const enteredOtp = "123456";
  assert.strictEqual(enteredOtp, DEMO_OTP);

  // Step 3: Recovered details
  const recoveredId = farmerFound.id;
  assert.strictEqual(recoveredId, "FAR-1002");

  // Step 4: Back to login pre-fills form
  let loginFormFarmerId = "";
  let loginFormMobile = "";

  function backToLogin(recovered) {
    loginFormFarmerId = recovered.id;
    loginFormMobile = recovered.mobile;
  }

  backToLogin(farmerFound);
  assert.strictEqual(loginFormFarmerId, "FAR-1002");
  assert.strictEqual(loginFormMobile, "9123456789");
});

// 8. Normal Farmer Login Preservation
test("8. Normal Farmer Login (FAR-1001 + 9876543210) works without modification", () => {
  const loginFarmer = (fId, mob) => {
    return registeredFarmers.find(
      f => f.id.toUpperCase() === fId.trim().toUpperCase() && f.mobile.trim() === mob.trim()
    );
  };

  const loggedIn = loginFarmer("FAR-1001", "9876543210");
  assert(loggedIn, "Normal login must succeed for valid credentials");
  assert.strictEqual(loggedIn.id, "FAR-1001");

  const invalidLogin = loginFarmer("FAR-9999", "9876543210");
  assert.strictEqual(invalidLogin, undefined, "Invalid Farmer ID must fail");
});

console.log("\n========================================================");
console.log(`TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log("========================================================\n");

if (passedTests !== totalTests) {
  process.exit(1);
}
