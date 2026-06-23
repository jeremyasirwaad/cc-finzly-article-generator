/**
 * TEMPLATE — Playwright parity spec for a migrated page. Generated per page from the page spec.
 * Doubles as the regression test kept in CI after cutover. Reads thresholds from
 * .migration/config/parity-thresholds.yaml (load + pass into your harness).
 *
 * Visual: screenshot diff vs the baseline (golden master) per viewport.
 * Behavior: replay each interaction; assert UI outcome + network parity.
 */
import { test, expect } from '@playwright/test';

const PAGE_ID = '__page_id__';
const LEGACY = process.env.LEGACY_URL ?? 'http://localhost:1841';
const ANGULAR = process.env.ANGULAR_URL ?? 'http://localhost:4200';
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 720 },
];

async function settle(page: import('@playwright/test').Page) {
  await page.evaluate(() => (document as any).fonts?.ready);
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
  await page.waitForLoadState('networkidle');
}

test.describe(`parity: ${PAGE_ID}`, () => {
  for (const vp of VIEWPORTS) {
    test(`visual @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto(`${ANGULAR}/__angular_route__`);
      await settle(page);
      // Compares against the committed baseline snapshot (capture it from LEGACY once).
      await expect(page).toHaveScreenshot(`${PAGE_ID}-${vp.name}.png`, {
        maxDiffPixelRatio: 0.001,       // == parity-thresholds.visual.max_diff_ratio
        // mask: [page.locator('.timestamp'), page.locator('[data-dynamic]')],
      });
    });
  }

  test('behavior: interactions + network parity', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (r) => requests.push(`${r.method()} ${new URL(r.url()).pathname}`));
    await page.goto(`${ANGULAR}/__angular_route__`);
    await settle(page);

    // --- replay each step from the page spec; assert outcome + expected requests ---
    // await page.getByRole('button', { name: 'Add' }).click();
    // await expect(page.getByRole('dialog')).toBeVisible();
    // await page.getByLabel('First Name').fill('Ada');
    // await page.getByRole('button', { name: 'Save' }).click();
    // expect(requests).toContain('POST /api/users');
  });
});
