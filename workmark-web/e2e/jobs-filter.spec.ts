import { test, expect, Page } from '@playwright/test';

const openFilterDrawerIfMobile = async (page: Page) => {
  const filterBtn = page.getByRole('button', { name: /Filter Opportunities/i });
  if (await filterBtn.isVisible()) {
    await filterBtn.click();
    await page.waitForTimeout(400);
  }
};

const applyMobileDrawerIfOpen = async (page: Page) => {
  const applyBtn = page.getByRole('button', { name: /Apply Filters/i });
  if (await applyBtn.isVisible()) {
    await applyBtn.click();
    await page.waitForTimeout(400);
  }
};

// Helper to get element inside either mobile drawer (fixed container) or desktop sidebar (aside)
const getFilterContainer = (page: Page) => {
  return page.locator('.fixed.inset-0:visible').or(page.locator('aside:visible'));
};

test.describe('Workmark Intelligent Job Filters & Discovery', () => {
  test('1. Homepage loads and navigates to Jobs page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Workmark/i);
    await expect(page.getByRole('heading', { name: /Find where you belong/i })).toBeVisible();

    // Click Browse Opportunities
    await page.getByRole('button', { name: /Browse Opportunities/i }).click();
    await expect(page).toHaveURL(/\/jobs/);
  });

  test('2. Jobs page default country and discovery mode toggle', async ({ page }) => {
    await page.goto('/jobs');
    await expect(page.getByRole('heading', { name: /Find Opportunities That Fit You/i })).toBeVisible();

    // Verify Discovery Mode badge is present
    const discoveryBadge = page.locator('text=Jobs in India').or(page.locator('text=Jobs for You'));
    await expect(discoveryBadge.first()).toBeVisible();

    // Toggle to Worldwide
    const worldwideBtn = page.getByRole('button', { name: /Explore Worldwide/i });
    if (await worldwideBtn.isVisible()) {
      await worldwideBtn.click();
      await expect(page).toHaveURL(/country=all/);
    }
  });

  test('3. Work Mode filter propagation and URL sync', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    await openFilterDrawerIfMobile(page);

    // Target the specific Remote work mode pill inside filter container
    const filterArea = getFilterContainer(page);
    const remoteBtn = filterArea.locator('button:has-text("Remote")').first();
    await remoteBtn.click();

    await applyMobileDrawerIfOpen(page);

    // Verify URL updated with workMode=remote
    await expect(page).toHaveURL(/workMode=remote/);

    // Verify active filter chip appears
    await expect(page.locator('text=Mode: remote').first()).toBeVisible();
  });

  test('4. City / Location search and suggestion filter', async ({ page }) => {
    await page.goto('/jobs?country=in');
    await page.waitForLoadState('networkidle');

    await openFilterDrawerIfMobile(page);

    // Target city input inside filter container
    const filterArea = getFilterContainer(page);
    const cityInput = filterArea.locator('input[placeholder*="Bangalore"]').first();
    await cityInput.fill('Bangalore');

    await applyMobileDrawerIfOpen(page);

    // Verify URL sync
    await expect(page).toHaveURL(/city=Bangalore/);
    await expect(page.locator('text=Location: Bangalore').first()).toBeVisible();
  });

  test('5. Category filter propagation', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    await openFilterDrawerIfMobile(page);

    // Target Engineering category inside filter container
    const filterArea = getFilterContainer(page);
    const engineeringBtn = filterArea.locator('button:has-text("Engineering")').first();
    await engineeringBtn.click();

    await applyMobileDrawerIfOpen(page);

    // Verify URL sync
    await expect(page).toHaveURL(/category=Engineering/);
    await expect(page.locator('text=Category: Engineering').first()).toBeVisible();
  });

  test('6. Filter combination (AND logic) and URL persistence on refresh', async ({ page }) => {
    // Navigate with multiple combined filters
    await page.goto('/jobs?country=in&category=Engineering&workMode=remote');
    await page.waitForLoadState('networkidle');

    // Verify active filter chips for both
    await expect(page.locator('text=Category: Engineering').first()).toBeVisible();
    await expect(page.locator('text=Mode: remote').first()).toBeVisible();

    // Reload the page to test persistence
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Category: Engineering').first()).toBeVisible();
    await expect(page.locator('text=Mode: remote').first()).toBeVisible();
    await expect(page).toHaveURL(/category=Engineering/);
    await expect(page).toHaveURL(/workMode=remote/);
  });

  test('7. Reset all filters clears active state', async ({ page }) => {
    await page.goto('/jobs?category=Engineering&workMode=remote');
    await page.waitForLoadState('networkidle');

    // Click Clear all chips or Reset All
    const clearBtn = page.locator('button:visible:has-text("Clear all")').or(page.locator('button:visible:has-text("Reset All")'));
    await clearBtn.first().click();

    // Verify filter chips disappear
    await expect(page.locator('text=Category: Engineering')).toHaveCount(0);
    await expect(page.locator('text=Mode: remote')).toHaveCount(0);
  });

  test('8. Manual location input: custom city typing, URL sync and chip removal', async ({ page }) => {
    await page.goto('/jobs?country=in');
    await page.waitForLoadState('networkidle');

    await openFilterDrawerIfMobile(page);

    const filterArea = getFilterContainer(page);
    const cityInput = filterArea.locator('input[placeholder*="Bangalore"]').first();
    
    // Type manual custom location
    await cityInput.fill('Kolkata');
    await applyMobileDrawerIfOpen(page);

    await expect(page).toHaveURL(/city=Kolkata/);
    await expect(page.locator('text=Location: Kolkata').first()).toBeVisible();

    // Verify persistence after page reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/city=Kolkata/);
    await expect(page.locator('text=Location: Kolkata').first()).toBeVisible();

    // Remove location filter chip
    const removeLocationChip = page.locator('.inline-flex:has-text("Location: Kolkata") button');
    if (await removeLocationChip.isVisible()) {
      await removeLocationChip.click();
      await expect(page).not.toHaveURL(/city=Kolkata/);
      await expect(page.locator('text=Location: Kolkata')).toHaveCount(0);
    }
  });

  test('9. Salary range and disclosed filters URL sync', async ({ page }) => {
    await page.goto('/jobs');
    await page.waitForLoadState('networkidle');

    await openFilterDrawerIfMobile(page);

    const filterArea = getFilterContainer(page);
    const minSalaryInput = filterArea.locator('input[placeholder="Min amount"]').first();
    await minSalaryInput.fill('50000');

    await applyMobileDrawerIfOpen(page);

    await expect(page).toHaveURL(/salaryMin=50000/);
    await expect(page.locator('text=Salary: $50000').first()).toBeVisible();
  });

  test('10. Employment Type and Source filter verification', async ({ page }) => {
    await page.goto('/jobs?employmentType=full-time&source=workmark');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Type: full-time').first()).toBeVisible();
    await expect(page.locator('text=Source: Workmark').first()).toBeVisible();
    await expect(page).toHaveURL(/employmentType=full-time/);
    await expect(page).toHaveURL(/source=workmark/);
  });
});
