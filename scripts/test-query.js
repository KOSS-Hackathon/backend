require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Menu = require('../models/Menu');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected!');

    // Test exact query
    const menu = await Menu.findOne({
        style: { $in: ['한식'] },
        taste: { $in: ['매운맛'] },
        methods: { $in: ['국물'] },
        temperature: { $in: ['뜨거운'] }
    });

    console.log('Found menu:', menu ? menu.name : 'NOT FOUND');
    console.log('Full data:', JSON.stringify(menu, null, 2));

    mongoose.disconnect();
});
