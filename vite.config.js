import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// 获取当前环境变量以设置基础路径
const base =
  import.meta.env.VITE_GITHUB_REF === "refs/heads/main" ? "/Map-app/main/" : "/Map-app/onlyMap/";

export default defineConfig({
  plugins: [react()],
  base: '/shaanxi-heritage-map/', 
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})


