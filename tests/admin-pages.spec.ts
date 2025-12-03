import { test } from '@playwright/test';

test.use({
  storageState: 'tests/playwright-auth-sessions/session-admin@foo.com.json',
});

test('Admin Home Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/admin');
  // await page.getByRole('heading', { name: 'Account List' }).click();
  // await page.getByRole('cell', { name: 'Email' }).click();
  // await page.getByRole('cell', { name: 'Role' }).click();
  // await page.getByRole('cell', { name: 'Actions' }).click();
  // await page.getByRole('link', { name: 'Edit' }).first().click();
  // await page.getByRole('cell', { name: 'admin@foo.com' }).click();
  await page.locator('div').filter({ hasText: /^Email$/ }).click();
  // await page.getByText('RoleUSERORGANIZERADMIN').click();
  // await page.getByRole('button', { name: 'Submit' }).click();
  // await page.getByText('SuccessUser role has been').click();
  await page.getByRole('heading', { name: 'Edit User' }).click();
});
test('Search Events Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/search');
  await page.getByRole('link', { name: 'Search Events' }).click();
  await page.getByRole('heading', { name: 'Search Events' }).click();
  await page.getByRole('textbox', { name: 'Search by event name' }).click();
  await page.getByRole('textbox', { name: 'Search by location' }).click();
  await page.getByRole('textbox', { name: 'Search by organization' }).click();
  await page.locator('input[name="date"]').fill('2025-12-02');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: 'Reset Filters' }).click();
  await page.getByRole('button', { name: 'Recreation' }).click();
  await page.getByRole('heading', { name: 'Categories' }).click();
  await page.getByRole('button', { name: 'Food' }).click();
  await page.getByRole('button', { name: 'Free' }).click();
  await page.getByRole('button', { name: 'Career' }).click();
  await page.getByRole('button', { name: 'Cultural' }).click();
  await page.getByRole('button', { name: 'Academic' }).click();
  await page.getByRole('button', { name: 'Social' }).click();
  await page.getByRole('button', { name: 'Workshop' }).click();
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: 'Reset Filters' }).click();
});

test('Events Details Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/events/9eb3cb55-f176-44b6-a654-9d562d7a9cdc');
  await page.getByRole('img', { name: 'American society of Engineer' }).click();
  // await page.getByText('FoodFreeSocialAmerican').click();
  // await page.getByRole('button', { name: 'Visit Page' }).first().click();
  await page.locator('div').filter({ hasText: 'American society of Engineer' }).nth(1).click();
  await page.getByRole('button', { name: '← Back' }).click();
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
test('Calender Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/calender');
  // await page.getByRole('heading', { name: 'Calendar' }).click();
  // await page.locator('div').filter({ hasText: 'BackTodayNextDecember' }).nth(1).click();
  // await page.getByText('Data Workshop: Python').click();
  // await page.locator('div').filter({ hasText: 'Data Workshop: PythonDecember' }).nth(1).click();
  // await page.getByRole('button', { name: '← Back' }).click();
  // await page.getByRole('button', { name: 'Month' }).click();
  // await page.getByRole('button', { name: 'Week' }).click();
  // await page.getByRole('button', { name: 'Day', exact: true }).click();
  // await page.getByLabel('Month:').selectOption('10');
  await page.goto('http://localhost:3000/calendar/2025/11');
});

test('List Events Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/admin/list-events');
  await page.getByRole('heading', { name: 'Manage Events' }).click();
  await page.getByText('Manage EventsView, edit, and remove events.NameDate &').click();
  await page.getByRole('cell', { name: 'American society of Engineer' }).click();
  await page.getByRole('cell', { name: '/29/2025, 4:41:00 PM' }).click();
  await page.getByRole('cell', { name: 'Holmes Hall' }).click();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByRole('heading', { name: 'Edit Event' }).click();
  await page.locator('div').filter({ hasText: /^Name$/ }).click();
  await page.locator('div').filter({ hasText: /^Name$/ }).click();
  // await page.getByText('Come play board games and').click();
  await page.locator('input[name="location"]').click();
  await page.locator('input[name="dateTime"]').click();
  await page.locator('input[name="categories"]').click();
  await page.locator('input[name="imageUrl"]').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Delete Event' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  // await page.getByRole('button', { name: 'Delete' }).first().click();
});

test('My Events Page', async ({ page }) => {
  // await page.getByRole('link', { name: 'My Events' }).click();
  await page.goto('https://warriorhub-gamma.vercel.app/myevents');
});
test('Change Password Page', async ({ page }) => {
  // await page.getByRole('button', { name: 'admin@foo.com' }).click();
  // await page.getByRole('link', { name: 'Change Password' }).click();
  await page.goto('https://warriorhub-gamma.vercel.app/auth/change-password');
  await page.getByRole('heading', { name: 'Change Password' }).click();
  await page.locator('div').filter({ hasText: /^Old Passord$/ }).click();
  await page.locator('div').filter({ hasText: /^New Password$/ }).click();
  await page.locator('input[name="confirmPassword"]').click();
  await page.getByRole('button', { name: 'Change' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
});
test('Sign Out Page', async ({ page }) => {
  await page.goto('https://warriorhub-gamma.vercel.app/auth/signout');
  // await page.getByRole('button', { name: 'admin@foo.com' }).click();
  // await page.getByRole('link', { name: 'Sign Out' }).click();
  await page.getByRole('heading', { name: 'Do you want to sign out?' }).click();
  await page.getByRole('button', { name: 'Sign Out' }).click();
});
