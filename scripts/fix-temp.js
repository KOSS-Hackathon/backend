const fs = require('fs');

// Read the file
let data = fs.readFileSync('./data/menuData.json', 'utf8');

// Replace temperature values
data = data.replace(/"따뜻한"/g, '"미지근한"');
data = data.replace(/"상온"/g, '"미지근한"');

// Write back
fs.writeFileSync('./data/menuData.json', data);

console.log('온도 변환 완료!');
console.log('따뜻한, 상온 → 미지근한');
