const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.js', 'utf8');

// Replace INITIAL_TOKENS with INITIAL_BOOKINGS
content = content.replace('export const INITIAL_TOKENS = [', 'export const INITIAL_BOOKINGS = [');

// Transform the objects
const dateStr = new Date().toISOString().split('T')[0];

content = content.replace(/id: "A(\d+)",/g, (match, p1) => {
  return `bookingId: "BKG-${p1}",\n    token: "A${p1}",`;
});
content = content.replace(/commodity: /g, 'crop: ');
content = content.replace(/quantityQtl: /g, 'quantity: ');
content = content.replace(/queuePos: /g, 'queuePosition: ');
content = content.replace(/estimatedWaitMin: /g, 'estimatedWait: ');
content = content.replace(/bookedAt: /g, 'createdAt: ');
content = content.replace(/updatedAt:/g, 'updatedAt:'); // if exists

// Add centreName and date
content = content.replace(/centreId: "c1",/g, `centreId: "c1",\n    centreName: "ABC Procurement Centre",\n    date: "${dateStr}",\n    updatedAt: "${dateStr}T10:00:00Z",`);

fs.writeFileSync('src/data/mockData.js', content);
console.log('mockData.js updated');
