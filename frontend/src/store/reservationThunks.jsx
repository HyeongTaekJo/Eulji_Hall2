import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';
import axios from 'axios';

//createAsyncThunk로 만든것은 알아서 extraReducers를 찾아서 결과를 반환한다.

// const axios = require('axios');
// const qs = require('qs');
// let data = qs.stringify({
//   'apikey': 'API키를 입력합니다.',
//   'userid': '알리고 아이디를 입력합니다.',
//   'senderkey': '카카오 발신프로필 키를 입력합니다. ',
//   'tpl_code': '템플릿 코드를 입력합니다. ',
//   'sender': '발신번호를 입력합니다. ',
//   'receiver_1': '수신자번호를 입력합니다',
//   'recvname_1': '수신자명을 입력합니다',
//   'subject_1': '템플릿 제목을 입력합니다.\\n 홍길동 고객님 안녕하세요.\\n 여기서 홍길동은 #{고객명} 변수입니다. ',
//   'message_1': '템플릿 내용을 입력합니다. ',
//   'button_1': '{"button": [{"name": "채널 추가","linkType": "AC","linkTypeName": "채널 추가”}, {"name": "버튼이름","linkType": "WL","linkTypeName": "웹링크","linkPc":"https://www.홈페이지링크","linkMo" : "https://www.홈페이지링크"}]}',
//   'emtitle_1': '강조표기형 템플릿의 경우에만 입력'
// });
// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://kakaoapi.aligo.in/akv10/alimtalk/send/',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   data : data
// };
// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });




// 예약 생성
export const createReservation = createAsyncThunk(
    'reservation/createReservation',
    async (body, thunkAPI) => {
        try {
            console.log('body: ' + JSON.stringify(body, null, 2));
            const response = await axiosInstance.post('/reservations/create', body);

            if (response.data) {
                console.log('Reservation created successfully:', response.data);

                try {
                    // 템플릿 매핑 변수
                    const 고객명 = body.name;
                    const 소속 = body.affiliation;
                    const 계급 = body.rank;
                    const 연락처 = body.contact;
                    const 메뉴 = body.contact;
                    // const 메뉴 = body.menu.join(', ');
                    const 예약일자 = body.date;
                    const 예약시간 = body.time;
                    const 인원수 = body.peopleCount;
                    const 룸홀 = body.tableType;

                    const response2 = await axios.post(
                        'https://kakaoapi.aligo.in/akv10/alimtalk/send/',
                        {
                            params: {
                                apikey: 'we7znqi4ke1zh05wuc5kozrmoag2tthr',
                                userid: 'diajd1',
                                senderkey: '3db47708194aa95d46ec07dbf911ad4cd53fe115',
                                tpl_code: 'TW_2596',
                                sender: '01089035627',
                                receiver_1: 연락처,
                                recvname_1: 고객명,
                                subject_1: '을지회관 예약 안내',
                                message_1: `을지회관 예약시스템\n\n예약 완료 안내\n\n안녕하세요, ${고객명}님.\n${고객명}님의 예약이 완료되었습니다.\n\n소속: ${소속}\n계급: ${계급}\n연락처: ${연락처}\n메뉴: ${메뉴}\n예약일자: ${예약일자}\n예약시간: ${예약시간}\n인원수: ${인원수}명\n타입: ${룸홀}\n\n궁금하신 사항은 언제든지 문의해 주세요.\n감사합니다.\n--------------------------------------\n상호명: 을지회관\n위치: 강원 인제군 북면 원통로 113-3`,
                                // message_1: `을지회관 예약시스템\n\n예약 완료 안내\n\n안녕하세요, ${body.name}님.\n${body.name}님의 예약이 완료되었습니다.\n\n소속: ${body.affiliation}\n계급: ${body.rank}\n연락처: ${body.contact}\n메뉴: ${body.menu.join(', ')}\n예약일자: ${body.date}\n예약시간: ${body.time}\n인원수: ${body.peopleCount}명\n타입: ${body.tableType}\n\n궁금하신 사항은 언제든지 문의해 주세요.\n감사합니다.\n--------------------------------------\n상호명: 을지회관\n위치: 강원 인제군 북면 원통로 113-3`,
                                // failover: 'Y',
                                // fsubject_1: '을지회관 예약 안내',
                                // fmessage_1: `${고객명}님, 예약이 정상적으로 완료되었습니다. 자세한 내용은 알림톡을 확인해 주세요.`,
                                // testMode: 'N',
                            },
                        }
                    );
                    console.log('AlimTalk sent successfully:', response2.data);
                } catch (error) {
                    console.error('Error sending AlimTalk:', error.response?.data || error.message);
                }
            }

            return response.data; // action.payload
        } catch (err) {
            console.error('Error creating reservation:', err);
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);


// 예약 목록 조회
export const fetchReservations = createAsyncThunk(
    'reservation/fetchReservations',
    async ({ startDate, endDate, statusFilter }, thunkAPI) => {
        //console.log(`startDate`, startDate)
        try {
            const response = await axiosInstance.get('/reservations', {
                params: { startDate, endDate, statusFilter } // 필터링 파라미터 전달
            });
            return response.data; // 필터링된 예약 목록을 반환
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);


// 예약 수정
export const updateReservation = createAsyncThunk(
    'reservation/updateReservation',
    async ({ id, body }, thunkAPI) => {
        try {
            const response = await axiosInstance.put(`/reservations/${id}`, body);
            return response.data; // action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

// 예약 삭제
export const deleteReservation = createAsyncThunk(
    'reservation/deleteReservation',
    async (id, thunkAPI) => {
        try {
            const response = await axiosInstance.delete(`/reservations/${id}`);
            return response.data; // action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

// 이름, 연락처, 상태로 예약 리스트를 가져오는 액션
export const fetchReservationList = createAsyncThunk(
    'reservation/fetchReservationList',
    async ({ searchName, searchContact, status }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/reservations/search', { 
                searchName, 
                searchContact, 
                status // 추가: 상태 필터 전달
            });  
            if (response.status === 200) {
                return response.data;  // 서버로부터 받은 예약 리스트 데이터
            } else {
                throw new Error('예약 데이터를 가져오는 데 실패했습니다.');
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 룸 종류 조회
export const fetchRoomTypes = createAsyncThunk(
    'reservation/fetchRoomTypes',
    async (_, thunkAPI) => {
      try {
        // GET 요청을 보냄
        const response = await axiosInstance.post('/reservations/fetchRoomTypes', { 
           
        });  
        //console.log(JSON.stringify(response, null, 2)); 
        return response.data; // 서버에서 반환된 데이터를 Redux 상태에 저장
      } catch (err) {
        console.error('Error fetching room types:', err);
        // 오류 상태 반환
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  // 홀 종류 조회
export const fetchHallTypes = createAsyncThunk(
    'reservation/fetchHallTypes',
    async (_, thunkAPI) => {
      try {
        // GET 요청을 보냄
        const response = await axiosInstance.post('/reservations/fetchHallTypes', { 
           
        });  
        //console.log(JSON.stringify(response, null, 2)); 
        return response.data; // 서버에서 반환된 데이터를 Redux 상태에 저장
      } catch (err) {
        console.error('Error fetching hall types:', err);
        // 오류 상태 반환
        return thunkAPI.rejectWithValue(err.response?.data || err.message);
      }
    }
  );