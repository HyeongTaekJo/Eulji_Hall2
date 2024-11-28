import axios from 'axios';

const axiosInstance = axios.create({

    baseURL: 'http://140.245.65.135:5000',

})

//로그인 인증 토큰 보내주기
axiosInstance.interceptors.request.use(function (config){ //requset라는 것은 백엔드로 보낼 때
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    return config;
}, function(error){
    return Promise.reject(error);
})

//토큰 기간이 만료되었을 경우
axiosInstance.interceptors.response.use(function (response){ //response라는 것은 백엔드에서 프론트로 올 때
   return response;
}, function(error){
    if(error.response.data === 'jwt expired'){
        window.location.reload(); //새로고침한다. 그래야지 다시 메인 페이지로 돌아가기 때문에
    }
    return Promise.reject(error);
})

//토큰 없는 요청
axiosInstance.interceptors.request.use(function (config) {
    if  (!config.url.includes('/login') && !config.url.includes('/register')) { // 공개 엔드포인트 제외
        const token = localStorage.getItem('accessToken');
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


export default axiosInstance;