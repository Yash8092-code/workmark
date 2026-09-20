import { test, expect } from '@playwright/test';

test.describe('Workmark Opportunity Intelligence & Command Center Dashboards', () => {
  test('1. Seeker Command Center: Profile readiness, pipeline, recommendation tabs and activity', async ({ page }) => {
    // Authenticate as job seeker
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-seeker-jwt-token');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              _id: '64e000000000000000000001',
              name: 'Sarah Chen',
              email: 'sarah@workmark.test',
              role: 'job_seeker',
              isVerified: true,
              countryCode: 'in',
            },
          },
        }),
      });
    });

    await page.route('**/api/dashboard/seeker', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            profileReadiness: {
              percentage: 80,
              completedItems: ['Professional Headline', 'About / Bio Summary', 'Core Skills', 'Work Experience', 'Job Preferences'],
              missingItems: ['Uploaded Resume', 'Contact Phone'],
            },
            metrics: {
              activeApplications: 4,
              savedJobs: 3,
              strongMatchesCount: 6,
              shortlistedCount: 1,
            },
            pipeline: {
              pending: 2,
              reviewed: 1,
              shortlisted: 1,
              accepted: 0,
              rejected: 1,
            },
            recommendations: {
              strongMatches: [
                {
                  _id: '64e000000000000000000101',
                  title: 'Senior Frontend Architect',
                  companyName: 'Stripe Global',
                  location: 'Bangalore',
                  country: 'India',
                  countryCode: 'in',
                  workMode: 'remote',
                  employmentType: 'full-time',
                  experienceLevel: 'senior',
                  skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
                  createdAt: new Date().toISOString(),
                  matchScore: 88,
                  opportunityIntelligence: {
                    score: 88,
                    matchTier: 'Strong Match',
                    matchConfidence: 'High confidence',
                    tags: ['Remote', 'Fresh'],
                    matchingSkills: ['React', 'TypeScript', 'TailwindCSS'],
                    missingSkills: ['Next.js'],
                    allCandidateSkills: ['React', 'TypeScript', 'Node.js', 'TailwindCSS'],
                    allJobSkills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
                    fitSignals: ['3 verified skills align', 'Offers full remote flexibility'],
                    gaps: ['Next.js requested by employer'],
                    salaryFit: { status: 'undisclosed', label: 'Salary: Not enough data' },
                    applicationGuidance: {
                      status: 'recommended',
                      headline: 'Recommended Opportunity',
                      summary: 'Strong skill overlap and market alignment.',
                    },
                  },
                },
              ],
              skillStretch: [
                {
                  _id: '64e000000000000000000102',
                  title: 'Full Stack Cloud Engineer',
                  companyName: 'CloudScale Inc',
                  location: 'Hyderabad',
                  country: 'India',
                  countryCode: 'in',
                  workMode: 'hybrid',
                  employmentType: 'full-time',
                  experienceLevel: 'senior',
                  skills: ['React', 'TypeScript', 'AWS', 'Docker', 'Kubernetes'],
                  createdAt: new Date().toISOString(),
                  matchScore: 68,
                  opportunityIntelligence: {
                    score: 68,
                    matchTier: 'Good Match',
                    matchConfidence: 'High confidence',
                    tags: ['Skill Stretch'],
                    matchingSkills: ['React', 'TypeScript'],
                    missingSkills: ['AWS', 'Docker', 'Kubernetes'],
                    allCandidateSkills: ['React', 'TypeScript', 'Node.js'],
                    allJobSkills: ['React', 'TypeScript', 'AWS', 'Docker', 'Kubernetes'],
                    fitSignals: ['Core Frontend stack matches your profile'],
                    gaps: ['AWS and Docker requested but not listed in profile'],
                    salaryFit: { status: 'undisclosed', label: 'Salary: Not enough data' },
                    applicationGuidance: {
                      status: 'skill_stretch',
                      headline: 'Skill Stretch Opportunity',
                      summary: 'You have solid core skills. AWS experience will enhance your fit.',
                    },
                  },
                },
              ],
              remoteAndGlobal: [],
              recentlyAdded: [],
            },
            skillInsights: {
              userSkills: ['React', 'TypeScript', 'Node.js', 'TailwindCSS'],
              inDemandSkills: [
                { skill: 'React', jobCount: 14 },
                { skill: 'TypeScript', jobCount: 12 },
                { skill: 'AWS', jobCount: 9 },
                { skill: 'Docker', jobCount: 7 },
              ],
              marketContext: 'Based on 28 active Engineering opportunities in India',
            },
            recentActivity: [
              {
                id: 'act-1',
                type: 'application_submitted',
                title: 'Applied to Senior Frontend Architect',
                description: 'Application status: PENDING at Stripe Global',
                timestamp: new Date().toISOString(),
              },
            ],
          },
        }),
      });
    });

    await page.goto('/seeker/dashboard');
    await expect(page.getByRole('heading', { name: /Welcome back, Sarah/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Career Command Center')).toBeVisible();

    // Verify 10-point Profile Readiness card
    await expect(page.getByRole('heading', { name: /Profile Readiness/i })).toBeVisible();
    await expect(page.locator('text=80%').first()).toBeVisible();
    await expect(page.locator('text=Add Uploaded Resume')).toBeVisible();

    // Verify Application Pipeline Stages
    await expect(page.getByRole('heading', { name: /Application Pipeline/i })).toBeVisible();
    await expect(page.locator('text=Applied').first()).toBeVisible();
    await expect(page.locator('text=Shortlisted').first()).toBeVisible();

    // Verify Personalized Recommendations and Tab Switching
    await expect(page.getByRole('heading', { name: /Recommended Opportunities/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Senior Frontend Architect' })).toBeVisible();
    await expect(page.locator('text=88% Match').first()).toBeVisible();

    // Switch to Skill Stretch Tab
    const skillStretchTab = page.locator('button:has-text("Skill Stretch")').first();
    await skillStretchTab.click({ force: true });
    await expect(page.getByRole('link', { name: 'Full Stack Cloud Engineer' })).toBeVisible();
    await expect(page.locator('text=68% Match').first()).toBeVisible();

    // Verify Opportunity Intelligence Modal opens
    const intelBtn = page.locator('button:has-text("Intel")').first();
    if (await intelBtn.isVisible()) {
      await intelBtn.click({ force: true });
      await expect(page.getByRole('heading', { name: /Opportunity Intelligence Assessment/i })).toBeVisible();
      await expect(page.locator('text=Skill Stretch Opportunity').first()).toBeVisible();
      await expect(page.locator('text=Matching Skills')).toBeVisible();
      await page.getByRole('button', { name: /Close/i }).click({ force: true });
    }

    // Verify Market Skill Signals & Activity
    await expect(page.getByRole('heading', { name: /Market Skill Signals/i })).toBeVisible();
    await expect(page.locator('text=Frequently requested in active roles:')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Recent Career Activity/i })).toBeVisible();
  });

  test('2. Employer Command Center: Funnel, review queue, reject modal, and performance', async ({ page }) => {
    // Authenticate as Employer
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-employer-jwt-token');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              _id: '64e000000000000000000002',
              name: 'Apex Recruiter',
              email: 'recruiter@apex.test',
              role: 'employer',
              isVerified: true,
              countryCode: 'in',
            },
          },
        }),
      });
    });

    await page.route('**/api/dashboard/employer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            companyReadiness: {
              percentage: 85,
              completedItems: ['Company Name', 'Company Logo', 'About Company', 'Industry Sector'],
              missingItems: ['Official Website'],
            },
            metrics: {
              activeJobs: 3,
              totalApplications: 12,
              candidatesToReview: 4,
              shortlistedCandidates: 2,
              hiresCount: 1,
            },
            pipeline: {
              pending: 4,
              reviewed: 3,
              shortlisted: 2,
              accepted: 1,
              rejected: 2,
            },
            candidatesNeedingAttention: [
              {
                applicationId: 'app-001',
                applicantId: 'user-001',
                applicantName: 'Alex Morgan',
                applicantEmail: 'alex@workmark.test',
                jobId: 'job-001',
                jobTitle: 'Lead Backend Engineer',
                appliedAt: new Date().toISOString(),
                status: 'pending',
                matchScore: 92,
                skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
              },
            ],
            jobPerformance: [
              {
                jobId: 'job-001',
                title: 'Lead Backend Engineer',
                location: 'Bangalore, India',
                workMode: 'hybrid',
                status: 'active',
                applicationsCount: 8,
                viewsCount: 64,
                conversionRate: 13,
                createdAt: new Date().toISOString(),
              },
            ],
            recruitmentInsights: {
              hasEnoughData: true,
              insights: [
                'You have 4 candidates awaiting initial screening across 3 active openings.',
                'Lead Backend Engineer has generated the highest applicant interest.',
              ],
            },
          },
        }),
      });
    });

    await page.goto('/employer/dashboard');
    await page.waitForLoadState('networkidle');

    // Verify Header and Overview Metrics
    await expect(page.getByRole('heading', { name: /Recruiter Dashboard/i })).toBeVisible();
    await expect(page.locator('text=Active Jobs').first()).toBeVisible();
    await expect(page.locator('text=Total Applicants').first()).toBeVisible();

    // Verify Candidates Needing Attention Review Queue
    await expect(page.getByRole('heading', { name: /Candidates Needing Attention/i })).toBeVisible();
    await expect(page.locator('text=Alex Morgan')).toBeVisible();
    await expect(page.locator('text=92% Match').first()).toBeVisible();

    // Verify 1-Click Status Action Buttons
    await expect(page.getByRole('button', { name: /Mark Reviewed/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Shortlist/i })).toBeVisible();

    // Verify Reject Confirmation Dialog Modal
    const declineBtn = page.getByRole('button', { name: /Decline/i }).first();
    await declineBtn.scrollIntoViewIfNeeded();
    await declineBtn.click({ force: true });
    await expect(page.getByRole('heading', { name: /Confirm Candidate Decline/i })).toBeVisible();
    await expect(page.locator('text=Are you sure you want to decline Alex Morgan?')).toBeVisible();
    await page.getByRole('button', { name: /Cancel/i }).click();

    // Verify Job Postings Performance Table
    await expect(page.getByRole('heading', { name: /Job Postings Performance/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lead Backend Engineer' })).toBeVisible();
    await expect(page.locator('text=13%')).toBeVisible(); // Conversion rate
  });

  test('3. Job Details Opportunity Intelligence section and fit signals', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-seeker-jwt-token');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              _id: '64e000000000000000000001',
              name: 'Sarah Chen',
              role: 'job_seeker',
              countryCode: 'in',
            },
          },
        }),
      });
    });

    await page.route('**/api/jobs/job-intel-test', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            job: {
              _id: 'job-intel-test',
              title: 'Principal Systems Engineer',
              companyName: 'Stripe Global',
              description: 'We are seeking a seasoned systems engineer to design high-throughput microservices.',
              category: 'Engineering',
              location: 'Bangalore',
              country: 'India',
              countryCode: 'in',
              workMode: 'remote',
              employmentType: 'full-time',
              experienceLevel: 'senior',
              skills: ['TypeScript', 'Go', 'Kubernetes', 'AWS'],
              createdAt: new Date().toISOString(),
              views: 120,
              opportunityIntelligence: {
                score: 85,
                matchTier: 'Strong Match',
                matchConfidence: 'High confidence',
                tags: ['Remote', 'Fresh'],
                matchingSkills: ['TypeScript', 'AWS'],
                missingSkills: ['Go', 'Kubernetes'],
                allCandidateSkills: ['TypeScript', 'React', 'AWS'],
                allJobSkills: ['TypeScript', 'Go', 'Kubernetes', 'AWS'],
                fitSignals: ['Matches your target location preference (India)', 'Offers full remote flexibility'],
                gaps: ['Go and Kubernetes requested by employer'],
                salaryFit: { status: 'undisclosed', label: 'Salary: Not enough data' },
                applicationGuidance: {
                  status: 'recommended',
                  headline: 'Recommended Opportunity',
                  summary: 'Strong skill overlap and market alignment.',
                },
              },
            },
          },
        }),
      });
    });

    await page.goto('/jobs/job-intel-test');
    await page.waitForLoadState('networkidle');

    // Verify Opportunity Intelligence Section
    await expect(page.getByRole('heading', { name: /Personalized Fit Assessment/i })).toBeVisible();
    await expect(page.locator('text=85%').first()).toBeVisible();
    await expect(page.locator('text=Strong Match').first()).toBeVisible();
    await expect(page.locator('text=Application Guidance')).toBeVisible();
    await expect(page.locator('text=Matching Profile Skills')).toBeVisible();
    await expect(page.locator('text=Target Growth Skills')).toBeVisible();
    await expect(page.locator('text=TypeScript').first()).toBeVisible();
  });
});
