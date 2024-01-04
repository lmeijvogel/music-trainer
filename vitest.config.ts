import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    test: {
        include: ['**/__tests__/*.test.{tsx,ts}'],
        globals: true
    },
})
