const fs = require('fs');

const path = 'src/components/operator/WeighingQCModal.jsx';
let content = fs.readFileSync(path, 'utf8');

// Add remarks state
content = content.replace(
  'const [grade, setGrade] = useState(token.grade || "Grade A");',
  'const [grade, setGrade] = useState(token.grade || "Grade A");\n  const [remarks, setRemarks] = useState(token.remarks || "");'
);

// Update submit payload for QC
content = content.replace(
  'updateBookingStatus(token.token, "QUALITY_CHECK", { moisturePercent: Number(moisture), grade });',
  'updateBookingStatus(token.token, "QUALITY_CHECK", { moisturePercent: Number(moisture), grade, remarks });'
);

// Add remarks input in form
const remarksInput = `
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Operator Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any visual observations, issues, etc."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-20"
                ></textarea>
              </div>
`;

content = content.replace(
  '</select>\n              </div>\n            </>\n          )}',
  '</select>\n              </div>\n' + remarksInput + '            </>\n          )}'
);

fs.writeFileSync(path, content);
console.log('Updated WeighingQCModal.jsx');
