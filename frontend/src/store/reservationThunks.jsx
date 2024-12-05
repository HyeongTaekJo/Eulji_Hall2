import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

// 예약 생성
export const createReservation = createAsyncThunk(
  "reservation/createReservation",
  async (body, thunkAPI) => {
    try {
      console.log("body: " + JSON.stringify(body, null, 2));
      const response = await axiosInstance.post(
        "/api/reservations/create",
        body
      );

      return response.data; // action.payload
    } catch (err) {
      console.error("Error creating reservation:", err);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 예약 목록 조회
export const fetchReservations = createAsyncThunk(
  "reservation/fetchReservations",
  async ({ startDate, endDate, statusFilter }, thunkAPI) => {
    //console.log(`startDate`, startDate)
    try {
      const response = await axiosInstance.get("/api/reservations", {
        params: { startDate, endDate, statusFilter }, // 필터링 파라미터 전달
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
  "reservation/updateReservation",
  async ({ id, body }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/reservations/${id}`, body);
      return response.data; // action.payload
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

// 예약 삭제
export const deleteReservation = createAsyncThunk(
  "reservation/deleteReservation",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/reservations/${id}`);
      return response.data; // action.payload
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

// 이름, 연락처, 상태로 예약 리스트를 가져오는 액션
export const fetchReservationList = createAsyncThunk(
  "reservation/fetchReservationList",
  async ({ searchName, searchContact, status }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/reservations/search", {
        searchName,
        searchContact,
        status, // 추가: 상태 필터 전달
      });
      if (response.status === 200) {
        return response.data; // 서버로부터 받은 예약 리스트 데이터
      } else {
        throw new Error("예약 데이터를 가져오는 데 실패했습니다.");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 룸 종류 조회
export const fetchRoomTypes = createAsyncThunk(
  "reservation/fetchRoomTypes",
  async (_, thunkAPI) => {
    try {
      // GET 요청을 보냄
      const response = await axiosInstance.post(
        "/api/reservations/fetchRoomTypes",
        {}
      );
      //console.log(JSON.stringify(response, null, 2));
      return response.data; // 서버에서 반환된 데이터를 Redux 상태에 저장
    } catch (err) {
      console.error("Error fetching room types:", err);
      // 오류 상태 반환
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 홀 종류 조회
export const fetchHallTypes = createAsyncThunk(
  "reservation/fetchHallTypes",
  async (_, thunkAPI) => {
    try {
      // GET 요청을 보냄
      const response = await axiosInstance.post(
        "/api/reservations/fetchHallTypes",
        {}
      );
      //console.log(JSON.stringify(response, null, 2));
      return response.data; // 서버에서 반환된 데이터를 Redux 상태에 저장
    } catch (err) {
      console.error("Error fetching hall types:", err);
      // 오류 상태 반환
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
