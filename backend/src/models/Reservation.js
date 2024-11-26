const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
  affiliation: {
    type: String,
    required: true,
    maxlength: 50
  },
  rank: {
    type: String,
    required: true,
    maxlength: 50
  },
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  contact: {
    type: String,
    required: true,
    maxlength: 20 // 연락처 길이 제한
  },
  tableType: {
    type: String,
    required: true,
    //enum: ['hall', 'room'], // 테이블 타입에 대한 제한
  },
  roomType: {
    type: String,
    //required: true,
    //enum: ['청실', '난실', '죽실'], // 룸 종류에 대한 제한 예시
  },
  peopleCount: {
    type: Number,
    required: true,
    min: 1 // 최소 인원 수
  },
  menu: {
    type: [String],
    required: true // 메뉴는 필수
  },
  date: {
    type: Date,
    required: true // 예약일자 필수
  },
  time: {
    type: String,
    required: true // 예약시간 필수
  },
  status: {
    type: String,
    required: true, // 필수로 설정
    enum: ['예약', '완료', '취소'], // 상태 값 제한
    default: '예약' // 기본값 설정
  },
 
});

// 예약 모델 생성
const Reservation = mongoose.model('Reservation', reservationSchema);


module.exports = Reservation;
