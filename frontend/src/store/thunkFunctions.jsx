import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

//createAsyncThunk로 만든것은 알아서 extraReducers를 찾아서 결과를 반환한다.

//회원가입
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (body,thunkAPI) => {
        try {
            const response = await axiosInstance.post(
                `/users/register`,
                body
            )
            return response.data;
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

// 비밀번호 찾기
export const findPassword = createAsyncThunk(
    'user/findPasswordUser',
    async ({ searchId, searchName }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/users/findPassword', { 
                searchId,
                searchName, 
            });  
            if (response.status === 200) {
                return response.data;  // 서버로부터 받은 예약 리스트 데이터
            } else {
                throw new Error('비밀번호를 확인하는데 실패함.');
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 비밀번호 변경
export const changePassword = createAsyncThunk(
    'user/changePasswordUser',
    async ({ password,id }, thunkAPI) => {
        try {
            const response = await axiosInstance.post('/users/changePassword', { 
                password,
                id
            });  
            if (response.status === 200) {
                return response.data;  // 서버로부터 받은 예약 리스트 데이터
            } else {
                throw new Error('비밀번호를 변경하는데 실패함.');
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

//페이지를 움길때 마다 작동(App.jsx에서 호출)
//권한조회
export const authUser = createAsyncThunk( 
    "user/authUser",
    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.get(
                `/users/auth`,
            )
            return response.data; //action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

//로그인
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (body,thunkAPI) => {
        
        try {
            const response = await axiosInstance.post(
                `/api/users/login`,
                body //email, password가 있음
            )
            return response.data; //action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);

//로그아웃
export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (body, thunkAPI) => {
        try {
            const response = await axiosInstance.post(
                `/users/logout`,
            )
            return response.data; //action.payload
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err.response.data || err.message);
        }
    }
);
