const fs = require('fs');

// 1. LiveQueueView.jsx
let queueView = fs.readFileSync('src/components/farmer/LiveQueueView.jsx', 'utf8');
queueView = queueView.replace(
  'const { t, activeBooking, activeCentre, tokens } = useKisanSetu();',
  'const { t, activeBooking, activeCentre, bookings } = useKisanSetu();'
);
fs.writeFileSync('src/components/farmer/LiveQueueView.jsx', queueView);

// 2. LiveQueueManager.jsx
let queueManager = fs.readFileSync('src/components/operator/LiveQueueManager.jsx', 'utf8');
queueManager = queueManager.replace(
  'const centreBookings = tokens',
  'const centreBookings = bookings'
);
fs.writeFileSync('src/components/operator/LiveQueueManager.jsx', queueManager);

// 3. KisanSetuContext.jsx
let context = fs.readFileSync('src/context/KisanSetuContext.jsx', 'utf8');
// Fix updateBookingStatus out-of-scope bug
const oldUpdateTokens = `
    const updatedTokens = bookings.map((tok) => {
      if (tok.bookingId !== bookingId) return tok;

      const history = [...tok.timelineHistory];
      let updatedObj = { ...tok, status: newStatus, updatedAt: nowIso };`;

const newUpdateTokens = `
    let targetTokenStr = "";
    const updatedTokens = bookings.map((tok) => {
      if (tok.bookingId !== bookingId) return tok;

      const history = [...tok.timelineHistory];
      let updatedObj = { ...tok, status: newStatus, updatedAt: nowIso };
      targetTokenStr = updatedObj.token;`;

context = context.replace(oldUpdateTokens, newUpdateTokens);
context = context.replace(
  'title: `Status Update (${updatedObj.token})`,',
  'title: `Status Update (${targetTokenStr})`,'
);
fs.writeFileSync('src/context/KisanSetuContext.jsx', context);

// 4. SmartBooking.jsx
let smartBooking = fs.readFileSync('src/components/farmer/SmartBooking.jsx', 'utf8');
const oldBookCall = `    const token = bookSlot({
      crop,
      quantity: quantity,
      centreId: selectedCentreId,
      date: "Today",
      slotTime: selectedSlot
    });
    setCreatedToken(token);`;

const newBookCall = `    const newBooking = bookSlot({
      commodity: crop,
      quantityQtl: Number(quantity),
      centreId: selectedCentreId,
      date: "Today",
      slotTime: selectedSlot
    });
    setCreatedToken(newBooking.token);`;
smartBooking = smartBooking.replace(oldBookCall, newBookCall);
fs.writeFileSync('src/components/farmer/SmartBooking.jsx', smartBooking);

// 5. FarmerDashboard.jsx
let farmerDash = fs.readFileSync('src/components/farmer/FarmerDashboard.jsx', 'utf8');
farmerDash = farmerDash.replace(
  '<span className="text-2xl font-mono text-emerald-900 leading-none">{activeBooking.id}</span>',
  '<span className="text-2xl font-mono text-emerald-900 leading-none">{activeBooking.token}</span>'
);
fs.writeFileSync('src/components/farmer/FarmerDashboard.jsx', farmerDash);

console.log('All debugging fixes applied.');
