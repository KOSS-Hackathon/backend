const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// POST /recommend - 4가지 선택을 받아서 바로 메뉴 추천
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

        // 1단계: 정확히 4가지 조건 모두 일치하는 메뉴 찾기
        // MongoDB 배열 필드는 값이 포함되어 있으면 매칭됨
        let menu = await Menu.findOne({
            style: { $in: [category] },
            taste: { $in: [taste] },
            methods: { $in: [methods] },
            temperature: { $in: [temp] }
        });

        let matchType = 'exact';

        // 2단계: 없으면 3가지 조건 일치로 완화
        if (!menu) {
            menu = await Menu.findOne({
                $or: [
                    { style: { $in: [category] }, taste: { $in: [taste] }, methods: { $in: [methods] } },
                    { style: { $in: [category] }, taste: { $in: [taste] }, temperature: { $in: [temp] } },
                    { style: { $in: [category] }, methods: { $in: [methods] }, temperature: { $in: [temp] } },
                    { taste: { $in: [taste] }, methods: { $in: [methods] }, temperature: { $in: [temp] } }
                ]
            });
            matchType = 'partial_3';
        }

        // 3단계: 없으면 2가지 조건 일치로 완화
        if (!menu) {
            menu = await Menu.findOne({
                $or: [
                    { style: { $in: [category] }, taste: { $in: [taste] } },
                    { style: { $in: [category] }, methods: { $in: [methods] } },
                    { style: { $in: [category] }, temperature: { $in: [temp] } },
                    { taste: { $in: [taste] }, methods: { $in: [methods] } }
                ]
            });
            matchType = 'partial_2';
        }

        // 4단계: 없으면 국가만 일치하는 랜덤 메뉴
        if (!menu) {
            const menus = await Menu.find({ style: { $in: [category] } });
            if (menus.length > 0) {
                menu = menus[Math.floor(Math.random() * menus.length)];
                matchType = 'category_only';
            }
        }

        // 5단계: 그래도 없으면 전체에서 랜덤
        if (!menu) {
            const count = await Menu.countDocuments();
            const random = Math.floor(Math.random() * count);
            menu = await Menu.findOne().skip(random);
            matchType = 'random';
        }

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: '추천할 메뉴를 찾을 수 없습니다.'
            });
        }

        // 추천 결과 반환
        res.json({
            success: true,
            data: {
                input: {
                    category,
                    taste,
                    methods,
                    temp
                },
                menu: {
                    menuId: menu.menuId,
                    name: menu.name,
                    style: menu.style,
                    taste: menu.taste,
                    methods: menu.methods,
                    temperature: menu.temperature,
                    content: menu.content
                },
                matchType: matchType
            }
        });

    } catch (error) {
        console.error('추천 오류:', error);
        res.status(500).json({
            success: false,
            message: '메뉴 추천 중 오류가 발생했습니다.',
            error: error.message
        });
    }
});

module.exports = router;
