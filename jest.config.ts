import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  // Smoke tests require a live server — run separately via jest.smoke.config.ts
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/__tests__/smoke/"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          jsx: "react",
        },
      },
    ],
  },
};

export default config;
