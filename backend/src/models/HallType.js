const mongoose = require('mongoose');

const hallTypeSchema = mongoose.Schema({
  name: {
    type: Number,
    required: true,
    //maxlength: 100 // 룸 이름 길이 제한
  },
  minPeople: {
    type: Number,
    required: true,
    //min: 1 // 최소 인원 수 제한
  },
  maxPeople: {
    type: Number,
    required: true,
    //min: 1 // 최대 인원 수 제한
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true // 기본적으로 사용 가능 여부는 true
  }
});

// 룸타입 모델 생성
const HallType = mongoose.model('HallType', hallTypeSchema);

module.exports = HallType;
