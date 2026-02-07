const fs = require('fs');
const path = require('path');

// 메뉴 데이터 로드
const menuDataPath = path.join(__dirname, '../data/menuData.json');
const menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'));

// 변환 매핑
const styleMap = {
    '한식': 'korean',
    '일식': 'japanese',
    '중식': 'chinese',
    '양식': 'western',
    '기타': 'etc'
};

const tasteMap = {
    '매운맛': 'spicy',
    '느끼한맛': 'greasy',
    '담백한맛': 'plain',
    '기타': 'etc'
};

const methodMap = {
    '튀김': 'fried',
    '구이': 'grilled',
    '국물': 'soup',
    '기타': 'etc'
};

const tempMap = {
    '뜨거운': 'hot',
    '따뜻한': 'warm',
    '미지근한': 'warm',
    '차가운': 'cold'
};

// 변환 함수
function convertArray(arr, map) {
    return arr.map(item => map[item] || item);
}

// 모든 메뉴 항목 변환
let convertedCount = 0;
menuData.forEach(menu => {
    if (menu.style) {
        menu.style = convertArray(menu.style, styleMap);
    }
    if (menu.taste) {
        menu.taste = convertArray(menu.taste, tasteMap);
    }
    if (menu.methods) {
        menu.methods = convertArray(menu.methods, methodMap);
    }
    if (menu.temperature) {
        menu.temperature = convertArray(menu.temperature, tempMap);
    }
    convertedCount++;
});

// 저장
fs.writeFileSync(menuDataPath, JSON.stringify(menuData, null, 4), 'utf8');

console.log(`✅ ${convertedCount}개 메뉴 항목 변환 완료!`);
console.log(`📄 저장 위치: ${menuDataPath}`);
