const fs = require('fs');

function replaceStatuses(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const replacements = [
    ['"PROCUREMENT_COMPLETE"', '"COMPLETED"'],
    ['"PAYMENT_PROCESSING"', '"PAYMENT_INITIATED"']
  ];

  for (const [find, replace] of replacements) {
    if (content.includes(find)) {
      content = content.split(find).join(replace);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated statuses in ${filePath}`);
  }
}

replaceStatuses('src/components/farmer/FarmerDashboard.jsx');
replaceStatuses('src/components/farmer/LiveQueueView.jsx');
replaceStatuses('src/components/farmer/ProcurementReceipt.jsx');
replaceStatuses('src/components/farmer/PaymentTracker.jsx');
replaceStatuses('src/components/operator/FarmerCheckIn.jsx');
replaceStatuses('src/data/mockData.js');
