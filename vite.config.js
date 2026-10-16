import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The HVAC site is archived under /hvac/. The dental landing page in
// site-root/ is the home page and is copied into dist/ after the build.
export default defineConfig({
  base: '/hvac/',
  plugins: [react()],
  build: { outDir: 'dist/hvac' },
});
