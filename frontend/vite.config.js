import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    port: 80,      // 원하는 포트로 변경
    // proxy: {
    //   '/api': 'http://140.245.65.135:5000',  // 프론트엔드에서 /api 요청을 배포된 백엔드로 프록시합니다.
    // }
    // proxy: {
    //   '/api': { // '/'가 아닌 '/'뒤에 반드시 문자열이 붙은 정규표현식
    //     target: 'http://localhost:5000', // API 서버
    //   },
    
    // },

  }
});