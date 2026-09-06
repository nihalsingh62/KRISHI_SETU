const fs = require('fs');

const path = 'src/components/farmer/FarmerPortalView.jsx';
let content = fs.readFileSync(path, 'utf8');

const updatedLowNet = `
  // If low network mode is ON, render simplified rural offline card
  if (lowNetworkMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-400 text-amber-950 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-amber-300 pb-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-6 h-6 text-amber-700 animate-pulse" />
              <h2 className="text-xl font-extrabold">Low-Bandwidth Mode</h2>
            </div>
          </div>

          <p className="text-xs font-semibold">
            You are viewing a lightweight, text-first version of the app to save data. 
            Your booking is saved locally and will sync when connectivity returns.
          </p>

          <div className="bg-white rounded-2xl p-6 border border-amber-300 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase">Last Synced</span>
              <span className="font-mono text-slate-800">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="text-center py-4 bg-slate-900 text-white rounded-2xl">
              <span className="text-xs text-amber-400 font-extrabold uppercase block">{t("myToken")}</span>
              <div className="text-5xl font-mono font-extrabold text-emerald-400 mt-1">
                {activeBooking?.token || "A124"}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {activeBooking?.farmerName} • {activeBooking?.crop} ({activeBooking?.quantity} Qtl)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold pt-2">
              <div className="bg-amber-100 p-3 rounded-xl">
                <span className="text-[10px] text-amber-800 block">Queue Position</span>
                <span className="text-xl text-slate-900">{activeBooking?.queuePosition || "-"}</span>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <span className="text-[10px] text-emerald-800 block">Est. Wait</span>
                <span className="text-xl text-slate-900">{activeBooking?.estimatedWait || "-"} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
`;

content = content.replace(/\/\/ If low network mode is ON[\s\S]*?\}\n/m, updatedLowNet.trim() + '\n\n');
fs.writeFileSync(path, content);
console.log('Updated FarmerPortalView low network UI');
