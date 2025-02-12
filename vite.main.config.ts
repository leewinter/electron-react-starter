import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['mssql', 'sql-formatter'], // Ensures `mssql` is externalized
    },
  },
});
