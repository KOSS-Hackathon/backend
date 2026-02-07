require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 라우터 임포트
const optionsRouter = require('./routes/options');
const sessionRouter = require('./routes/session');
const placesRouter = require('./routes/places');
const feedbackRouter = require('./routes/feedback');
const recommendRouter = require('./routes/recommend');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // 모든 출처 허용 (Flutter 앱 통신용)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB 연결 성공');
    })
    .catch((err) => {
        console.error('❌ MongoDB 연결 실패:', err.message);
    });

// 라우터 등록
app.use('/options', optionsRouter);
app.use('/session', sessionRouter);
app.use('/places', placesRouter);
app.use('/feedback', feedbackRouter);
app.use('/recommend', recommendRouter);

// 기본 라우트
app.get('/', (req, res) => {
    res.json({
        message: '🍜 쩝쩝박사 API 서버',
        version: '1.0.0',
        endpoints: {
            'GET /options': '필터 옵션 목록 조회',
            'POST /session': '세션 생성',
            'GET /places': '세션 기반 음식 추천',
            'POST /recommend': '4가지 선택으로 바로 음식 추천',
            'POST /feedback': '피드백 제출 (개발 중)'
        }
    });
});

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '요청한 리소스를 찾을 수 없습니다.'
    });
});

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: '서버 오류가 발생했습니다.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 쩝쩝박사 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📍 http://localhost:${PORT}`);
});


module.exports = app;
