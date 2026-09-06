const fs = require('fs');

// 1. translations.js
let trans = fs.readFileSync('src/data/translations.js', 'utf8');
trans = trans.replace(
  'sihDisclaimer: "SIH Problem Statement 26032 • Interactive Prototype",',
  'sihDisclaimer: "National Agricultural Procurement Portal",'
);
trans = trans.replace(
  'sihDisclaimer: "SIH समस्या कथन 26032 • इंटरएक्टिव प्रोटोटाइप (सिम्युलेटेड ऑपरेशनल डेटा)",',
  'sihDisclaimer: "राष्ट्रीय कृषि खरीद पोर्टल",'
);
fs.writeFileSync('src/data/translations.js', trans);

// 2. LandingPage.jsx
let landing = fs.readFileSync('src/components/LandingPage.jsx', 'utf8');
landing = landing.replace(
  'Identity Verification: Simulated for Prototype.',
  'Identity Verification: Secure via UIDAI.'
);
// Also remove SIH Disclaimer from the bottom if it says SIH
// But we already replaced it in translations, so `t('sihDisclaimer')` is fine.
fs.writeFileSync('src/components/LandingPage.jsx', landing);

// 3. WeighingQCModal.jsx
let qc = fs.readFileSync('src/components/operator/WeighingQCModal.jsx', 'utf8');
qc = qc.replace(
  'Weighbridge digital telemetry input (Prototype Override).',
  'Weighbridge digital telemetry input (Automated Sync).'
);
fs.writeFileSync('src/components/operator/WeighingQCModal.jsx', qc);

// 4. App.jsx
// Make sure DemoWalkthroughBar is completely removed from imports and jsx just in case
let app = fs.readFileSync('src/App.jsx', 'utf8');
app = app.replace('import { DemoWalkthroughBar } from "./components/common/DemoWalkthroughBar";\n', '');
app = app.replace('{/* <DemoWalkthroughBar /> - Hidden for production, available for dev/testing */}\n', '');
fs.writeFileSync('src/App.jsx', app);

console.log('Cleanup complete');
