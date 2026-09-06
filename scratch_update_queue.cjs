const fs = require('fs');

const path = 'src/components/operator/LiveQueueManager.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace Headers
content = content.replace(
  '<th className="p-3.5">Slot</th>',
  '<th className="p-3.5">Queue Pos</th>\n                <th className="p-3.5">Est. Wait</th>'
);

// Replace Table Row cells
content = content.replace(
  '<td className="p-3.5 text-slate-600">{tok.slot}</td>',
  '<td className="p-3.5 font-bold text-amber-600">{tok.queuePosition > 0 ? tok.queuePosition : "-"}</td>\n                    <td className="p-3.5 font-bold text-emerald-600">{tok.estimatedWait > 0 ? `${tok.estimatedWait} min` : "-"}</td>'
);

fs.writeFileSync(path, content);
console.log('LiveQueueManager updated');
