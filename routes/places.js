const express = require("express");
const router = express.Router();
const axios = require("axios");

// 기본 위치: 국민대 근처 키워드 기준
router.get("/", async (req, res) => {
    console.log("🔥 /places HIT", req.originalUrl);
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "query가 필요합니다."
      });
    }

    const response = await axios.get(
      "https://openapi.naver.com/v1/search/local.json",
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET
        },
        params: {
          query: `국민대 ${query}`, // 위치 보정
          display: 10,
          sort: "random"
        }
      }
    );

    const places = response.data.items.map(item => ({
      name: item.title.replace(/<[^>]*>/g, ""),
      address: item.roadAddress || item.address,
      category: item.category,
      description: item.description,
      link: item.link
    }));

    res.json({
      success: true,
      data: {
        baseLocation: "국민대",
        query,
        places
      }
    });

  } catch (error) {
    console.error("Naver place error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "네이버 장소 검색 실패"
    });
  }
});

module.exports = router;
