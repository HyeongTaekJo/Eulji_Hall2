// src/components/Calendar.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import styled from "styled-components";
import { fetchHallTypes, fetchReservations, fetchRoomTypes } from "../../store/reservationThunks";

// 스타일 컴포넌트
const CalendarWrapper = styled.div`
  width: 100%;
  height: auto; /* 화면 높이를 100%로 설정 */
  max-width: 2000px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  font-family: "Arial", sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  font-size: 2rem;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
  text-align: center;
`;

const Day = styled.div`
  padding: 10px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
`;

const DateBox = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCurrentMonth',
})`
  padding: 10px;
  height: calc(100vh / 7 - 20px); /* 반응형 높이 계산 */
  border: 1px solid #ddd;
  background-color: ${(props) => (props.isCurrentMonth ? "white" : "#f0f0f0")};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transition: background-color 0.3s;

  font-size: 1rem; /* 날짜 숫자 크기 증가 */
  font-weight: bold; /* 숫자 강조 */

  &:hover {
    background-color: #e9ecef;
  }

  & > div {
    margin-top: 5px;
    font-size: 0.8rem;
    color: #007bff;
    text-align: center;
  }
`;

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { reservations = [],  } = useSelector((state) => state.reservation || {});
  const roomTypes = useSelector((state) => state.reservation.roomTypes || []);
  const hallTypes = useSelector((state) => state.reservation.hallTypes || []);
  const [roomMaxPeople, setRoomMaxPeople] = useState(0);
  const [data, setData] = useState({
    "2024-11-23": ["미팅", "할 일 1"],
    "2024-11-25": ["워크샵", "프로젝트 리뷰"],
  });

  const dispatch = useDispatch();

  const [hallLimit, setHallLimit] = useState(0); //홀 테이블 총 수량

  useEffect(() => {
    // 오늘 날짜를 YYYY-MM-DD 형식으로 구하기
    const today = new Date();
    
    // 로컬 시간 기준으로 날짜 포맷팅
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // startDate로 오늘 날짜 전달
    dispatch(fetchReservations({ startDate: formattedDate })).then(() => {
      // 성공적인 호출 후 추가 작업
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRoomTypes());
    //console.log('Room types fetched successfully');
    //console.log(JSON.stringify(roomTypes, null, 2)); 

    // `isAvailable`이 true인 항목 필터링 후 `maxPeople` 값 중 가장 큰 값 찾기
    const maxPeople = roomTypes
      .filter((room) => room.isAvailable && room.maxPeople !== undefined)
      .reduce((max, room) => Math.max(max, room.maxPeople), 0);

    setRoomMaxPeople(maxPeople); // 상태 업데이트
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchHallTypes());
    setHallLimit(hallTypes.length);
    //console.log(JSON.stringify(hallTypes, null, 2)); 
  }, [dispatch, hallTypes.length]);

  const calculateRemainingRoomCapacity = (reservations, roomTypes) => {
    // 날짜별로 데이터를 그룹화하기 위한 결과 객체 초기화
    const result = {};
  
    // "예약" 상태인 데이터만 필터링
    const filteredReservations = reservations.filter((reservation) => reservation.status === "예약");
  
    filteredReservations.forEach((reservation) => {
      const { date, roomType, peopleCount, tableType } = reservation;
      const formattedDate = new Date(date).toISOString().split("T")[0]; // 날짜를 YYYY-MM-DD 형식으로 변환
  
      // 해당 날짜가 result 객체에 없으면 초기화
      if (!result[formattedDate]) {
        result[formattedDate] = {
          remainingPeople: 0, // 남아 있는 방들의 최대 수용 인원 합계
          bookedRooms: [], // 해당 날짜에 예약된 방 이름 목록
          remainingTables: hallLimit, // 남아있는 홀 테이블 수
          remainingRooms: [], // 남아있는 룸 목록
          minRoomPeople: Infinity, // 남아있는 룸의 최소 인원 (최소값 초기화)
          maxRoomPeople: 0, // 남아있는 룸의 최대 인원 (최대값 초기화)
          totalRemainingRooms: 0,  // 남아있는 방 수 추가
          remainingHallPeople: 0, // 남아있는 홀의 총 인원 수
          totalBookedTables: 0, // 예약된 총 홀 테이블 수
          totalBookedRooms: 0, // 예약된 총 룸 수량
          totalBookedHallPeople: 0, // 예약된 홀 인원 수
          totalBookedRoomPeople: 0, // 예약된 룸 인원 수
        };
      }
  
      // 예약된 방 추가, undefined 값 제외
      if (roomType && roomType !== "미지정") {
        result[formattedDate].bookedRooms.push(roomType);
        result[formattedDate].totalBookedRooms += 1; // 예약된 룸 수량 증가
        result[formattedDate].totalBookedRoomPeople += peopleCount; // 룸 예약된 인원 수 증가
      }

      // 홀 예약인 경우 테이블 수 계산 (1개 테이블은 4명 수용)
      if (tableType === "홀") {
        const tablesNeeded = Math.ceil(peopleCount / 4); // 필요한 테이블 수 계산
        result[formattedDate].totalBookedTables += tablesNeeded; // 예약된 총 홀 테이블 수량 증가
        result[formattedDate].totalBookedHallPeople += peopleCount; // 홀 예약된 인원 수 증가
        
        // 남아있는 테이블 수가 부족할 경우 차감을 방지하도록 조건 추가
        if (result[formattedDate].remainingTables >= tablesNeeded) {
          result[formattedDate].remainingTables -= tablesNeeded;
        } else {
          // 남은 테이블 수가 부족하면 0으로 설정
          result[formattedDate].remainingTables = 0;
        }
      }
    });
  
    // 날짜별로 방 데이터를 처리하여 남은 수용 인원을 계산
    Object.keys(result).forEach((date) => {
      const bookedRooms = result[date].bookedRooms;
  
      // 해당 날짜에 이미 예약된 방을 제외한 나머지 방 목록 필터링 (isAvailable가 true인 방만 포함)
      const remainingRooms = roomTypes.filter(
        (room) => room.isAvailable && room.name !== "미지정" && !bookedRooms.includes(room.name)
      );
  
      // 남아 있는 방들의 maxPeople 값을 합산
      result[date].remainingPeople = remainingRooms.reduce((sum, room) => {
        result[date].minRoomPeople = Math.min(result[date].minRoomPeople, room.minPeople); // 최소 인원 업데이트
        result[date].maxRoomPeople = Math.max(result[date].maxRoomPeople, room.maxPeople); // 최대 인원 업데이트
        return sum + (room.maxPeople || 0); // maxPeople 값이 없으면 기본값으로 0 사용
      }, 0);
  
      // 남아 있는 룸들의 정보를 업데이트 (minimum과 maximum 인원 값)
      result[date].remainingRooms = remainingRooms.map(room => room.name);

      // 추가: 남아 있는 방 수 합계 계산
      result[date].totalRemainingRooms = remainingRooms.length;

      // 홀의 남은 인원 수 계산 (각 테이블은 4명 수용)
      result[date].remainingHallPeople = result[date].remainingTables * 4;
    });
  
    return result;
};

