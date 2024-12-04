const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const RoomType = require('../models/RoomType');
const HallType = require('../models/HallType');
const axios = require('axios');
const qs = require('qs');

const apikey = 'we7znqi4ke1zh05wuc5kozrmoag2tthr';
const userid = 'diajd1';
const kakaoChannelKey = '3db47708194aa95d46ec07dbf911ad4cd53fe115';
const templateCode = 'TW_2596';

// 알림톡
const sendAlimTalk = async (reservationData) => {
  const { name, affiliation, rank, contact, menu, date, time, peopleCount, tableType } = reservationData;

  // 템플릿 매핑 변수
  const 고객명 = name;
  const 소속 = affiliation;
  const 계급 = rank;
  const 연락처 = contact;
  const 메뉴 = menu.join(', ');
  const 예약일자 = date;
  const 예약시간 = time;
  const 인원수 = peopleCount;
  const 룸홀 = tableType;

  // 요청 데이터 URL-encoded 형식으로 변환
  const data = qs.stringify({
    apikey: apikey,
    userid: userid,
    senderkey: kakaoChannelKey,
    tpl_code: templateCode,
    sender: '01089035627',
    receiver_1: 연락처,
    recvname_1: 고객명,
    subject_1: '을지회관 예약 안내',
    emtitle_1: '예약 완료 안내',
    message_1: `\n안녕하세요, ${고객명}님.\n${고객명}님의 예약이 완료되었습니다.\n\n소속: ${소속}\n계급: ${계급}\n연락처: ${연락처}\n메뉴: ${메뉴}\n예약일자: ${예약일자}\n예약시간: ${예약시간}\n인원수: ${인원수}명\n타입: ${룸홀}\n\n궁금하신 사항은 언제든지 문의해 주세요.\n감사합니다.`,
    testMode: 'N',
  });

  // 요청 설정
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://kakaoapi.aligo.in/akv10/alimtalk/send/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
  };

  // API 요청
  const response = await axios.request(config);
  return response.data;
};


// 예약 생성 및 알림톡 전송
router.post('/create', async (req, res, next) => {
  try {
    console.log("req.body-> " + JSON.stringify(req.body, null, 2));

    // 예약 저장
    const reservation = new Reservation(req.body);
    await reservation.save();
    console.log('Reservation created successfully:', reservation);

    // 알림톡 전송
    try {
      const alimTalkResponse = await sendAlimTalk(req.body);
      console.log('AlimTalk sent successfully:', alimTalkResponse);
    } catch (alimTalkError) {
      console.error('Error sending AlimTalk:', alimTalkError.response?.data || alimTalkError.message);
    }

    return res.json(reservation);
  } catch (error) {
    next(error); // 오류 처리 미들웨어로 전달
  }
});

// 예약 목록 조회
router.get('/', async (req, res, next) => {
  try {
    const { startDate, endDate, statusFilter } = req.query;
    
    // 필터링 조건을 위한 객체 초기화
    const filterConditions = {};

    // startDate와 endDate를 처리
    if (startDate) {
      filterConditions.date = filterConditions.date || {};
      filterConditions.date.$gte = new Date(startDate); // startDate 이후의 값 필터링
    }

    if (endDate) {
      filterConditions.date = filterConditions.date || {};
      filterConditions.date.$lte = new Date(endDate); // endDate 이전의 값 필터링
    }

    // statusFilter 처리
    if (statusFilter && statusFilter !== '전체') {
      filterConditions.status = statusFilter; // statusFilter 값으로 필터링
    }

    // 조건에 맞는 예약 목록 조회
    const reservations = await Reservation.find(filterConditions).sort({ date: -1 });
    //console.log("roomTypes start" + roomTypes)
    return res.json(reservations);
  } catch (error) {
    next(error);
  }
});


// 특정 예약 조회
router.get('/:id', async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "예약을 찾을 수 없습니다." });
    }
    return res.json(reservation);
  } catch (error) {
    next(error);
  }
});

// 예약 수정
router.put('/:id', async (req, res, next) => {
  try {
    const updateData = req.body; // req.body에서 모든 데이터를 받아옴

    // 기존 데이터를 가져옴
    const existingReservation = await Reservation.findById(req.params.id);
    if (!existingReservation) {
      return res.status(404).json({ message: "예약을 찾을 수 없습니다." });
    }

    // 기존 데이터와 새로운 데이터를 병합
    const mergedData = {
      ...existingReservation.toObject(), // 기존 데이터 객체화
      ...updateData, // 업데이트할 데이터 덮어쓰기
    };

    // 병합된 데이터를 업데이트
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      mergedData, // 병합된 데이터로 업데이트
      { new: true }
    );

    return res.json({ message: "예약이 성공적으로 수정되었습니다.", reservation });
  } catch (error) {
    next(error);
  }
});

// 예약 삭제
router.delete('/:id', async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "예약을 찾을 수 없습니다." });
    }
    return res.json({ message: "예약이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
});

// 예약 목록 조회 (이름, 연락처, 상태로 필터링)
router.post('/search', async (req, res, next) => {
  //console.log("RoomType start")
  const { searchName, searchContact, status } = req.body; // status 추가
  try {
    // 쿼리 객체 생성
    const query = {};
    
    if (searchName) query.name = { $regex: searchName, $options: 'i' }; // 이름 필터링
    if (searchContact) query.contact = { $regex: searchContact, $options: 'i' }; // 연락처 필터링
    if (status) query.status = status; // 상태 필터링 추가

    // 필터링된 예약 조회 및 정렬
    const reservations = await Reservation.find(query).sort({ date: 1 }); // 날짜 기준 오름차순 정렬
    return res.json(reservations);
  } catch (error) {
    next(error);
  }
});

// 룸 타입조회
router.post('/fetchRoomTypes', async (req, res, next) => {
  try {
    // RoomType 테이블에서 모든 데이터 가져오기
    //console.log("RoomType start")
    const roomTypes = await RoomType.find(); // 적절한 조건 추가 가능

    //console.log("roomTypes start" + roomTypes)
    res.json(roomTypes);
  } catch (error) {
    // 에러가 발생한 경우 처리
    console.error('Error fetching room types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room types',
      error: error.message,
    });
  }
});

// 홀 타입조회
router.post('/fetchHallTypes', async (req, res, next) => {
  try {
    // RoomType 테이블에서 모든 데이터 가져오기
    //console.log("hallTypes start")
    const hallTypes = await HallType.find(); // 적절한 조건 추가 가능

    //console.log("hallTypes start" + hallTypes)
    res.json(hallTypes);
  } catch (error) {
    // 에러가 발생한 경우 처리
    console.error('Error fetching room types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room types',
      error: error.message,
    });
  }
});


module.exports = router;
