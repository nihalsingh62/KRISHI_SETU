const fs = require('fs');

const path = 'src/context/KisanSetuContext.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'const [activeOperatorTab, setActiveOperatorTab] = useState(() => getInitialState("ks_activeOperatorTab", "queue"));',
  'const [activeOperatorTab, setActiveOperatorTab] = useState(() => getInitialState("ks_activeOperatorTab", "dashboard"));'
);

content = content.replace(
  'const [activeAdminTab, setActiveAdminTab] = useState(() => getInitialState("ks_activeAdminTab", "map"));',
  'const [activeAdminTab, setActiveAdminTab] = useState(() => getInitialState("ks_activeAdminTab", "dashboard"));'
);

fs.writeFileSync(path, content);
console.log('Fixed default tabs in context');
