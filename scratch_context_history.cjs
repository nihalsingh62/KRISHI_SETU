const fs = require('fs');

const path = 'src/context/KisanSetuContext.jsx';
let content = fs.readFileSync(path, 'utf8');

const updatedHistoryLogic = `
      if (newStatus === "ARRIVED") {
        history.push({ status: "ARRIVED", time: nowTime, desc: "Checked-in at Gate 1" });
        notifyMsg = \`Token \${updatedObj.token}: Farmer checked-in at gate.\`;
      } else if (newStatus === "CALLED") {
        history.push({ status: "CALLED", time: nowTime, desc: "Called for weighing" });
        notifyMsg = \`Token \${updatedObj.token}: Proceed to Weighbridge.\`;
      } else if (newStatus === "WEIGHING") {
        const weight = extraData.actualWeightQtl || tok.actualWeightQtl || (tok.quantity + 0.5);
        updatedObj.actualWeightQtl = weight;
        updatedObj.totalAmount = Math.round(weight * tok.mspPerQtl);
        history.push({ status: "WEIGHING", time: nowTime, desc: \`Vehicle on Weighbridge. Recorded: \${weight} Qtl\` });
        notifyMsg = \`Token \${updatedObj.token}: Weighbridge weighing completed (\${weight} Qtl).\`;
      } else if (newStatus === "QUALITY_CHECK") {
        const moisture = extraData.moisturePercent || 11.8;
        const grade = extraData.grade || "FAQ";
        updatedObj.moisturePercent = moisture;
        updatedObj.grade = grade;
        history.push({ status: "QUALITY_CHECK", time: nowTime, desc: \`Quality Check (\${moisture}% Moisture, \${grade})\` });
        notifyMsg = \`Token \${updatedObj.token}: Quality inspection passed (\${grade}).\`;
      } else if (newStatus === "APPROVED") {
        history.push({ status: "APPROVED", time: nowTime, desc: "Procurement approved by Quality Inspector" });
        notifyMsg = \`Token \${updatedObj.token}: Procurement approved.\`;
      } else if (newStatus === "COMPLETED") {
        updatedObj.paymentStatus = "PENDING";
        history.push({ status: "COMPLETED", time: nowTime, desc: \`Procurement COMPLETED (\${updatedObj.actualWeightQtl} Qtl accepted)\` });
        notifyMsg = \`Token \${updatedObj.token}: Procurement complete! Ready for payment.\`;
      } else if (newStatus === "PAYMENT_INITIATED") {
        updatedObj.paymentStatus = "PROCESSING";
        history.push({ status: "PAYMENT_INITIATED", time: nowTime, desc: "Payment Initiated via PFMS" });
        notifyMsg = \`Token \${updatedObj.token}: Payment Initiated.\`;
      } else if (newStatus === "PAYMENT_COMPLETED") {
        const txRef = \`DEMO-TRX-\${Math.floor(10000 + Math.random() * 90000)}\`;
        updatedObj.paymentStatus = "COMPLETED";
        updatedObj.paymentTxRef = txRef;
        history.push({ status: "PAYMENT_COMPLETED", time: nowTime, desc: \`Bank Transfer Successful (Ref: \${txRef})\` });
        notifyMsg = \`Token \${updatedObj.token}: ₹\${updatedObj.totalAmount.toLocaleString()} credited to bank account (Ref: \${txRef}).\`;
      } else if (newStatus === "REJECTED") {
        history.push({ status: "REJECTED", time: nowTime, desc: \`Procurement rejected: \${extraData.remarks || 'Failed quality check'}\` });
        notifyMsg = \`Token \${updatedObj.token}: Procurement rejected.\`;
      }
`;

content = content.replace(/if \(newStatus === "ARRIVED"\) \{[\s\S]*?notifyMsg = `Token \$\{updatedObj\.token\}: Procurement rejected\.`;\n      \}/m, updatedHistoryLogic.trim());
fs.writeFileSync(path, content);
console.log('Updated KisanSetuContext.jsx');
