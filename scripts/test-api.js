const http = require('http');

const data = JSON.stringify({
    category: '한식',
    taste: '매운맛',
    methods: '국물',
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

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Response:', JSON.parse(body));
    });
});

req.write(data);
req.end();
