const fs = require('fs');
const path = require('path');

const contextPath = 'src/context/KisanSetuContext.jsx';
let context = fs.readFileSync(contextPath, 'utf8');

context = context.replace(/INITIAL_TOKENS/g, 'INITIAL_BOOKINGS');
context = context.replace(/ks_tokens/g, 'ks_bookings');
context = context.replace(/tokens, setTokens/g, 'bookings, setBookings');
context = context.replace(/tokens/g, 'bookings');
context = context.replace(/setTokens/g, 'setBookings');
context = context.replace(/activeToken/g, 'activeBooking');
context = context.replace(/getActiveToken/g, 'getActiveBooking');
context = context.replace(/newToken/g, 'newBooking');
context = context.replace(/updateTokenStatus/g, 'updateBookingStatus');
context = context.replace(/tok\.id/g, 'tok.bookingId');
context = context.replace(/t\.id/g, 't.bookingId');

// bookSlot logic
context = context.replace(/const nextTokenNum = `A\$\{125 \+ bookings\.length - 5\}`;/g, 'const bookingId = `BKG-${Date.now()}`;\n    const nextTokenNum = `A${125 + bookings.length - 5}`;');
context = context.replace(/id: nextTokenNum,/g, 'bookingId: bookingId,\n      id: bookingId,\n      token: nextTokenNum,');
context = context.replace(/commodity,/g, 'crop: commodity,\n      commodity: commodity,');
context = context.replace(/quantityQtl: Number\(quantityQtl\),/g, 'quantity: Number(quantityQtl),\n      quantityQtl: Number(quantityQtl),');
context = context.replace(/centreId,/g, 'centreId,\n      centreName: centre.name,\n      date: date,');
context = context.replace(/queuePos:/g, 'queuePosition: centre.queueDepth + 1,\n      queuePos:');
context = context.replace(/estimatedWaitMin: estWait,/g, 'estimatedWait: estWait,\n      estimatedWaitMin: estWait,');
context = context.replace(/bookedAt: new Date/g, 'createdAt: new Date().toISOString(),\n      bookedAt: new Date');
context = context.replace(/const updatedBookings = bookings\.map\(\(tok\) => {/g, 'const updatedBookings = bookings.map((tok) => {\n      const nowIso = new Date().toISOString();');
context = context.replace(/let updatedObj = { \.\.\.tok, status: newStatus };/g, 'let updatedObj = { ...tok, status: newStatus, updatedAt: nowIso };');
context = context.replace(/updatedObj\.timelineHistory = history;/g, 'updatedObj.timelineHistory = history;\n      updatedObj.updatedAt = new Date().toISOString();');

// updateBookingStatus takes bookingId instead of tokenId
context = context.replace(/const updateBookingStatus = \(tokenId, newStatus, extraData = \{\}\) => \{/g, 'const updateBookingStatus = (bookingId, newStatus, extraData = {}) => {');
context = context.replace(/tok\.bookingId !== tokenId/g, 'tok.bookingId !== bookingId');
context = context.replace(/Token \$\{tokenId\}/g, 'Token ${updatedObj.token}');
context = context.replace(/Status Update \(\$\{tokenId\}\)/g, 'Status Update (${updatedObj.token})');

fs.writeFileSync(contextPath, context);
console.log('KisanSetuContext updated');
