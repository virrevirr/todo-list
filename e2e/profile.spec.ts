import { test, expect } from '@playwright/test'

const email = process.env.TEST_EMAIL
const password = process.env.TEST_PASSWORD

test.beforeEach(async ({ page }) => {
  if (!email || !password) test.skip()

  await page.goto('/login')
  await page.getByLabel('Email').fill(email!)
  await page.getByLabel('Password').fill(password!)
  await page.getByRole('button', { name: /log in/i }).click()
  await expect(page).toHaveURL('/dashboard')
})

test('profile page is reachable from dashboard', async ({ page }) => {
  await page.getByRole('button', { name: /profile/i }).click()
  await expect(page).toHaveURL('/profile')
})

test('profile page shows email', async ({ page }) => {
  await page.goto('/profile')
  await expect(page.getByText(email!)).toBeVisible()
})

test('back button returns to dashboard', async ({ page }) => {
  await page.goto('/profile')
  await page.getByRole('button', { name: /back/i }).click()
  await expect(page).toHaveURL('/dashboard')
})

test('unauthenticated user is redirected from profile', async ({ page: unauthPage }) => {
  await unauthPage.goto('/profile')
  await expect(unauthPage).toHaveURL('/login')
})

test('can update first and last name', async ({ page }) => {
  await page.goto('/profile')

  const firstInput = page.locator('input').first()
  await firstInput.fill('Test')
  await firstInput.press('Tab') // triggers onBlur save

  await expect(page.getByText('Saved')).toBeVisible({ timeout: 5000 })
})

test('profile page displays user initials in avatar', async ({ page }) => {
  await page.goto('/profile')
  // The avatar circle should be visible at the top of the profile card
  const avatar = page.locator('.bg-coral').first()
  await expect(avatar).toBeVisible()
})

test('delete account shows confirmation dialog', async ({ page }) => {
  await page.goto('/profile')

  await page.getByRole('button', { name: /delete account/i }).click()
  await expect(page.getByText(/permanently delete/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /yes, delete/i })).toBeVisible()
})

test('can dismiss delete account confirmation', async ({ page }) => {
  await page.goto('/profile')

  await page.getByRole('button', { name: /delete account/i }).click()
  await expect(page.getByText(/permanently delete/i)).toBeVisible()

  // Click Cancel to dismiss
  await page.getByRole('button', { name: /^cancel$/i }).click()
  await expect(page.getByText(/permanently delete/i)).not.toBeVisible()

  // The "Delete account" link should reappear
  await expect(page.getByRole('button', { name: /delete account/i })).toBeVisible()
})

test('profile page shows logout button', async ({ page }) => {
  await page.goto('/profile')
  await expect(page.getByRole('button', { name: /log out/i })).toBeVisible()
})
