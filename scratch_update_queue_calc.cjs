const fs = require('fs');

const path = 'src/context/KisanSetuContext.jsx';
let content = fs.readFileSync(path, 'utf8');

const newLogic = `
    centresSet.forEach(cId => {
      // Reset processing and completed
      updated.filter(t => t.centreId === cId).forEach(tok => {
        const tIndex = updated.findIndex(t => t.bookingId === tok.bookingId);
        if (!["BOOKED", "CONFIRMED", "ARRIVED", "WAITING"].includes(tok.status)) {
          updated[tIndex].queuePosition = 0;
          updated[tIndex].estimatedWait = 0;
        }
      });

      // Find bookings in queue (BOOKED, CONFIRMED, WAITING, ARRIVED) for this centre
      const inQueueTokens = updated.filter(t => t.centreId === cId && ["BOOKED", "CONFIRMED", "ARRIVED", "WAITING"].includes(t.status));
      
      // Sort them by their booking ID which contains timestamp (or bookedAt)
      inQueueTokens.sort((a, b) => a.bookingId.localeCompare(b.bookingId));
      
      inQueueTokens.forEach((tok, index) => {
        // Queue position is index + 1
        const tIndex = updated.findIndex(t => t.bookingId === tok.bookingId);
        if (tIndex !== -1) {
          updated[tIndex].queuePosition = index + 1;
          updated[tIndex].estimatedWait = Math.max(5, Math.round((index + 1) * 6)); // Rough estimate dynamically decreasing
        }
      });
    });
`;

content = content.replace(/centresSet\.forEach\(cId => \{[\s\S]*?\}\);\s*\}\);/m, newLogic.trim() + '\n  });');

fs.writeFileSync(path, content);
console.log('Updated KisanSetuContext queue calculation');
