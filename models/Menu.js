const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  style: {
    type: [String],
    required: true
  },
  taste: {
    type: [String],
    required: true
  },
  methods: {
    type: [String],
    required: true
  },
  temperature: {
    type: [String],
    required: true
  },
  content: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// 개별 인덱스 생성 (복합 배열 인덱스 불가)
menuSchema.index({ style: 1 });
menuSchema.index({ taste: 1 });
menuSchema.index({ methods: 1 });
menuSchema.index({ temperature: 1 });

module.exports = mongoose.model('Menu', menuSchema);
