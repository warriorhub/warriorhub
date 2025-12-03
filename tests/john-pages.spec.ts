import { test } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/session-john@foo.com.json',
});

test('Search Events Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/search');
  await page.getByText('WarriorHubHomeSearch').click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'Search Events' }).click();
  await page.getByText('Event NameOrganizationLocationDateSearchReset Filters').click();
  await page.getByRole('heading', { name: 'Search Events' }).click();
  await page.getByRole('textbox', { name: 'Search by event name' }).click();
  await page.getByRole('textbox', { name: 'Search by location' }).click();
  await page.getByRole('textbox', { name: 'Search by organization' }).click();
  await page.locator('input[name="date"]').fill('2025-12-02');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Reset Filters' }).click();
  await page.getByRole('heading', { name: 'Categories' }).click();
  await page.getByText('CategoriesRecreationFoodCareerFreeCulturalAcademicSocialWorkshopSports').click();
  await page.getByRole('button', { name: 'Recreation' }).click();
  await page.getByRole('button', { name: 'Food' }).click();
  await page.getByRole('button', { name: 'Career' }).click();
  await page.getByRole('button', { name: 'Free' }).click();
  await page.getByRole('button', { name: 'Cultural' }).click();
  await page.getByRole('button', { name: 'Academic' }).click();
  await page.getByRole('button', { name: 'Social' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: 'Reset Filters' }).click();
  await page.getByRole('img', { name: 'American society of Engineer' }).click();
  await page.getByText('FoodFreeSocialAmerican').click();
  await page.getByText('FoodFreeSocial').click();
  await page.getByText('11/30/2025 •Holmes Hall').click();
  await page.locator('div').filter({ hasText: 'Visit Page' }).nth(5).click();
});
test('Events Details Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/events/9eb3cb55-f176-44b6-a654-9d562d7a9cdc');
  // await page.getByRole('button', { name: 'Visit Page' }).first().click();
  await page.getByText('No description provided.').click();
  await page.getByRole('contentinfo').click();
  await page.getByText('The WarriorHub').click();
  await page.locator('div').filter({ hasText: /^← Back$/ }).click();
});
test('Calender Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/calender');
  await page.getByRole('link', { name: 'Calendar' }).click();
  await page.getByText('CalendarBackTodayNextDecember').click();
  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('button', { name: 'Week' }).click();
  await page.getByLabel('Month:').selectOption('10');
  await page.goto('http://localhost:3000/calendar/2025/11');
});

test('Help Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/contact');
});
test('My Events Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/myevents');
});
test('Sign Out Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/auth/signout');
  await page.getByRole('heading', { name: 'Do you want to sign out?' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.goto('https://warriorhub-gamma.vercel.app');
});
