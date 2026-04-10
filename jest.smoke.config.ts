import type { Config } from "jest";

/**
 * Jest config for smoke tests.
 * These run against a live server (local or Vercel preview).
 * Set BASE_URL env var to target a specific deployment.
 */
const config: Config = {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/smoke/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { tsconfig: { module: "commonjs" } },
    ],
  },
  // Smoke tests hit a real server — allow longer timeouts
  testTimeout: 15000,
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};

export default config;
