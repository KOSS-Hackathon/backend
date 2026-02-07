const http = require('http');

const data = JSON.stringify({
    originalChoices: {
        category: '한식',
        taste: '매운맛',
        methods: '국물',
        temp: '뜨거운'
    },
    previousMenu: '김치찌개',
    feedback: '고기가 더 들어갔으면 좋겠어요'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/feedback',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log('🔄 피드백 API 테스트 중...\n');

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        const result = JSON.parse(body);
        console.log('✅ 응답 받음!\n');
        console.log('📝 메시지:', result.data?.message);
        console.log('🍜 메뉴:', result.data?.menu?.name);
        console.log('📖 설명:', result.data?.menu?.description);
    });
});

req.on('error', (e) => {
    console.error('❌ 오류:', e.message);
});

req.write(data);
req.end();
