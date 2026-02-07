const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');

// POST /session - 유저의 4가지 답변을 받아 세션 생성
router.post('/', async (req, res) => {
    try {
        const { category, taste, methods, temp } = req.body;

        // 필수 필드 검증
        if (!category || !taste || !methods || !temp) {
            return res.status(400).json({
                success: false,
                message: '모든 필드(category, taste, methods, temp)가 필요합니다.'
            });
        }

        // UUID 생성
        const sessionId = uuidv4();

        // 세션 저장
        const newSession = new Session({
            sessionId,
            category,
            taste,
            methods,
            temp
        });

        await newSession.save();

        res.status(201).json({
            success: true,
            data: {
                sessionId,
                message: '세션이 성공적으로 생성되었습니다.'
            }
        });
    } catch (error) {
        console.error('Session creation error:', error);
        res.status(500).json({
            success: false,
            message: '세션 생성에 실패했습니다.',
            error: error.message
        });
    }
});

// GET /session/:sessionId - 세션 정보 조회
router.get('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: '세션을 찾을 수 없습니다.'
            });
        }

        res.json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '세션 조회에 실패했습니다.',
            error: error.message
        });
    }
});

module.exports = router;
