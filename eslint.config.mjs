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
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
