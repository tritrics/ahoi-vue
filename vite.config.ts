import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore: Unreachable code error
import terser from '@rollup/plugin-terser'

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    host: true,
    port: 8080,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    copyPublicDir: false,
    target: 'esnext',
    //sourcemap: true,
    //minify: 'terser',
    lib: {
      entry: [
        'src/plugin/index.ts',
        'src/fn/index.ts',
        'src/form/index.ts',
        'src/lang/index.ts',
        'src/site/index.ts',
      ],
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      plugins: [
        // @ts-ignore: Unreachable code error
        terser({ format: { comments: false }})
      ],
      external: ['vue'], // external deps, don't bundle in library
      input: {
        'api': './src/plugin/index.ts',
        'fn': './src/fn/index.ts',
        'form': './src/form/index.ts',
        'lang': './src/lang/index.ts',
        'site': './src/site/index.ts',
      },
      output: {
        manualChunks(id: any) {
		      if(id.includes('/plugin')) { return 'api'; }
		      if(id.includes('/fn')) { return 'fn'; }
		      if(id.includes('/form')) { return 'form'; }
		      if(id.includes('/lang')) { return 'lang'; }
		      if(id.includes('/site')) { return 'site'; }
	      },
        globals: {
          vue: 'Vue'
        },
      }
    }
  }
})
