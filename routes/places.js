const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const Session = require('../models/Session');

// GET /places - 세션 ID로 DB를 쿼리하여 음식 추천
router.get('/', async (req, res) => {
    try {
        const { sessionId } = req.query;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'sessionId가 필요합니다.'
            });
        }

        // 세션 조회
        const session = await Session.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: '세션을 찾을 수 없습니다.'
            });
        }

        // 정확히 매칭되는 메뉴 찾기
        let menu = await Menu.findOne({
            style: { $in: [session.category] },
            taste: { $in: [session.taste] },
            methods: { $in: [session.methods] },
            temperature: { $in: [session.temp] }
        });

        // 정확한 매칭이 없으면 부분 매칭 시도 (3개 조건)
        if (!menu) {
            menu = await Menu.findOne({
                $or: [
                    {
                        style: { $in: [session.category] },
                        taste: { $in: [session.taste] },
                        methods: { $in: [session.methods] }
                    },
                    {
                        style: { $in: [session.category] },
                        taste: { $in: [session.taste] },
                        temperature: { $in: [session.temp] }
                    },
                    {
                        style: { $in: [session.category] },
                        methods: { $in: [session.methods] },
                        temperature: { $in: [session.temp] }
                    }
                ]
            });
        }

        // 여전히 없으면 스타일만으로 랜덤 추천
        if (!menu) {
            const menus = await Menu.find({ style: { $in: [session.category] } });
            if (menus.length > 0) {
                menu = menus[Math.floor(Math.random() * menus.length)];
            }
        }

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: '조건에 맞는 메뉴를 찾을 수 없습니다.'
            });
        }

        // 세션에 추천 메뉴 저장
        session.recommendedMenu = menu._id;
        await session.save();

        res.json({
            success: true,
            data: {
                menuId: menu.menuId,
                name: menu.name,
                style: menu.style,
                taste: menu.taste,
                methods: menu.methods,
                temperature: menu.temperature,
                content: menu.content
            }
        });
    } catch (error) {
        console.error('Places query error:', error);
        res.status(500).json({
            success: false,
            message: '메뉴 추천에 실패했습니다.',
            error: error.message
        });
    }
});

module.exports = router;
