import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'rendering': ['react', 'react-dom', 'styled-components'],
                    'music': ['tonal', 'vexflow']
                }
            }
        }
    }
})
