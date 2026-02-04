
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  plugins: [
    vue(),
    viteCompression({
      filter: /\.(js|mjs|css)$/i,
    }),
  ],
  build: {
    rollupOptions: {
      transpile: ["vue3-apexcharts"]
    },
  },
});
