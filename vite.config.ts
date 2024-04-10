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
  build: {
    copyPublicDir: false,
    target: 'esnext',
    sourcemap: true,
    minify: 'terser',
    lib: {
      entry: [
        'src/api/index.ts',
        'src/fn/index.ts',
        'src/form/index.ts',
        'src/i18n/index.ts',
        'src/images/index.ts',
        'src/parser/index.ts',
        'src/plugins/index.ts',
        'src/site/index.ts',
      ],
      name: 'AflevereApiVue',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      plugins: [
        // @ts-ignore: Unreachable code error
        terser({ format: { comments: false }})
      ],
      external: ['vue'], // external deps, don't bundle in library
      input: {
        'api/lib': './src/api/index.ts',
        'fn/lib': './src/fn/index.ts',
        'form/lib': './src/form/index.ts',
        'i18n/lib': './src/i18n/index.ts',
        'images/lib': './src/images/index.ts',
        'parser/lib': './src/parser/index.ts',
        'plugins/lib': './src/plugins/index.ts',
        'site/lib': './src/site/index.ts',
      },
      output: {
        manualChunks(id: any) {
		      if(id.includes('/api')) { return 'api'; }
		      if(id.includes('/fn')) { return 'fn'; }
		      if(id.includes('/form')) { return 'form'; }
		      if(id.includes('/i18n')) { return 'i18n'; }
		      if(id.includes('/images')) { return 'images'; }
		      if(id.includes('/parser')) { return 'parser'; }
		      if(id.includes('/plugins')) { return 'plugins'; }
		      if(id.includes('/site')) { return 'site'; }
	      },
        globals: {
          vue: 'Vue'
        },
      }
    }
  }
})
