const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

// POST /feedback - 불만족 사유 수집 (보류 기능)
router.post('/', async (req, res) => {
    try {
        const { sessionId, reason, comments } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'sessionId가 필요합니다.'
            });
        }

        // 세션 확인
        const session = await Session.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: '세션을 찾을 수 없습니다.'
            });
        }

        // TODO: 피드백 저장 로직 구현
        // TODO: LLM 재추천 로직 트리거

        res.json({
            success: true,
            message: '피드백이 접수되었습니다. (기능 개발 중)',
            data: {
                sessionId,
                reason,
                comments
            }
        });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({
            success: false,
            message: '피드백 처리에 실패했습니다.',
            error: error.message
        });
    }
});

module.exports = router;
