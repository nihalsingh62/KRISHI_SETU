const fs = require('fs');

const path = 'src/components/operator/LiveQueueManager.jsx';
let content = fs.readFileSync(path, 'utf8');

const newActions = `
                      {tok.status === "BOOKED" || tok.status === "CONFIRMED" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "ARRIVED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Check In
                        </button>
                      ) : tok.status === "ARRIVED" || tok.status === "WAITING" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "CALLED")}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                        >
                          Call Farmer
                        </button>
                      ) : tok.status === "CALLED" ? (
                        <button
                          onClick={() => handleOpenWeighingModal(tok)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                        >
                          <Scale className="w-3.5 h-3.5" /> Start Weighing
                        </button>
                      ) : tok.status === "WEIGHING" ? (
                        <button
                          onClick={() => handleOpenQCModal(tok)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 inline-flex"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Quality Check
                        </button>
                      ) : tok.status === "QUALITY_CHECK" ? (
                        <>
                          <button
                            onClick={() => updateBookingStatus(tok.token, "APPROVED")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateBookingStatus(tok.token, "REJECTED")}
                            className="px-2.5 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[11px] ml-1"
                          >
                            Reject
                          </button>
                        </>
                      ) : tok.status === "APPROVED" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "COMPLETED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Complete
                        </button>
                      ) : tok.status === "COMPLETED" || tok.status === "PROCUREMENT_COMPLETE" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "PAYMENT_INITIATED")}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Initiate Payment
                        </button>
                      ) : tok.status === "PAYMENT_INITIATED" || tok.status === "PAYMENT_PROCESSING" ? (
                        <button
                          onClick={() => updateBookingStatus(tok.token, "PAYMENT_COMPLETED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Complete Payment
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">Completed</span>
                      )}
`;

content = content.replace(/\{tok\.status === "BOOKED"[\s\S]*?Completed<\/span>\s*\)\}\s*/m, newActions.trim() + '\n');
fs.writeFileSync(path, content);
console.log('Updated LiveQueueManager.jsx');
