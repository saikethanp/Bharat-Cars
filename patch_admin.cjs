const fs = require('fs');

let code = fs.readFileSync('src/components/AdminView.tsx', 'utf-8');

const regex = /\{\/\* Secure Handshake Credentials Tip \*\/\}\s*<div className="bg-white\/\[0\.02\] border border-white\/5 rounded-lg p-4 text-center space-y-1" id="demo-credentials-helper">[\s\S]*?<\/div>/;

if (code.match(regex)) {
  code = code.replace(regex, '');
  fs.writeFileSync('src/components/AdminView.tsx', code);
  console.log("Removed demo credentials");
} else {
  console.log("Could not find demo credentials");
}
