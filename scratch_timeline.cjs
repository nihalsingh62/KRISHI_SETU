const fs = require('fs');

const path = 'src/components/farmer/ProcurementTimeline.jsx';
let content = fs.readFileSync(path, 'utf8');

const newStages = `
  const STAGES = [
    { key: "BOOKED", label: "Slot Booked", icon: Clock },
    { key: "ARRIVED", label: "Farmer Checked-In at Gate", icon: Building2 },
    { key: "CALLED", label: "Called for Weighing", icon: Clock },
    { key: "WEIGHING", label: "Weighbridge Weighing", icon: Scale },
    { key: "QUALITY_CHECK", label: "Quality & Moisture Inspection", icon: ShieldCheck },
    { key: "APPROVED", label: "Procurement Approved", icon: CheckCircle2 },
    { key: "COMPLETED", label: "Procurement Completed", icon: FileText },
    { key: "PAYMENT_INITIATED", label: "Payment Initiated", icon: CreditCard },
    { key: "PAYMENT_COMPLETED", label: "Payment Transferred to Account", icon: CheckCircle2 }
  ];

  const getStageState = (stageKey) => {
    const statusOrder = [
      "BOOKED",
      "CONFIRMED",
      "WAITING",
      "ARRIVED",
      "CALLED",
      "WEIGHING",
      "QUALITY_CHECK",
      "APPROVED",
      "COMPLETED",
      "PAYMENT_INITIATED",
      "PAYMENT_COMPLETED"
    ];
`;

content = content.replace(/const STAGES = \[[\s\S]*?];/m, `  const STAGES = [
    { key: "BOOKED", label: "Slot Booked", icon: Clock },
    { key: "ARRIVED", label: "Farmer Checked-In at Gate", icon: Building2 },
    { key: "CALLED", label: "Called for Weighing", icon: Clock },
    { key: "WEIGHING", label: "Weighbridge Weighing", icon: Scale },
    { key: "QUALITY_CHECK", label: "Quality & Moisture Inspection", icon: ShieldCheck },
    { key: "APPROVED", label: "Procurement Approved", icon: CheckCircle2 },
    { key: "COMPLETED", label: "Procurement Completed", icon: FileText },
    { key: "PAYMENT_INITIATED", label: "Payment Initiated", icon: CreditCard },
    { key: "PAYMENT_COMPLETED", label: "Payment Transferred to Account", icon: CheckCircle2 }
  ];`);

content = content.replace(/const statusOrder = \[[\s\S]*?\];/m, `const statusOrder = [
      "BOOKED",
      "CONFIRMED",
      "WAITING",
      "ARRIVED",
      "CALLED",
      "WEIGHING",
      "QUALITY_CHECK",
      "APPROVED",
      "COMPLETED",
      "PAYMENT_INITIATED",
      "PAYMENT_COMPLETED"
    ];`);
fs.writeFileSync(path, content);
console.log('Updated ProcurementTimeline.jsx');
