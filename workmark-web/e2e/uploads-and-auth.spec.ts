import { test, expect } from '@playwright/test';

test.describe('Workmark Auth & Uploads Architecture', () => {
  test('1. Authentication pages load with validation', async ({ page }) => {
    // Register page
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /Create Your Account/i })).toBeVisible();
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();

    // Login page
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
  });

  test('2. Seeker Edit Profile upload inputs exist and accept appropriate formats', async ({ page }) => {
    // Mock user authentication session
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-test-jwt-token');
    });

    // Mock /api/auth/me and /api/profile/me
    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              _id: '64e000000000000000000001',
              name: 'Audit User',
              email: 'audit@workmark.test',
              role: 'job_seeker',
              isVerified: true,
              countryCode: 'in',
            },
          },
        }),
      });
    });

    await page.route('**/api/profile/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            profile: {
              _id: '64e000000000000000000002',
              userId: '64e000000000000000000001',
              headline: 'Full Stack Engineer',
              skills: ['TypeScript', 'React', 'Node.js'],
              experience: [],
              education: [],
              projects: [],
              socialLinks: {},
            },
          },
        }),
      });
    });

    await page.goto('/seeker/profile/edit');
    await expect(page.getByRole('heading', { name: /Edit .*Profile/i })).toBeVisible();

    // Check Avatar upload input
    const avatarInput = page.locator('input#avatar');
    await expect(avatarInput).toBeAttached();
    await expect(avatarInput).toHaveAttribute('accept', /image/i);

    // Check Resume upload input with PDF/DOC/DOCX support
    const resumeInput = page.locator('input#resume');
    await expect(resumeInput).toBeAttached();
    await expect(resumeInput).toHaveAttribute('accept', /pdf|doc|docx/i);
  });

  test('3. Employer Company creation & logo/cover upload inputs exist', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-test-jwt-token-employer');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              _id: '64e000000000000000000003',
              name: 'Employer User',
              email: 'employer@workmark.test',
              role: 'employer',
              isVerified: true,
              countryCode: 'in',
            },
          },
        }),
      });
    });

    await page.goto('/employer/company/create');
    await expect(page.getByRole('heading', { name: 'Create Organization Profile' })).toBeVisible();

    // Check Logo upload input
    const logoInput = page.locator('input#logo');
    await expect(logoInput).toBeAttached();
    await expect(logoInput).toHaveAttribute('accept', /image/i);

    // Check Cover image upload input
    const coverInput = page.locator('input#cover');
    await expect(coverInput).toBeAttached();
    await expect(coverInput).toHaveAttribute('accept', /image/i);
  });
});
