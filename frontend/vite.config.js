import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',  // 프론트엔드에서 /api 요청을 백엔드로 프록시합니다.
    }
  }
});
