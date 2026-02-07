const express = require('express');
const router = express.Router();

// 화면 구성을 위한 옵션 목록
const options = {
    styles: ['한식', '일식', '중식', '양식', '기타'],
    tastes: ['매운맛', '느끼한맛', '담백한맛', '기타'],
    methods: ['튀김', '구이', '국물', '기타'],
    temperatures: ['뜨거운', '미지근한', '차가운']
};

// GET /options - 국가, 맛, 조리법, 온도 목록 반환
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: options
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '옵션을 불러오는데 실패했습니다.',
            error: error.message
        });
    }
});

module.exports = router;
