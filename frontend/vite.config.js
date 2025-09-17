import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
const devPort = Number(process.env.VITE_PORT || process.env.PORT || 5173);

export default defineConfig({
	server: {
		port: devPort,
		proxy: {
			'/api/': {
				target: 'http://localhost:8000',
				changeOrigin: true
			}
		},
		host: true,
		strictPort: false
	},
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`
			}
		}
	}
});
