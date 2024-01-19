import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT || '8800'}`,
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
  },
  plugins: [react()],
})
