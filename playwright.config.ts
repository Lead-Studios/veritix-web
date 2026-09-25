import {
  defineConfig,
  devices,
  type ReporterDescription,
} from '@playwright/test';

/**
 * End-to-end configuration.
 *
 * The suite drives a real server that Playwright starts itself, because the
 * things worth smoke-testing live in places a component test cannot reach: the
 * route guard in `src/proxy.ts`, the public layout's landmarks, and the footer
 * form. No request is stubbed.
 *
 * ## Why the default server is `next dev`
 *
 * `next build` does not currently succeed on `main`: `ui/sheet.tsx` and
 * `ui/pagination.tsx` each declare their component twice, and
 * `my-tickets/page.tsx` has two default exports. A production-build web server
 * would therefore fail before the first test ran, and the suite would go red
 * for a reason that has nothing to do with end-to-end coverage.
 *
 * `next dev` compiles routes on demand, so the landing page is served even
 * while `ui/sheet.tsx` is broken — which is precisely the failure mode a smoke
 * suite exists to catch. Once the build is green, run against the real artifact
 * with:
 *
 * ```sh
 * E2E_WEB_SERVER=build npx playwright test
 * ```
 *
 * and make that the CI default in the same commit that fixes the build.
 */

const PORT = Number(process.env.E2E_PORT ?? process.env.PORT ?? 3000);

/**
 * `127.0.0.1` rather than `localhost`. On Windows, `localhost` resolves to
 * `::1` first, Next.js binds IPv4 only by default, and Playwright's
 * `webServer.url` probe then waits out its full timeout against a server it
 * cannot reach.
 */
const baseURL = `http://127.0.0.1:${PORT}`;

const useProductionBuild = process.env.E2E_WEB_SERVER === 'build';

/**
 * The `github` reporter turns a failed assertion into an annotation on the pull
 * request, which is the only version of the failure most reviewers will read.
 * The HTML report is written for anyone who wants to open the trace.
 */
const reporter: ReporterDescription = process.env.CI
  ? [
      ['github'],
      ['html', { open: 'never' }],
    ]
  : 'list';

export default defineConfig({
  testDir: './e2e',
  // Only `*.spec.ts`. A shared fixture or helper dropped in `e2e/` is not a test,
  // and Playwright's default `**/*.@(spec|test).?(c|m)[jt]s?(x)` is wider than
  // this suite needs.
  testMatch: '**/*.spec.ts',
  timeout: 30_000,
  // A run that has not finished in ten minutes is stuck, not slow. Without this
  // a wedged run holds a CI runner until the six-hour default.
  globalTimeout: 10 * 60_000,
  expect: {
    timeout: 7_000,
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Two workers, not one. One serialises everything behind a single browser and
  // a single `next dev` compile; two is enough parallelism for a smoke suite
  // without turning the runner into the bottleneck.
  workers: process.env.CI ? 2 : undefined,
  reporter,

  use: {
    baseURL,
    // The trace is the only artefact that shows *where* a click actually
    // landed, which is the first thing worth having when a selector breaks.
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Without an action timeout a click on an element that never appears hangs
    // until the 30s test timeout, and the failure message says nothing useful.
    actionTimeout: 15_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: useProductionBuild ? 'npm run build && npm run start' : 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    // The first dev-server compile is slow and the web server has to be up
    // before the first test's own timeout starts, so this is generous on
    // purpose.
    timeout: 180_000,
    env: { PORT: String(PORT) },
  },
});
