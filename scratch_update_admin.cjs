const fs = require('fs');
const path = 'src/components/admin/AdminDashboard.jsx';

let content = fs.readFileSync(path, 'utf8');
content = content.replace('const { t, centres, tokens', 'const { t, centres, bookings');
content = content.replace('const totalBooked = tokens.length * 142;', 'const totalBooked = bookings.length * 142;');
fs.writeFileSync(path, content);
console.log('Fixed AdminDashboard tokens reference');
