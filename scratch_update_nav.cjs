const fs = require('fs');

// 1. HeaderNav.jsx
let header = fs.readFileSync('src/components/common/HeaderNav.jsx', 'utf8');
header = header.replace(
  'if (currentRole === "operator" && setActiveOperatorTab) setActiveOperatorTab("queue");',
  'if (currentRole === "operator" && setActiveOperatorTab) setActiveOperatorTab("dashboard");'
);
header = header.replace(
  'if (currentRole === "admin" && setActiveAdminTab) setActiveAdminTab("monitoring");',
  'if (currentRole === "admin" && setActiveAdminTab) setActiveAdminTab("dashboard");'
);
fs.writeFileSync('src/components/common/HeaderNav.jsx', header);

// 2. FarmerPortalView.jsx
let farmer = fs.readFileSync('src/components/farmer/FarmerPortalView.jsx', 'utf8');
farmer = farmer.replace('<span>{t("bookSlotTitle")}</span>', '<span>Book Procurement Slot</span>');
farmer = farmer.replace('<span>Digital Token & Queue</span>', '<span>Token & Queue</span>');
farmer = farmer.replace('<span>Procurement Timeline</span>', '<span>Procurement</span>');
farmer = farmer.replace('<span>Payment Tracking</span>', '<span>Payment Tracking</span>');
farmer = farmer.replace('<span>Farmer Profile</span>', '<span>Profile</span>');
fs.writeFileSync('src/components/farmer/FarmerPortalView.jsx', farmer);

// 3. OperatorDashboard.jsx
let operator = fs.readFileSync('src/components/operator/OperatorDashboard.jsx', 'utf8');
// Fix default activeTab
operator = operator.replace('const activeTab = activeOperatorTab || "queue";', 'const activeTab = activeOperatorTab || "dashboard";');

const operatorTabs = `      {/* Operator Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "dashboard"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("queue")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "queue"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <Users className="w-4 h-4 text-blue-400" />
          <span>Live Queue</span>
        </button>

        <button
          onClick={() => setActiveTab("checkin")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "checkin"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Farmer Check-In</span>
        </button>

        <button
          onClick={() => setActiveTab("weighing")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "weighing"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <Scale className="w-4 h-4 text-amber-500" />
          <span>Weighing & QC</span>
        </button>

        <button
          onClick={() => setActiveTab("slots")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "slots"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Slot Management</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "analytics"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Centre Analytics</span>
        </button>
      </div>`;

operator = operator.replace(/\{\/\* Operator Navigation Tabs \*\/\}[\s\S]*?<\/div>\s*\{\/\* Render Active Operator Tab View \*\/\}/, operatorTabs + '\n\n      {/* Render Active Operator Tab View */}');

// Add "weighing" to render LiveQueueManager since it's the same table
operator = operator.replace(
  '{activeTab === "queue" && <LiveQueueManager />}',
  '{activeTab === "queue" && <LiveQueueManager />}\n      {activeTab === "weighing" && <LiveQueueManager />}'
);
fs.writeFileSync('src/components/operator/OperatorDashboard.jsx', operator);

// 4. AdminDashboard.jsx
let admin = fs.readFileSync('src/components/admin/AdminDashboard.jsx', 'utf8');
// Fix default activeTab
admin = admin.replace('const activeTab = activeAdminTab || "map";', 'const activeTab = activeAdminTab || "dashboard";');

const adminTabs = `      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "dashboard"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("monitoring")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "monitoring"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Centre Monitoring</span>
        </button>
        
        <button
          onClick={() => setActiveTab("map")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "map"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Congestion</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "analytics"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Procurement Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={\`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all \${
            activeTab === "settings"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }\`}
        >
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>System Management</span>
        </button>
      </div>`;

admin = admin.replace(/\{\/\* Admin Nav Tabs \*\/\}[\s\S]*?<\/div>\s*\{\/\* Tab Render \*\/\}/, adminTabs + '\n\n      {/* Tab Render */}');
fs.writeFileSync('src/components/admin/AdminDashboard.jsx', admin);

console.log('Navigation successfully updated!');
