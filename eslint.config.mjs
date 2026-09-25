// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // A single "../" (one directory up, e.g. "../Button") is fine.
              // Anything crossing two or more directory levels must use the
              // "@/" alias instead (e.g. "@/lib/auth" not "../../lib/auth").
              group: [
                "../../*",
                "../../../*",
                "../../../../*",
                "../../../../../*",
              ],
              message:
                "Use the @/ alias for imports that cross two or more directory levels (e.g. `@/lib/auth` instead of `../../lib/auth`).",
            },
          ],
        },
      ],
      // FE-218: catch dead variables/imports/types at lint time instead of
      // letting them accumulate silently (previously "warn" via eslint-config-next).
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  // This must stay a standalone `globalIgnores` entry. A bare `ignores` key
  // inside a config object is a per-config exclude list, not a global one, so
  // converting it would silently start linting .next/** and coverage/** and
  // produce thousands of errors from generated code. It is also safe to keep
  // after the Storybook spread below: globalIgnores is position-independent.
  //
  // Carries over every entry that used to live in .eslintignore, which ESLint 9
  // flat config never reads -- it only warns about the file, so edits to it
  // had no effect. The file is deleted rather than left to disagree.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    "next-env.d.ts",
    // Previously only in the (dead) .eslintignore:
    ".DS_Store",
    // Build and coverage output that nothing else covers:
    "storybook-static/**",
    "out-vercel/**",
    "playwright-report/**",
    "test-results/**",
    "blob-report/**",
  ]),
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
