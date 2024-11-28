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

    proxy: {
      '': { // 프론트엔드에서 /api 요청을 백엔드로 프록시
        target: 'http://localhost:5000', // 백엔드 서버 주소
        //target: 'http://127.0.0.1:5000', 
        changeOrigin: true,  // 호스트 헤더 변경
        rewrite: (path) => path,  // 경로 수정 없이 그대로 전달
      },
    }
  }
});