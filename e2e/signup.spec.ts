import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/signup')
})

test('signup page renders correctly', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toBeVisible()
  await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
})

test('signup page has link to login', async ({ page }) => {
  await page.getByRole('link', { name: /log in/i }).click()
  await expect(page).toHaveURL('/login')
})

test('signup shows error on invalid email', async ({ page }) => {
  await page.getByLabel('Email').fill('not-an-email')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: /create account/i }).click()
  // Browser native validation prevents submission with invalid email
  await expect(page).toHaveURL('/signup')
})

test('signup shows error on short password', async ({ page }) => {
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('123')
  await page.getByRole('button', { name: /create account/i }).click()
  // Browser native validation prevents submission (minLength=6)
  await expect(page).toHaveURL('/signup')
})

test('signup succeeds with valid credentials', async ({ page }) => {
  // Use a unique email each run so we never hit "user already exists"
  const email = `test+${Date.now()}@example.com`
  const password = 'testpassword123'

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /create account/i }).click()

  // Email confirmation is disabled — should redirect straight to dashboard
  await expect(page).toHaveURL('/dashboard')
})
