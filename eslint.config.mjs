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
              group: ["../", "../../", "../../../", "../../../../"],
              message:
                "Use the @/ alias for imports that cross directory boundaries.",
            },
          ],
        },
      ],
      // FE-218: catch dead variables/imports/types at lint time instead of
      // letting them accumulate silently (previously "warn" via eslint-config-next).
      "@typescript-eslint/no-unused-vars": "error",
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
