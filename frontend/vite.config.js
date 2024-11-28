import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    port: 80,      // 원하는 포트로 변경
    proxy: {
      // '/common': { // '/'가 아닌 '/'뒤에 반드시 문자열이 붙은 정규표현식
      //   target: 'http://localhost:5000', // API 서버
      //   changeOrigin: true, // 호스트 헤더 변경
      //   rewrite: (path) => path, // '/api'를 제거
      // },
      //   '/login': { // '/'가 아닌 '/'뒤에 반드시 문자열이 붙은 정규표현식
      //     target: 'http://localhost:5000', // API 서버
      //     changeOrigin: true, // 호스트 헤더 변경
      //     rewrite: (path) => path, // '/api'를 제거
      //   },
      '/api': { // '/'가 아닌 '/'뒤에 반드시 문자열이 붙은 정규표현식
        target: 'http://localhost:5000', // API 서버
        changeOrigin: true, // 호스트 헤더 변경
        // rewrite: (path) =>  path.replace(/^\/api/, ''), // '/api'를 제거
        rewrite: (path) => path.replace(/^\/api/, ''), // '/api'를 제거
      },
      // '^/[^/].*': { // '/'가 아닌 '/'뒤에 반드시 문자열이 붙은 정규표현식
      //   target: 'http://localhost:5000', // API 서버
      //   changeOrigin: true, // 호스트 헤더 변경
      //   rewrite: (path) => path, // '/api'를 제거
      // },
    },

  }
});