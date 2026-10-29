import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages 주소(https://사용자명.github.io/my-landing/)에 맞춘 base 경로
export default defineConfig({
  plugins: [react()],
  base: '/my-landing/',
})
