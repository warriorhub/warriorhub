import { test, expect } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/session-org@foo.com.json',
});
test('Sign In Page', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/signin');
  await page.locator('input[name="email"]').fill('org@foo.com');
  await page.locator('input[name="password"]').fill('changeme123');
  await page.getByRole('button', { name: 'Signin' }).click();
});
test('Search Page', async ({ page }) => {
  await page.goto('http://localhost:3000/search');
  await expect(page.locator('h1')).toMatchAriaSnapshot('- heading "Search Events" [level=1]');
  await expect(page.locator('form')).toMatchAriaSnapshot(`
    - text: Event Name
    - textbox "Search by event name"
    - text: Organization
    - textbox "Search by organization"
    - text: Location
    - textbox "Search by location"
    - text: Date
    - textbox
    - button "Reset Filters"
    `);
  await expect(page.locator('h1')).toContainText('Search Events');
  await page.getByRole('textbox', { name: 'Search by event name' }).click();
  await page.getByRole('textbox', { name: 'Search by event name' }).fill('game');
  await page.getByRole('textbox', { name: 'Search by organization' }).click();
  await page.getByRole('textbox', { name: 'Search by organization' }).fill('org');
  await page.getByRole('textbox', { name: 'Search by location' }).click();
  await page.getByRole('textbox', { name: 'Search by location' }).fill('post');
  await page.locator('input[name="date"]').fill('');
  await page.locator('input[name="date"]').press('ArrowLeft');
  await page.locator('input[name="date"]').fill('');
  await page.getByRole('button', { name: 'Reset Filters' }).click();
  await expect(page.locator('h5')).toMatchAriaSnapshot('- heading "Categories" [level=5]');
  await page.getByRole('button', { name: 'Recreation' }).click();
  await page.getByRole('button', { name: 'Food' }).click();
  await page.getByRole('button', { name: 'Career' }).click();
  await page.getByRole('button', { name: 'Free' }).click();
  await page.getByRole('button', { name: 'Cultural' }).click();
  await page.getByRole('button', { name: 'Academic' }).click();
  await page.getByRole('button', { name: 'Social' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await page.getByRole('button', { name: 'Sports' }).click();
});
test('Calendar Page', async ({ page }) => {
  await page.goto('http://localhost:3000/calendar');
  await expect(page.getByRole('heading')).toMatchAriaSnapshot('- heading "Calendar" [level=1]');
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Today' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Month' }).click();
  await page.getByRole('button', { name: 'Week' }).click();
  await page.getByRole('button', { name: 'Day', exact: true }).click();
});
test('Help Page', async ({ page }) => {
  await page.goto('http://localhost:3000/contact');
  await expect(page.locator('h1')).toMatchAriaSnapshot('- heading "About WarriorHub" [level=1]');
  await expect(page.getByRole('main'))
    .toMatchAriaSnapshot(
      // eslint-disable-next-line max-len
      '- paragraph: WarriorHub is a centralized platform for UH Mānoa students to discover, connect, and experience campus events all in one place. Our goal is to make it easier for students to stay engaged with campus life.',
    );
  await page.getByRole('link', { name: 'View Project Documentation' }).click();
  await expect(page.locator('h2')).toMatchAriaSnapshot('- heading "Contact Us" [level=2]');
});
test('Organizer My Events Page', async ({ page }) => {
  await page.goto('http://localhost:3000/myevents');
});
test('SignOut Page', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/signout');
  await expect(page.getByRole('heading')).toMatchAriaSnapshot('- heading "Do you want to sign out?" [level=2]');
  await page.getByRole('button', { name: 'Sign Out' }).click();
});
test('Organizer Home Page', async ({ page }) => {
  await page.goto('http://localhost:3000/organizer');
});
test('Add Events Page', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Skip WebKit');
  await page.goto('http://localhost:3000/auth/signin');
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill('org@foo.com');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('changeme123');
  await page.locator('input[name="password"]').press('Enter');
  await page.getByRole('link', { name: 'My Events' }).click();
  await page.goto('http://localhost:3000/myevents');
  await page.getByRole('button', { name: 'ADD NEW' }).click();
  await page.waitForURL('**/myevents/add');
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Event Name' }).click();
  await page.getByRole('textbox', { name: 'Location' }).click();
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Image URL' }).click();
  await expect(page.getByRole('heading')).toContainText('Add Event');
  await expect(page.getByRole('button', { name: 'Create Event' })).toBeVisible();
});