useEffect(() => {
  const remainingRoomCapacity = calculateRemainingRoomCapacity(reservations, roomTypes);

  const newData = Object.keys(remainingRoomCapacity).reduce((acc, date) => {
    const roomData = remainingRoomCapacity[date];

    const bookedRoomsCount = roomData.totalBookedRooms;
    const bookedHallTablesCount = roomData.totalBookedTables;
    const bookedRoomPeople = roomData.totalBookedRoomPeople;
    const bookedHallPeople = roomData.totalBookedHallPeople;

    const roomInfo = `룸 : ${bookedRoomsCount}팀 (총 : ${bookedRoomPeople}명)`;
    const hallInfo = `홀 : ${bookedHallTablesCount}팀 (총 : ${bookedHallPeople}명)`;

    acc[date] = [roomInfo, hallInfo];
    return acc;
  }, {});

  setData(newData);
}, [reservations, roomTypes, hallTypes]);  // 예약 데이터나 룸 타입이 변경될 때마다 실행


  const renderHeader = () => {
    return (
      <Header>
        <Button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          이전
        </Button>
        {format(currentDate, "yyyy년 MM월", { locale: ko })}
        <Button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          다음
        </Button>
      </Header>
    );
  };

  const renderDays = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days.map((day) => <Day key={day}>{day}</Day>);
  };

  const renderDates = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    let day = weekStart;
    const dates = [];

    while (day <= weekEnd) {
      const formattedDate = format(day, "yyyy-MM-dd");
      const isCurrentMonth = format(day, "MM") === format(monthStart, "MM");

      dates.push(
        <DateBox key={day} isCurrentMonth={isCurrentMonth}>
          {format(day, "d")}
          {data[formattedDate] &&
            data[formattedDate].map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
        </DateBox>
      );

      day = addDays(day, 1);
    }

    return dates;
  };

  return (
    <CalendarWrapper>
      {renderHeader()}
      <Grid>{renderDays()}</Grid>
      <Grid>{renderDates()}</Grid>
    </CalendarWrapper>
  );
};

export default Calendar;
