import { test } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/session-org@foo.com.json',
});

test('Organizer Home Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/organizer');
});
test('Search Events Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/search');
  await page.getByRole('textbox', { name: 'Search by event name' }).click();
  await page.getByRole('textbox', { name: 'Search by organization' }).click();
  await page.getByRole('textbox', { name: 'Search by location' }).click();
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Reset Filters' }).click();
  await page.getByRole('button', { name: 'Recreation' }).click();
  await page.getByRole('button', { name: 'Food' }).click();
  await page.getByRole('button', { name: 'Career' }).click();
  await page.getByRole('button', { name: 'Free' }).click();
  await page.getByRole('button', { name: 'Free' }).click();
  await page.getByRole('button', { name: 'Cultural' }).click();
  await page.getByRole('button', { name: 'Academic' }).click();
  await page.getByRole('button', { name: 'Social' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: 'Reset Filters' }).click();
  await page.getByRole('heading', { name: 'Search Events' }).click();
});
test('Events Details Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/events/9eb3cb55-f176-44b6-a654-9d562d7a9cdc');
  await page.getByRole('button', { name: '← Back' }).click();
});
test('Calender Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/calender');
  // await page.getByText('Data Workshop: Python').click();
  // await page.getByRole('button', { name: '← Back' }).click();
  // await page.getByRole('button', { name: 'Back' }).click();
  // await page.getByRole('button', { name: 'Today' }).click();
  // await page.getByRole('button', { name: 'Next' }).click();
  // await page.getByLabel('Month:').selectOption('10');
  await page.goto('https://warriorhub-gamma.vercel.app/calendar/2026/11');
  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('button', { name: 'Day', exact: true }).click();
});
test('Help Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/contact');
});
test('My Events Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/myevents');
  // await page.getByRole('button', { name: 'PAST EVENTS' }).click();
  // await page.getByRole('button', { name: 'DISPLAY OPTION ▼' }).click();
  // await page.getByRole('button', { name: 'Table View' }).click();
  // await page.getByRole('button', { name: 'DISPLAY OPTION ▼' }).click();
  // await page.getByRole('button', { name: 'Card View' }).click();
});
test('Add Events Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/myevents/add');
  await page.getByRole('textbox', { name: 'Event Name' }).click();
  await page.getByRole('textbox', { name: 'Time' }).click();
  await page.getByRole('textbox', { name: 'Location' }).click();
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Image URL' }).click();
  await page.getByRole('checkbox', { name: 'Food' }).check();
  await page.getByRole('checkbox', { name: 'Recreation' }).check();
  await page.getByRole('checkbox', { name: 'Career' }).check();
  await page.getByRole('checkbox', { name: 'Free' }).check();
  await page.getByRole('checkbox', { name: 'Cultural' }).check();
  await page.getByRole('checkbox', { name: 'Academic' }).check();
  await page.getByRole('checkbox', { name: 'Social' }).check();
  await page.getByRole('checkbox', { name: 'Sports' }).check();
  await page.getByRole('checkbox', { name: 'Workshop' }).check();
  await page.getByRole('button', { name: 'Create Event' }).click();
  await page.getByRole('link', { name: 'Home' }).click();
});
test('Sign Out Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/auth/signout');
  // await page.getByRole('link', { name: 'Sign Out' }).click();
  await page.getByRole('heading', { name: 'Do you want to sign out?' }).click();
  await page.getByRole('button', { name: 'Sign Out' }).click();
});
