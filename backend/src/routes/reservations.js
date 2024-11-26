const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const RoomType = require('../models/RoomType');
const HallType = require('../models/HallType');


// 예약 생성
router.post('/create', async (req, res, next) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    return res.json(reservation);
  } catch (error) {
    next(error);
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
