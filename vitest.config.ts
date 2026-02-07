import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["registry/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}", "lib/**/*.ts"],
      exclude: ["**/*.d.ts", "**/types/**"]
    },
    projects: [
      // Unit tests project
      {
        extends: true,
        test: {
          name: 'unit',
          environment: "jsdom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
        }
      },
      // Storybook browser tests project
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./")
    }
  }
});