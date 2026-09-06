const fs = require('fs');

const path = 'src/context/KisanSetuContext.jsx';
let content = fs.readFileSync(path, 'utf8');

const updatedQC = `
      } else if (newStatus === "QUALITY_CHECK") {
        const moisture = extraData.moisturePercent || 11.8;
        const grade = extraData.grade || "FAQ";
        updatedObj.moisturePercent = moisture;
        updatedObj.grade = grade;
        updatedObj.remarks = extraData.remarks || "";
        history.push({ status: "QUALITY_CHECK", time: nowTime, desc: \`Quality Check (\${moisture}% Moisture, \${grade})\${extraData.remarks ? ' - ' + extraData.remarks : ''}\` });
        notifyMsg = \`Token \${updatedObj.token}: Quality inspection passed (\${grade}).\`;
`;

content = content.replace(/\} else if \(newStatus === "QUALITY_CHECK"\) \{[\s\S]*?notifyMsg = `Token \$\{updatedObj\.token\}: Quality inspection passed \(\$\{grade\}\)\.`;/m, updatedQC.trim());
fs.writeFileSync(path, content);
console.log('Updated KisanSetuContext QC remarks');
