const fs = require('fs');

const path = 'src/components/farmer/ProcurementReceipt.jsx';
let content = fs.readFileSync(path, 'utf8');

const updatedGrid = `      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Token Number</p>
          <p className="text-lg font-mono font-extrabold text-slate-900">{token.token}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Lot ID</p>
          <p className="text-sm font-mono font-bold text-slate-700">
            KS-{token.crop.substring(0,3).toUpperCase()}-2026-00421
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Commodity</p>
          <p className="text-sm font-bold text-slate-800">{token.crop}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Procurement Centre</p>
          <p className="text-sm font-bold text-slate-800">{centre.name}</p>
        </div>
        
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Procurement Status</p>
          <p className="text-sm font-bold text-slate-800">{token.status.replace(/_/g, " ")}</p>
        </div>
      </div>`;

content = content.replace(/<div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">[\s\S]*?<\/div>\s*<\/div>/, updatedGrid);

fs.writeFileSync(path, content);
console.log('Updated ProcurementReceipt.jsx');
