const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini AI 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /feedback - 불만족 피드백을 받아 AI로 재추천
router.post('/', async (req, res) => {
    try {
        const { originalChoices, previousMenu, feedback } = req.body;

        // 필수 필드 검증
        if (!originalChoices || !previousMenu || !feedback) {
            return res.status(400).json({
                success: false,
                message: 'originalChoices, previousMenu, feedback 필드가 필요합니다.'
            });
        }

        // API 키 확인
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Gemini API 키가 설정되지 않았습니다.'
            });
        }

        // Gemini 모델 가져오기
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // 프롬프트 생성
        const prompt = `당신은 친근한 음식 추천 전문가 "쩝쩝박사"입니다.

사용자의 원래 선택:
- 국가/스타일: ${originalChoices.category}
- 맛: ${originalChoices.taste}
- 조리법: ${originalChoices.methods}
- 온도: ${originalChoices.temp}

처음 추천했던 메뉴: ${previousMenu}
사용자가 불만족한 이유: "${feedback}"

위 정보를 바탕으로 사용자의 피드백을 반영한 새로운 메뉴를 추천해주세요.

반드시 다음 JSON 형식으로만 답변해주세요 (다른 텍스트 없이 JSON만):
{
  "menuName": "추천할 메뉴 이름",
  "message": "전문적이면서도 호들갑 떨지 않고 왜 이 메뉴를 추천하는지 설명 (2-3문장)",
  "description": "전문적이면서도 호들갑 떨지 않고 메뉴에 대한 간단한 설명 (1문장)"
}`;

        // Gemini API 호출
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // JSON 파싱 시도
        let recommendation;
        try {
            // 코드 블록 제거 (```json ... ```)
            text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            recommendation = JSON.parse(text);
        } catch (parseError) {
            console.error('JSON 파싱 오류:', text);
            // 파싱 실패시 기본 응답
            recommendation = {
                menuName: '비빔밥',
                message: '죄송해요, 제가 잠시 헷갈렸네요! 다양한 재료가 어우러진 비빔밥은 어떠세요?',
                description: '밥 위에 여러 나물과 고추장을 넣고 비벼 먹는 한국 대표 음식'
            };
        }

        res.json({
            success: true,
            data: {
                message: `그렇다면 제가 추천해드릴 메뉴는 ${recommendation.menuName}입니다! ${recommendation.message}`,
                menu: {
                    name: recommendation.menuName,
                    description: recommendation.description
                },
                originalFeedback: feedback
            }
        });

    } catch (error) {
        console.error('피드백 처리 오류:', error);
        res.status(500).json({
            success: false,
            message: 'AI 추천 중 오류가 발생했습니다.',
            error: error.message
        });
    }
});

module.exports = router;
