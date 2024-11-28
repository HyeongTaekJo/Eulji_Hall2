import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createReservation, fetchHallTypes, fetchReservations, fetchRoomTypes } from '../../store/reservationThunks';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';  // date-fns의 한국어 로케일을 임포트
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for date picker

const FormContainer = styled.div`
  max-width: 700px;
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;


  @media (max-width: 576px) {
    max-width: 330px;
  width: 100%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;

  @media (max-width: 576px) {
    font-size: 1.25rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-top: 10px;
  font-size: 1rem;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const SmallInput = styled(Input)`
  flex-grow: 1;
  margin-right: 5px;

  @media (max-width: 576px) {
      font-size: 0.9rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const CustomDatePicker = styled.input`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 130px;
  background-color: #fff;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  height: 35px;

  &:focus {
    border-color: #007bff;
    background-color: #e9f7ff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0.8;
    cursor: pointer;
  }

  @media (max-width: 576px) {
    width: 100%;
    font-size: 0.9rem;
  }
`;

const TableButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const TableButton = styled.button`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${({ selected }) => (selected ? '#007bff' : '#f8f9fa')};
  color: ${({ selected }) => (selected ? '#fff' : '#007bff')};
  cursor: pointer;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#e9f7ff')};
  }

  @media (max-width: 576px) {
    flex: 1 1 48%;
    font-size: 0.9rem;
  }
`;

const MenuButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;

`;

const MenuButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${({ selected }) => (selected ? '#007bff' : '#f8f9fa')};
  color: ${({ selected }) => (selected ? '#fff' : '#007bff')};
  cursor: pointer;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#0056b3' : '#e9f7ff')};
  }

  @media (max-width: 576px) {
    flex: 1; /* 모바일 화면에서도 버튼이 한 줄로 나타나도록 설정 */
    font-size: 0.8rem;
  }
`;



const generateTimeOptions = () => {
  const times = [];
  let currentHour = 10;
  let currentMinute = 0;

  while (currentHour < 22 || (currentHour === 22 && currentMinute === 0)) {
    const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    times.push(timeString);

    currentMinute += 30;
    if (currentMinute === 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }

  return times;
};

const ReservationForm = () => {
  const { reservations = [],  } = useSelector((state) => state.reservation || {});
  const roomTypes = useSelector((state) => state.reservation.roomTypes || []);
  const hallTypes = useSelector((state) => state.reservation.hallTypes || []);
  const roomData = useSelector((state) => state.reservation.roomTypes || []);
  const { register, handleSubmit, control, formState: { errors }, reset, setValue,watch,trigger  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const watchMenu = watch("menu", []); 

  const today = new Date();
  const watchTableType = watch("tableType", "");

  const handleDateChange = (date) => {
    if (date) {
      // 선택된 날짜에서 시간을 제거하고, 날짜만 설정 (시간을 00:00:00으로 설정)
      const newDate = (new Date(date));
      newDate.setHours(0, 0, 0, 0);  // 시간 부분을 00:00:00으로 설정
      setValue('reservationDate', newDate); // 날짜 상태 업데이트
    }
  };

  // 각 필드 값들 별도로 상태 관리
  const [tableType, setTableType] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [hallLimit, setHallLimit] = useState(0); //홀 테이블 총 수량
  const [roomMaxPeople, setRoomMaxPeople] = useState(0);
  const [autoRoomType, setAutoRoomType] = useState('');

  //예약마감된 일자
  const [excludedDates, setExcludedDates] = useState([]);

  
  // watch로 필드 값 추적
  const formValues = watch(); // watch로 전체 값 추적

  // watch로 추적된 값이 바뀔 때마다 상태 업데이트
  useEffect(() => {
    setTableType(formValues.tableType);
    setReservationDate(formValues.reservationDate);
    setPeopleCount(formValues.peopleCount);
  }, [formValues]);


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
          remainingHallPeople: 0 // 남아있는 홀의 총 인원 수
        };
      }
  
      // 예약된 방 추가, undefined 값 제외
      if (roomType && roomType !== "미지정") {
        result[formattedDate].bookedRooms.push(roomType);

        
      }

       // 홀 예약인 경우 테이블 수 계산 (1개 테이블은 4명 수용)
      if (tableType === "홀") {
        const tablesNeeded = Math.ceil(peopleCount / 4); // 필요한 테이블 수 계산
        
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

  const data = reservations;

  const groupByDateWithCounts = (data) => {
    const remainingRoomCapacity = calculateRemainingRoomCapacity(reservations, roomTypes);
    // console.log('roomTypes-> ' + JSON.stringify(roomTypes, null, 2));
    // console.log('remainingRoomCapacity-> ' + JSON.stringify(remainingRoomCapacity, null, 2));
    // alert('remainingRoomCapacity === 0-> '+  JSON.stringify(remainingRoomCapacity, null, 2));
    

    // 먼저 예약 데이터를 집계
    // 예약 데이터를 집계
    const result = data.reduce((result, reservation) => {
      const { date} = reservation;
      const formattedDate = new Date(date).toISOString().split("T")[0]; // 날짜를 YYYY-MM-DD 형식으로 변환

      // 날짜 키가 없으면 초기화
      if (!result[formattedDate]) {
          result[formattedDate] = {
              홀: { remaining: 0, remainingPeople: 0 }, // 남은 예약 수량과 예약된 수량 초기화
              룸: { remaining: 0, totalRemainingRooms: 0, maxRoomPeople: 0, minRoomPeople: 0 }, // 남은 예약 수량과 예약된 수량 초기화
          };
      }

      // 해당 날짜의 remainingRoomCapacity 데이터가 있는 경우, 값을 업데이트
      if (remainingRoomCapacity[formattedDate]) {
          const remainingData = remainingRoomCapacity[formattedDate];
          
          // 홀 테이블 업데이트
          if (remainingData.remainingTables !== undefined) {
              result[formattedDate].홀.remaining = remainingData.remainingTables; // 남은 테이블 수
          }
          if (remainingData.remainingHallPeople !== undefined) {
              result[formattedDate].홀.remainingPeople = remainingData.remainingHallPeople; // 남은 테이블 수용 인원
          }

          // 룸 업데이트
          if (remainingData.totalRemainingRooms !== undefined) {
              result[formattedDate].룸.remaining = remainingData.totalRemainingRooms; // 남은 룸 수
          }
          if (remainingData.minRoomPeople !== undefined) {
              result[formattedDate].룸.minRoomPeople = remainingData.minRoomPeople; // 최소 수용 인원
          }
          if (remainingData.maxRoomPeople !== undefined) {
              result[formattedDate].룸.maxRoomPeople = remainingData.maxRoomPeople; // 최대 수용 인원
          }
      }

      return result;
  }, {});

    //console.log('result-> ' + JSON.stringify(result, null, 2));
    return result;
  };


  // //예약마감된 날짜로 만들기
  useEffect(() => {
    // 결과 생성
    const result = groupByDateWithCounts(data);

    //룸 총 수량
    dispatch(fetchRoomTypes());

    //홀 총 수량
    dispatch(fetchHallTypes());


    // 객체를 배열 형식으로 변환 (옵션)
    const formattedResult = Object.entries(result).map(([date, data]) => ({
      date,
      ...data,
    }));
    //console.log('formattedResult-> ' + JSON.stringify(formattedResult, null, 2));
  
    // 날짜를 new Date() 형식으로 변환
    const newExcludedDates = formattedResult.map((item) => {
      const { date, 홀, 룸 } = item;  // 홀과 룸을 분리
  
      // tableType에 맞는 데이터만 필터링
      let filteredDate = null;
  
      // tableType에 따라서 분기 처리
      if (tableType === "홀") {
        if (홀.remaining <= 0 || 홀.remainingPeople < peopleCount) {
          filteredDate = date;  // 조건에 맞으면 해당 일자를 제외
        }
      } else if (tableType === "룸") {
        if (룸.remaining <= 0 || 룸.remainingPeople < peopleCount) {
          filteredDate = date;  // 조건에 맞으면 해당 일자를 제외
        }
      }
      // 만약 filteredDate가 설정되었으면, 그 날짜를 new Date() 형식으로 변환
      if (filteredDate) {
        let newDate = new Date(filteredDate);

        // Date 객체로 변환된 date를 'new Date("yyyy-mm-dd")' 형식으로 변환
        return new Date(`${newDate.toISOString().split("T")[0]}`);
      }
  
      return null;  // 조건에 맞지 않으면 null을 반환하여 제외
    }).filter((date) => date !== null);  // null을 제외한 날짜만 포함
  
    // 상태 업데이트
    setExcludedDates(newExcludedDates);
    //console.log('excludedDates-> ' + excludedDates);

    
  }, [data, peopleCount, tableType, reservationDate, dispatch]); 

  useEffect(() => {
    // 테이블 타입이 변경될 때 상태 초기화
    setValue('peopleCount', ''); // 인원 수 초기화
    setValue('reservationDate', null); // 예약 날짜 초기화
    setValue('reservationTime', ''); // 예약 시간 초기화
    setValue('menu', ''); // 메뉴 초기화
  }, [tableType, setValue]);

  useEffect(() => {
    // 테이블 타입이 변경될 때 상태 초기화
    setValue('reservationDate', null); // 예약 날짜 초기화
    setValue('reservationTime', ''); // 예약 시간 초기화
    setValue('menu', ''); // 메뉴 초기화
  }, [peopleCount, setValue]);

  const assignAutoRoomType = (reservationDate, peopleCount) => {
    // reservationDate를 한국 표준시(KST) 기준으로 'YYYY-MM-DD' 형식으로 변환
    const formattedDate = reservationDate.toLocaleDateString("en-CA"); // 'en-CA'는 ISO 형식 출력
  
    // remainingRoomCapacity 가져오기
    const remainingRoomCapacity = calculateRemainingRoomCapacity(reservations, roomTypes);

    //console.log('remainingRoomCapacity -> ' + JSON.stringify(remainingRoomCapacity, null, 2));
  
    // 예약 데이터와 remainingRooms 처리
    let availableRooms;
    if (!remainingRoomCapacity[formattedDate]) {
      // 일치하는 날짜가 없는 경우 모든 방을 포함
      availableRooms = roomTypes.map((room) => room.name);
    } else if ( //남은 룸이 없는 경우
      !remainingRoomCapacity[formattedDate].remainingRooms || 
      remainingRoomCapacity[formattedDate].remainingRooms.length === 0
    ) {
      // 일치하는 날짜가 있지만 remainingRooms가 없는 경우
      setAutoRoomType("미지정");
      //alert("remainingRooms가 없어서 미지정으로 설정됩니다.");
      return "미지정"; // 예약이 꽉찬상태
    } else {
      // remainingRooms가 있는 경우
      availableRooms = remainingRoomCapacity[formattedDate].remainingRooms;
    }
    //console.log('availableRooms -> ' + JSON.stringify(availableRooms, null, 2));
    //alert('availableRooms -> ' + JSON.stringify(availableRooms, null, 2));
  
    // peopleCount가 minPeople과 maxPeople 범위 내에 있는 방 필터링
    const filteredRooms = roomData
      .filter((room) => availableRooms.includes(room.name)) // 예약 가능한 방인지 확인
      .filter((room) => room.minPeople <= peopleCount && peopleCount <= room.maxPeople);


    //룸은 있지만 선택한 인원과 해당하지 않은 방들만 있는 경우
    if (filteredRooms.length === 0) {
      //alert('미지정 ');

      const filteredRooms2 = roomData
      .filter((room) => availableRooms.includes(room.name)) // 예약 가능한 방인지 확인

      const minPeople = Math.min(...filteredRooms2.map((room) => room.minPeople));
      const maxPeople = Math.max(...filteredRooms2.map((room) => room.maxPeople));

      // 결과 객체 생성
      const result = {
        minPeople,
        maxPeople,
        peopleCount,
      };

      //alert("Result Object:" + JSON.stringify(result, null, 2));

      return result;
    }

    //console.log('filteredRooms -> ' + JSON.stringify(filteredRooms, null, 2));
  
    // maxPeople 값이 가장 작은 방 선택
    const optimalRoom = filteredRooms.reduce((prev, curr) =>
      curr.maxPeople < prev.maxPeople ? curr : prev
    );
  
    //alert('optimalRoom.name-> ' + optimalRoom.name);
  
    setAutoRoomType(optimalRoom.name);
    return optimalRoom.name; // 상태 대신 값 반환
  };
 
  const onSubmit = ({ affiliation, rank, name, contact1, contact2, contact3, tableType, peopleCount, menu, reservationDate, reservationTime }) => {
    
    const fullContact = `${contact1}-${contact2}-${contact3}`;

    let autoRoomTypeValue = "";
    if (tableType === "룸") {
      //alert('tableType-> ' + tableType);
      autoRoomTypeValue = assignAutoRoomType(reservationDate, peopleCount);
    }

    // 객체인지 확인(객체이면 룸은 남아있지만 선택한 인원과 남아있는 룸의 최소 최대 인원과 일치하지 않은 상황)
    // 팝업창으로 "현재 룸은 최대 몇명, 최소 몇명 예약인 가능한 상태이다" 라고 알려줘야 함
    if (autoRoomTypeValue !== null && typeof autoRoomTypeValue === "object") {
        // autoRoomTypeValue가 객체일 경우
   // console.log('autoRoomTypeValue는 객체입니다:', autoRoomTypeValue);

    const { minPeople, maxPeople, peopleCount } = autoRoomTypeValue;

    // 팝업 메시지 생성
    const message = `현재 룸은 최소 ${minPeople}명, 최대 ${maxPeople}명 예약이 가능한 상태입니다.\n 현재 예약 인원은 ${peopleCount}명입니다.
                    \n 인원 수를 다시 선택해주세요`;

    // 팝업창 표시 (디자인에 맞게 스타일을 설정)
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#fff';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '9999';
    popup.style.textAlign = 'center';

    // 팝업 메시지 설정
    const messageElement = document.createElement('p');
    messageElement.innerText = message;
    messageElement.style.fontSize = '16px';
    messageElement.style.marginBottom = '20px';

    // 팝업 닫기 버튼
    const closeButton = document.createElement('button');
    closeButton.innerText = '확인';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#007BFF';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16px';

    // 팝업 닫기 기능 (확인 버튼 클릭 시 인원 수 초기화)
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popup); // 팝업 제거
        setValue('peopleCount', ''); // 인원 수 초기화
    });

    // 팝업에 메시지와 버튼 추가
    popup.appendChild(messageElement);
    popup.appendChild(closeButton);

    // 팝업을 body에 추가
    document.body.appendChild(popup);

    // 팝업이 뜬 상태에서 이후 코드 실행을 막기 위해 리턴
    return; // 팝업이 표시된 후, 저장 로직은 실행되지 않음
  }


  // 예약일자를 'yyyy-MM-dd' 형식으로 변환
  let formattedDate = '';
  if (reservationDate) {
    const newDate = new Date(reservationDate);
    newDate.setDate(newDate.getDate() + 1); // +1일을 추가
    formattedDate = newDate.toISOString().split('T')[0]; // 'yyyy-MM-dd' 형식으로 변환
  }

    // menu가 문자열인 경우, 쉼표(,)를 기준으로 나누어 배열로 변환
    let processedMenu = [];
    if (typeof menu === 'string') {
      processedMenu = menu.split(',').map(item => item.trim()); // 쉼표로 나누고 공백 제거
    } else if (Array.isArray(menu)) {
      processedMenu = menu; // 이미 배열이라면 그대로 사용
    }


  let body = {
    affiliation,
    rank,
    name,
    contact: fullContact,
    tableType,
    peopleCount,
    menu: processedMenu, // 배열로 변환된 메뉴
    date: formattedDate,
    time: reservationTime,
    status: '예약',
    roomType: autoRoomTypeValue
    
  };

  //alert('autoRoomType2-> ' + autoRoomType);

  dispatch(createReservation(body))
    .then(() => {
      reset({
        affiliation: '',
        rank: '',
        name: '',
        contact1: '',
        contact2: '',
        contact3: '',
        tableType: '',
        peopleCount: '',
        menu: [],
        reservationDate: null,  // 날짜 필드는 null로 리셋
        reservationTime: ''
      });

      // 성공적으로 생성 후 navigate 호출
      navigate('/reservationList', {
        state: { searchName: name, searchContact: fullContact }
      });
    })
    .catch((error) => {
      toast.error('예약 실패. 다시 시도해 주세요.');
    });
  };


  
  const handleMenuClick = (menuItem, e) => {
    e.preventDefault(); // 폼 제출을 막음
  
    const currentMenu = watchMenu.includes(menuItem)
      ? watchMenu.filter(item => item !== menuItem) // 이미 선택된 항목은 제거
      : [...watchMenu, menuItem]; // 선택되지 않은 항목은 추가
  
    setValue("menu", currentMenu); // "menu" 필드 값 업데이트
  
    trigger('menu'); // 유효성 검사 트리거
  };
  
  return (
    <FormContainer>
      <Title>예약하기</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label>소속:</Label>
        <Input {...register('affiliation', { required: '소속을 입력해주세요' })} placeholder="Ex: 52여단" />
        {errors.affiliation && <ErrorMessage>{errors.affiliation.message}</ErrorMessage>}

        <Label>계급:</Label>
        <Input {...register('rank', { required: '계급을 입력해주세요' })} placeholder="Ex: 하사" />
        {errors.rank && <ErrorMessage>{errors.rank.message}</ErrorMessage>}

        <Label>성명:</Label>
        <Input {...register('name', { required: '성명을 입력해주세요' })} placeholder="Ex: 홍길동" />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

        <Label>연락처:</Label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <SmallInput {...register('contact1', { required: '연락처를 입력해주세요', pattern: { value: /^\d{3}$/, message: '숫자 3개를 입력해주세요' } })} maxLength="3" placeholder="010" />
          <SmallInput {...register('contact2', { required: '연락처를 입력해주세요', pattern: { value: /^\d{4}$/, message: '숫자 4개를 입력해주세요' } })} maxLength="4" placeholder="1234" />
          <SmallInput {...register('contact3', { required: '연락처를 입력해주세요', pattern: { value: /^\d{4}$/, message: '숫자 4개를 입력해주세요' } })} maxLength="4" placeholder="5678" />
        </div>
        {(errors.contact1 || errors.contact2 || errors.contact3) && (
          <ErrorMessage>
            {errors.contact1?.message || errors.contact2?.message || errors.contact3?.message || '연락처를 모두 입력해주세요.'}
          </ErrorMessage>
        )}

        <Label>테이블 선택:</Label>
        <TableButtonGroup>
          <TableButton
            type="button"
            selected={watchTableType === "홀"}
            onClick={() => {
              setValue("tableType", "홀");
              trigger('tableType');  // 유효성 검사 트리거
            }}
            {...register('tableType', { required: '테이블을 선택해주세요' })}
          >
            홀
          </TableButton>
          <TableButton
            type="button"
            selected={watchTableType === "룸"}
            onClick={() => {
              setValue("tableType", "룸");
              trigger('tableType');  // 유효성 검사 트리거
            }}
            {...register('tableType', { required: '테이블을 선택해주세요' })}
          >
            룸
          </TableButton>
        </TableButtonGroup>
        {errors.tableType && <ErrorMessage>{errors.tableType.message}</ErrorMessage>}

        <Label>인원 수:</Label>
        <Select
          {...register('peopleCount', { 
            required: '인원 수를 선택해주세요',
          })}
          disabled={!watch("tableType")} // 테이블을 선택하기 전에는 비활성화
        >
          <option value="">선택...</option>
          {watch("tableType") === "홀" &&
            [...Array(hallLimit * 4)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}명
              </option>
            ))
          }
          {watch("tableType") === "룸" &&
            [...Array(roomMaxPeople)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}명
              </option>
            ))
          }
        </Select>
        {errors.peopleCount && <ErrorMessage>{errors.peopleCount.message}</ErrorMessage>}

        <Label>메뉴:</Label>
        <MenuButtonGroup>
          {["돼지고기", "소고기", "회"].map((menuItem) => (
            <MenuButton
              key={menuItem}
              selected={watchMenu.includes(menuItem)} // Check if the menu item is selected
              onClick={(e) => handleMenuClick(menuItem, e)} // Handle click to toggle selection
              {...register('menu', { required: '메뉴를 선택해주세요' })} // register 사용
            >
              {menuItem}
            </MenuButton>
          ))}
        </MenuButtonGroup>
        {errors.menu && <ErrorMessage>{errors.menu.message}</ErrorMessage>}

        <Label>예약일자:</Label>
        <Controller
          name="reservationDate"
          control={control}
          defaultValue={null}
          rules={{
            required: '예약일자를 선택해주세요',
          }}
          
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value}
              onChange={(date) => {
                field.onChange(date); // 상태 업데이트
                handleDateChange(date); // 추가 처리
              }}
              disabled={!watch("tableType") || !watch("peopleCount")} // 테이블과 인원 선택 여부에 따라 활성화 제어
              minDate={new Date(today)}
              dateFormat="yyyy-MM-dd"
              placeholderText="날짜 선택"
              customInput={<CustomDatePicker />}
              excludeDates={excludedDates}
              locale={ko}
              
            />
          )}
        />
        {errors.reservationDate && <ErrorMessage>{errors.reservationDate.message}</ErrorMessage>}


        <Label>예약시간:</Label>
        <Select {...register('reservationTime', { required: '예약시간을 선택해주세요' })}>
          <option value="">-- 선택하세요 --</option>
          {generateTimeOptions().map((time, index) => (
            <option key={index} value={time}>{time}</option>
          ))}
        </Select>
        {errors.reservationTime && <ErrorMessage>{errors.reservationTime.message}</ErrorMessage>}

        <Button type="submit">예약하기</Button>
      </form>
    </FormContainer>
  );
};

export default ReservationForm;
