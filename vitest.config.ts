import swc from 'unplugin-swc';
import { defineConfig, configDefaults } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ["**/*.test.ts", "**/*.e2e-test.ts"],
    // Tests e2e désactivés : ils bootent le vrai AppModule et écrivent dans la
    // base Supabase. Retirer cette ligne pour les réactiver (nécessite
    // DATABASE_URL, DIRECT_URL, STAGE, JWT_SECRET + une base seedée).
    exclude: [...configDefaults.exclude, "**/*.e2e.test.ts"],
    globals: true,
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@adapters": path.resolve(__dirname, "src/adapters"),
      "@domain": path.resolve(__dirname, "src/domain"),
      "@infrastructure": path.resolve(__dirname, "src/infrastructure"),
      "@usecases": path.resolve(__dirname, "src/usecases"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@tests": path.resolve(__dirname, "tests"),
    },
    root: "./",
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});