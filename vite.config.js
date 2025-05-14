import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                spain: resolve(__dirname, 'index.html'),
                ingles: resolve(__dirname, 'en.html'),
            },
        },
    },
})