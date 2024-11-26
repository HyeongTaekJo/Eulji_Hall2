// reservationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createReservation, fetchReservations, updateReservation, deleteReservation,fetchReservationList, fetchRoomTypes, fetchHallTypes } from "./reservationThunks";
import { toast } from 'react-toastify';

const initialState = {
    reservations: [],
    roomTypes:[],
    hallTypes:[],
    isLoading: false,
    error: '',
};

const reservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // 예약 생성
        builder
            .addCase(createReservation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reservations.push(action.payload); // 새로운 예약 추가
                toast.info('예약을 성공했습니다.');
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // 예약 목록 조회
            .addCase(fetchReservations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reservations = action.payload; // 예약 목록 업데이트
                // toast.info('예약리스트 성공적으로 생성되었습니다.');
            })
            .addCase(fetchReservations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // 예약 수정
            .addCase(updateReservation.pending, (state) => {
                state.isLoading = true;
                
            })
            .addCase(updateReservation.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.reservations.findIndex(reservation => reservation.id === action.payload.id);
                if (index !== -1) {
                    state.reservations[index] = action.payload; // 수정된 예약으로 업데이트
                    toast.info('예약이 성공적으로 수정되었습니다.');
                }
            })
            .addCase(updateReservation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // 예약 삭제
            .addCase(deleteReservation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reservations = state.reservations.filter(reservation => reservation.id !== action.payload.id); // 예약 삭제
                toast.info('예약이 성공적으로 삭제되었습니다.');
            })
            .addCase(deleteReservation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // 이름과 연락처로 예약 목록 조회
            .addCase(fetchReservationList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchReservationList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reservations = action.payload; // 예약 목록 업데이트
            })
            .addCase(fetchReservationList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
             // 룸 타입조회
            .addCase(fetchRoomTypes.pending, (state) => {
                state.isLoading = true; // 로딩 상태 활성화
            })
            .addCase(fetchRoomTypes.fulfilled, (state, action) => {
                state.isLoading = false; // 로딩 상태 비활성화
                state.roomTypes = action.payload; // 응답에서 data 배열만 저장
                //console.log("state.error = " +JSON.stringify(state.roomTypes, null, 2));
            })
            .addCase(fetchRoomTypes.rejected, (state, action) => {
                state.isLoading = false; // 로딩 상태 비활성화
                state.error = action.payload; // 오류 메시지 저장
            })
            // 홀 타입조회
            .addCase(fetchHallTypes.pending, (state) => {
                state.isLoading = true; // 로딩 상태 활성화
            })
            .addCase(fetchHallTypes.fulfilled, (state, action) => {
                state.isLoading = false; // 로딩 상태 비활성화
                state.hallTypes = action.payload; // 응답에서 data 배열만 저장
                //console.log("state.error = " +JSON.stringify(state.roomTypes, null, 2));
            })
            .addCase(fetchHallTypes.rejected, (state, action) => {
                state.isLoading = false; // 로딩 상태 비활성화
                state.error = action.payload; // 오류 메시지 저장
            });
    },
});

export default reservationSlice.reducer;
