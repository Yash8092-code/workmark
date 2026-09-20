import { test, expect } from '@playwright/test';

test.describe('Workmark Seeker ↔ Provider Workflow & Interaction Suite', () => {
  const mockSeeker = {
    _id: '64e000000000000000000001',
    name: 'Jane Doe',
    email: 'jane.doe@workmark.test',
    role: 'job_seeker',
    isVerified: true,
    countryCode: 'in',
  };

  const mockSeekerProfile = {
    _id: '64e000000000000000000002',
    userId: '64e000000000000000000001',
    headline: 'Senior Full Stack Engineer',
    location: 'Bangalore, India',
    phone: '+91 9876543210',
    bio: 'Passionate full-stack developer with 5+ years of experience in React, Node, and TypeScript.',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
    resume: 'https://example.com/resumes/jane_doe_cv.pdf',
    resumeUrl: 'https://example.com/resumes/jane_doe_cv.pdf',
    experience: [
      {
        title: 'Lead Frontend Engineer',
        company: 'CloudTech Solutions',
        startDate: '2021-01-01',
        current: true,
        description: 'Architecting scalable web applications.',
      },
    ],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'National Institute of Technology',
        startDate: '2016-08-01',
        endDate: '2020-05-01',
      },
    ],
    projects: [],
    socialLinks: {
      github: 'https://github.com/janedoe',
      linkedin: 'https://linkedin.com/in/janedoe',
    },
  };

  const mockEmployer = {
    _id: '64e000000000000000000003',
    name: 'Acme Recruiter',
    email: 'recruiter@acmecorp.test',
    role: 'employer',
    isVerified: true,
    countryCode: 'us',
  };

  const mockCompany = {
    _id: '64e000000000000000000004',
    name: 'Acme Innovations Inc.',
    description: 'Pioneering global cloud infrastructure and AI developer tools.',
    industry: 'Technology & SaaS',
    location: 'San Francisco, CA',
    website: 'https://acme.test',
    size: '50-200',
    verified: true,
  };

  const mockJob = {
    _id: '64e000000000000000000005',
    title: 'Senior Full Stack Engineer',
    companyId: mockCompany,
    userId: '64e000000000000000000003',
    location: 'San Francisco, CA (Remote)',
    workMode: 'remote',
    employmentType: 'full-time',
    experienceLevel: 'senior',
    category: 'Engineering',
    description: 'We are seeking an experienced Full Stack Engineer to lead core product engineering.',
    requirements: ['5+ years full-stack experience', 'Proficiency in React & Node.js'],
    responsibilities: ['Build high-scale distributed systems'],
    status: 'active',
    applicationCount: 3,
    newApplicationsCount: 1,
    stageCounts: {
      pending: 1,
      reviewed: 1,
      shortlisted: 1,
      interview: 0,
      accepted: 0,
      rejected: 0,
    },
    createdAt: new Date().toISOString(),
  };

  const mockApplication = {
    _id: '64e000000000000000000006',
    jobId: mockJob,
    applicantId: mockSeeker,
    userId: mockSeeker,
    employerId: mockEmployer,
    profileId: mockSeekerProfile,
    status: 'interview',
    isViewedByEmployer: false,
    resume: 'https://example.com/resumes/jane_doe_cv.pdf',
    coverLetter: 'I am excited to apply for this Senior Full Stack Engineer role!',
    appliedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    reviewedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    shortlistedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    interviewAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    interview: {
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + 3600000 * 48).toISOString(),
      mode: 'video',
      link: 'https://meet.google.com/abc-defg-hij',
      notes: 'Prepare a 15-minute system architecture demo.',
    },
    statusHistory: [
      { status: 'pending', changedAt: new Date(Date.now() - 3600000 * 24).toISOString() },
      { status: 'reviewed', changedAt: new Date(Date.now() - 3600000 * 12).toISOString() },
      { status: 'shortlisted', changedAt: new Date(Date.now() - 3600000 * 6).toISOString() },
      { status: 'interview', changedAt: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Scheduled technical interview.' },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  };

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/preferences', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            emailNotifications: { newJobs: true, applicationUpdates: true, marketing: false },
            jobAlertPreferences: { keywords: ['React'], locations: ['Remote'] },
          },
        }),
      });
    });

    await page.route('**/api/notifications/unread-count', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { count: 0 } }),
      });
    });

    await page.route('**/api/notifications**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.route('**/api/saved-jobs**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });
  });

  test('1. Seeker Profile Separation: Read-only Profile vs Edit Profile', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-seeker-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockSeeker } }),
      });
    });

    await page.route('**/api/profile/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { profile: mockSeekerProfile } }),
      });
    });

    await page.goto('/seeker/profile');
    await expect(page.getByText('Jane Doe').first()).toBeVisible();
    await expect(page.getByText('Senior Full Stack Engineer').first()).toBeVisible();
    await expect(page.getByText('CloudTech Solutions')).toBeVisible();
    await expect(page.getByText('jane.doe@workmark.test')).toBeVisible();
    await expect(page.getByRole('button', { name: /Edit Profile/i })).toBeVisible();

    await page.getByRole('button', { name: /Edit Profile/i }).click();
    await expect(page).toHaveURL(/\/seeker\/profile\/edit/);
    await expect(page.getByRole('heading', { name: /Edit .*Profile/i })).toBeVisible();
  });

  test('2. Provider Company Separation: Read-only Company Profile vs Edit Company Persistence', async ({ page }) => {
    let companyState = { ...mockCompany };

    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-employer-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockEmployer } }),
      });
    });

    await page.route('**/api/companies/mine', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { company: companyState } }),
      });
    });

    await page.route(`**/api/companies/${mockCompany._id}`, async (route) => {
      if (route.request().method() === 'PUT') {
        const body = JSON.parse(route.request().postData() || '{}');
        companyState = { ...companyState, ...body };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: { company: companyState } }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: { company: companyState } }),
        });
      }
    });

    await page.route('**/api/jobs/employer/my-jobs**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [mockJob], total: 1 }),
      });
    });

    await page.goto('/employer/company');
    await expect(page.getByText('Acme Innovations Inc.').first()).toBeVisible();
    await expect(page.getByText('Pioneering global cloud infrastructure')).toBeVisible();
    await expect(page.getByRole('button', { name: /Edit Company Profile/i })).toBeVisible();

    await page.getByRole('button', { name: /Edit Company Profile/i }).click();
    await expect(page).toHaveURL(/\/employer\/company\/edit/);

    // Edit company name and save using name input
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill('Acme Global Technologies');
    await page.getByRole('button', { name: /Save & Update Profile|Save Changes/i }).click();

    // Verify redirected back to view page and shows updated name
    await expect(page).toHaveURL(/\/employer\/company$/);
    await expect(page.getByText('Acme Global Technologies').first()).toBeVisible();
  });

  test('3. Seeker Job Application Flow & Duplicate Prevention', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-seeker-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockSeeker } }),
      });
    });

    await page.route('**/api/profile/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { profile: mockSeekerProfile } }),
      });
    });

    await page.route(`**/api/jobs/${mockJob._id}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { job: mockJob } }),
      });
    });

    await page.route('**/api/applications/my-applications**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [mockApplication],
          pagination: {
            total: 1,
            page: 1,
            pages: 1,
            limit: 10,
          },
        }),
      });
    });

    await page.goto(`/jobs/${mockJob._id}`);
    await expect(page.getByText('Application Submitted')).toBeVisible();
    await expect(page.getByText(/View in Applications/i)).toBeVisible();
  });

  test('4. Seeker Applications Tracker: Multi-Stage Progress & Active Interview Callout', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-seeker-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockSeeker } }),
      });
    });

    await page.route('**/api/applications/my-applications**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [mockApplication],
          pagination: {
            total: 1,
            page: 1,
            pages: 1,
            limit: 10,
          },
        }),
      });
    });

    await page.goto('/seeker/applications');
    await expect(page.getByRole('heading', { name: /My .*Applications/i })).toBeVisible();
    await expect(page.getByText('Interview Scheduled')).toBeVisible();
    await expect(page.getByText('meet.google.com/abc-defg-hij')).toBeVisible();
    await expect(page.getByText('Prepare a 15-minute system architecture demo.')).toBeVisible();
  });

  test('5. Provider Dashboard & Recruitment Pipeline Funnel', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-employer-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockEmployer } }),
      });
    });

    await page.route('**/api/dashboard/employer**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            metrics: {
              activeJobs: 2,
              totalApplications: 5,
              candidatesToReview: 2,
              shortlistedCandidates: 1,
              interviewCandidates: 1,
              hiresCount: 1,
            },
            pipeline: {
              pending: 2,
              reviewed: 1,
              shortlisted: 1,
              interview: 1,
              accepted: 1,
              rejected: 0,
            },
            candidatesNeedingAttention: [
              {
                applicationId: mockApplication._id,
                applicantId: mockSeeker._id,
                applicantName: mockSeeker.name,
                applicantEmail: mockSeeker.email,
                jobId: mockJob._id,
                jobTitle: mockJob.title,
                status: 'pending',
                isViewedByEmployer: false,
                appliedAt: mockApplication.appliedAt,
                skills: ['React', 'TypeScript'],
                matchScore: 92,
              },
            ],
            jobPerformance: [
              {
                jobId: mockJob._id,
                title: mockJob.title,
                workMode: mockJob.workMode,
                status: 'active',
                applicationsCount: 3,
                viewsCount: 45,
                conversionRate: 6.7,
              },
            ],
            recruitmentInsights: {
              healthScore: 85,
              insights: ['Pipeline response velocity is healthy.'],
            },
            companyReadiness: {
              percentage: 100,
              missingItems: [],
            },
          },
        }),
      });
    });

    await page.goto('/employer/dashboard');
    await expect(page.getByText('Recruitment Command Center')).toBeVisible();
    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('NEW', { exact: true })).toBeVisible();
    await expect(page.getByText('92% Match')).toBeVisible();
  });

  test('6. Provider Candidate Dossier: Contact Actions, Stage Transitions & Interview Cancellation State', async ({ page }) => {
    let currentApp: any = { ...mockApplication, status: 'interview' };

    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-employer-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockEmployer } }),
      });
    });

    await page.route(`**/api/applications/${mockApplication._id}`, async (route) => {
      if (route.request().method() === 'PUT') {
        const body = JSON.parse(route.request().postData() || '{}');
        if (body.interviewAction === 'cancel') {
          currentApp = {
            ...currentApp,
            status: 'shortlisted',
            interview: {
              ...currentApp.interview,
              status: 'cancelled',
              cancelledReason: body.cancelledReason || 'Cancelled by employer',
            },
          };
        } else if (body.status) {
          currentApp = {
            ...currentApp,
            status: body.status,
          };
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { application: currentApp },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              application: currentApp,
              profile: mockSeekerProfile,
              matchScore: 94,
            },
          }),
        });
      }
    });

    await page.goto(`/employer/applicants/${mockApplication._id}`);
    await expect(page.getByRole('heading', { name: 'Jane Doe' })).toBeVisible();
    await expect(page.getByText('Email Candidate')).toBeVisible();
    await expect(page.getByText('Download CV / Resume')).toBeVisible();
    await expect(page.getByText('Interview Details')).toBeVisible();
    await expect(page.getByRole('button', { name: /Reschedule Interview/i })).toBeVisible();

    // Verify Cancel Interview button exists
    const cancelBtn = page.getByRole('button', { name: /Cancel Interview/i });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // Verify modal appeared and submit cancellation
    await expect(page.getByRole('heading', { name: 'Cancel Scheduled Interview' })).toBeVisible();
    await page.getByRole('button', { name: /Confirm Cancellation/i }).click();

    // Verify application state transitioned to Shortlisted
    await expect(page.getByText('Shortlisted').first()).toBeVisible();
  });

  test('7. Notification Read State & Deep-Linking', async ({ page }) => {
    let unreadCount = 1;
    let notificationList = [
      {
        _id: '64e000000000000000000010',
        userId: mockSeeker._id,
        type: 'application_status',
        title: 'Interview Scheduled',
        message: 'You have been invited for a technical interview at Acme Innovations.',
        isRead: false,
        read: false,
        link: `/seeker/applications?applicationId=${mockApplication._id}`,
        createdAt: new Date().toISOString(),
      },
    ];

    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-seeker-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockSeeker } }),
      });
    });

    await page.route('**/api/notifications/unread-count', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { count: unreadCount } }),
      });
    });

    await page.route('**/api/notifications**', async (route) => {
      if (route.request().url().includes('/unread-count')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: { count: unreadCount } }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: notificationList }),
        });
      }
    });

    await page.route('**/api/notifications/64e000000000000000000010/read', async (route) => {
      unreadCount = 0;
      notificationList[0].isRead = true;
      notificationList[0].read = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Notification marked as read' }),
      });
    });

    await page.route('**/api/applications/my-applications**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [mockApplication],
          pagination: { total: 1, page: 1, pages: 1, limit: 10 },
        }),
      });
    });

    await page.goto('/notifications');
    await expect(page.getByText('Interview Scheduled')).toBeVisible();

    // Clicking notification marks it as read and navigates to deep link
    await page.getByText('Interview Scheduled').click();
    await expect(page).toHaveURL(/\/seeker\/applications/);
  });

  test('8. Candidate Contact Privacy & Role-Access Authorization', async ({ page }) => {
    // Seeker cannot access employer dashboard
    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-seeker-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockSeeker } }),
      });
    });

    await page.route('**/api/dashboard/employer', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Only employers can access employer dashboard' }),
      });
    });

    await page.goto('/employer/dashboard');
    // Should be redirected away or blocked by role guard
    await expect(page).not.toHaveURL(/\/employer\/dashboard$/);
  });

  test('9. Mobile Viewport: Layout & Navigation Responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.addInitScript(() => {
      sessionStorage.setItem('token', 'mock-seeker-jwt');
    });

    await page.route('**/api/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: mockSeeker } }),
      });
    });

    await page.route('**/api/profile/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { profile: mockSeekerProfile } }),
      });
    });

    await page.goto('/seeker/profile');
    await expect(page.getByText('Jane Doe').first()).toBeVisible();
    await expect(page.getByText('Senior Full Stack Engineer').first()).toBeVisible();
  });
});
