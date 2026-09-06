const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      const replacements = [
        ['useKisanSetu().tokens', 'useKisanSetu().bookings'],
        ['const { tokens', 'const { bookings'],
        ['const { activeToken', 'const { activeBooking'],
        ['tokens.map', 'bookings.map'],
        ['tokens.filter', 'bookings.filter'],
        ['tokens.find', 'bookings.find'],
        ['tokens.length', 'bookings.length'],
        ['activeToken.', 'activeBooking.'],
        ['activeToken ', 'activeBooking '],
        ['!activeToken', '!activeBooking'],
        ['activeToken,', 'activeBooking,'],
        ['activeToken}', 'activeBooking}'],
        ['activeToken?', 'activeBooking?'],
        ['tok.id', 'tok.token'],
        ['t.id', 't.token'],
        ['token.id', 'token.token'],
        ['quantityQtl', 'quantity'],
        ['queuePos', 'queuePosition'],
        ['estimatedWaitMin', 'estimatedWait'],
        ['bookedAt', 'createdAt'],
        ['commodity', 'crop'],
        ['centreTokens', 'centreBookings'],
      ];

      for (const [find, replace] of replacements) {
        if (content.includes(find)) {
          content = content.split(find).join(replace);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir('src/components/farmer');
replaceInDir('src/components/operator');
replaceInDir('src/components/common');
