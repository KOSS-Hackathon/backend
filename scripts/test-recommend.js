const http = require('http');

const data = JSON.stringify({
    category: '일식',
    taste: '기타',
    methods: '기타',
    temp: '뜨거운'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/recommend',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log('🔄 메뉴 추천 요청 중...');
console.log('📋 선택: 일식 / 기타맛 / 기타조리법 / 뜨거운\n');

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        const result = JSON.parse(body);
        if (result.success) {
            console.log('✅ 추천 결과!');
            console.log('━'.repeat(40));
            console.log('🍜 메뉴:', result.data.menu.name);
            console.log('📖 설명:', result.data.menu.content);
            console.log('🏷️  매칭:', result.data.matchType);
            console.log('━'.repeat(40));
        } else {
            console.log('❌ 오류:', result.message);
        }
    });
});

req.write(data);
req.end();
