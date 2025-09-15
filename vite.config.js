import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 访问环境变量
const githubRef = process.env.VITE_GITHUB_REF;

const base = githubRef === 'refs/heads/main'
  ? '/shaanxi-heritage-map/main/'
  : '/shaanxi-heritage-map/onlyMap/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});