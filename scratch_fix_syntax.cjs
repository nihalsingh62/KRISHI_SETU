const fs = require('fs');

const path = 'src/components/farmer/FarmerPortalView.jsx';
let content = fs.readFileSync(path, 'utf8');

// The file currently has:
//   }
//
//              className="text-xs bg-amber-800 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-amber-900"
//            >
//              Exit Low-Net Mode
//            </button>
//          </div>

// Wait, the rest of the file is broken.
// I will just fetch the whole file and then use regex to clean up the bad syntax.
const parts = content.split('  return (\n    <div className="space-y-6">');
let beforeReturn = parts[0];
let afterReturn = '  return (\n    <div className="space-y-6">' + parts[1];

// Clean up the `beforeReturn` which has the bad syntax at the end.
beforeReturn = beforeReturn.substring(0, beforeReturn.indexOf('    );\n  }') + '    );\n  }\n'.length);

fs.writeFileSync(path, beforeReturn + '\n' + afterReturn);
console.log('Fixed syntax error');
