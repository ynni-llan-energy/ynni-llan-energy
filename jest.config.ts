import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          // Allow importing from the project tsconfig but override module to
          // CommonJS so Jest can run the files without a bundler.
          module: "commonjs",
          jsx: "react",
        },
      },
    ],
  },
  // Never run tests inside node_modules or .next
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};

export default config;
