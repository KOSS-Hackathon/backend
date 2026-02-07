require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Menu = require('../models/Menu');
const menuData = require('../data/menuData.json');

async function seedDatabase() {
    try {
        // MongoDB 연결
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB 연결 성공');

        // 기존 데이터 확인
        const existingCount = await Menu.countDocuments();

        if (existingCount > 0) {
            console.log(`⚠️ 기존 데이터 ${existingCount}개가 있습니다.`);
            console.log('기존 데이터를 삭제하고 새로 시딩합니다...');
            await Menu.deleteMany({});
        }

        // 데이터 삽입
        const result = await Menu.insertMany(menuData);
        console.log(`✅ ${result.length}개의 메뉴가 성공적으로 추가되었습니다.`);

        // 카테고리별 통계 출력
        const stats = await Menu.aggregate([
            { $unwind: '$style' },
            { $group: { _id: '$style', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n📊 카테고리별 메뉴 현황:');
        stats.forEach(stat => {
            console.log(`   ${stat._id}: ${stat.count}개`);
        });

    } catch (error) {
        console.error('❌ 시딩 오류:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB 연결 종료');
        process.exit(0);
    }
}

seedDatabase();
