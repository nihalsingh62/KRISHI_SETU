const fs = require('fs');

const path = 'src/context/KisanSetuContext.jsx';
let content = fs.readFileSync(path, 'utf8');

// I will find the newBooking declaration and fix it up manually via string manipulation
const fixBooking = `    const newBooking = {
      bookingId: bookingId,
      id: bookingId,
      token: nextTokenNum,
      farmerId: authenticatedUser.id,
      farmerName: authenticatedUser.name,`;

// Replacing everything from "const newBooking" to "farmerName"
content = content.replace(/const newBooking = \{[\s\S]*?farmerName: authenticatedUser\.name,/m, fixBooking);

fs.writeFileSync(path, content);
console.log('Fixed KisanSetuContext newBooking');
