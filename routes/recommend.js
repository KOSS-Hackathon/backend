const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 로컬 JSON 파일에서 메뉴 데이터 로드
const menuDataPath = path.join(__dirname, '../data/menuData.json');
let menuData = [];

try {
    menuData = JSON.parse(fs.readFileSync(menuDataPath, 'utf8'));
    console.log(`✅ 메뉴 데이터 로드 완료: ${menuData.length}개`);
} catch (error) {
    console.error('❌ 메뉴 데이터 로드 실패:', error.message);
}

// 배열에 값이 포함되어 있는지 확인하는 헬퍼 함수
function arrayIncludes(arr, value) {
    return Array.isArray(arr) && arr.includes(value);
}

// POST /recommend - 4가지 선택을 받아서 바로 메뉴 추천
router.post('/', (req, res) => {
    try {
        const { category, taste, methods, temp } = req.body;

        console.log('📥 추천 요청:', { category, taste, methods, temp });

        // 필수 필드 검증
        if (!category || !taste || !methods || !temp) {
            return res.status(400).json({
                success: false,
                message: '모든 필드(category, taste, methods, temp)가 필요합니다.'
            });
        }

        let menu = null;
        let matchType = 'exact';

        // 1단계: 정확히 4가지 조건 모두 일치하는 메뉴 찾기
        const exactMatches = menuData.filter(m =>
            arrayIncludes(m.style, category) &&
            arrayIncludes(m.taste, taste) &&
            arrayIncludes(m.methods, methods) &&
            arrayIncludes(m.temperature, temp)
        );

        if (exactMatches.length > 0) {
            menu = exactMatches[Math.floor(Math.random() * exactMatches.length)];
            matchType = 'exact';
        }

        // 2단계: 없으면 3가지 조건 일치로 완화
        if (!menu) {
            const partial3Matches = menuData.filter(m => {
                let matchCount = 0;
                if (arrayIncludes(m.style, category)) matchCount++;
                if (arrayIncludes(m.taste, taste)) matchCount++;
                if (arrayIncludes(m.methods, methods)) matchCount++;
                if (arrayIncludes(m.temperature, temp)) matchCount++;
                return matchCount >= 3;
            });

            if (partial3Matches.length > 0) {
                menu = partial3Matches[Math.floor(Math.random() * partial3Matches.length)];
                matchType = 'partial_3';
            }
        }

        // 3단계: 없으면 2가지 조건 일치로 완화
        if (!menu) {
            const partial2Matches = menuData.filter(m => {
                let matchCount = 0;
                if (arrayIncludes(m.style, category)) matchCount++;
                if (arrayIncludes(m.taste, taste)) matchCount++;
                if (arrayIncludes(m.methods, methods)) matchCount++;
                if (arrayIncludes(m.temperature, temp)) matchCount++;
                return matchCount >= 2;
            });

            if (partial2Matches.length > 0) {
                menu = partial2Matches[Math.floor(Math.random() * partial2Matches.length)];
                matchType = 'partial_2';
            }
        }

        // 4단계: 없으면 국가만 일치하는 랜덤 메뉴
        if (!menu) {
            const categoryMatches = menuData.filter(m => arrayIncludes(m.style, category));
            if (categoryMatches.length > 0) {
                menu = categoryMatches[Math.floor(Math.random() * categoryMatches.length)];
                matchType = 'category_only';
            }
        }

        // 5단계: 그래도 없으면 전체에서 랜덤
        if (!menu && menuData.length > 0) {
            menu = menuData[Math.floor(Math.random() * menuData.length)];
            matchType = 'random';
        }

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: '추천할 메뉴를 찾을 수 없습니다.'
            });
        }

        console.log(`✅ 추천 결과: ${menu.name} (${matchType})`);

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
