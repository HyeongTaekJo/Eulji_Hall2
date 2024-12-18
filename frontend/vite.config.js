import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    // port: 80,      // 원하는 포트로 변경

    //프록시는 처리하지 않는 것이 좋다.
    //어차피 cors로 잡아주기 때문에 또 할필요 없고 오류가 계속 발생한다.
    proxy: {
     '/api': {  // 모든 요청을 백엔드 서버로 프록시
        target: 'http://localhost:5000', // 백엔드 서버 주소
        changeOrigin: true,  // 호스트 헤더 변경
        rewrite: (path) => path,  // 경로 수정 없이 그대로 전달
        //rewrite: (path) => path.replace(/^\/+/, ''),  // 요청 경로에서 앞의 '/' 제거
        //secure: false, // https 연결에서 인증서를 무시하도록 설정
      },
    }
  }
});