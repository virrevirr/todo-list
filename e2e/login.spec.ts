import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
})

test('login page renders correctly', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toBeVisible()
  await expect(page.getByRole('button', { name: /log in/i })).toBeVisible()
})

test('login page has link to signup', async ({ page }) => {
  await page.getByRole('link', { name: /sign up/i }).click()
  await expect(page).toHaveURL('/signup')
})

test('login shows error on wrong credentials', async ({ page }) => {
  await page.getByLabel('Email').fill('wrong@example.com')
  await page.getByLabel('Password').fill('wrongpassword')
  await page.getByRole('button', { name: /log in/i }).click()

  // Should stay on login page and show some error — not redirect to dashboard
  await expect(page).not.toHaveURL('/dashboard')
  await expect(page.getByText(/invalid login credentials/i)).toBeVisible({ timeout: 10000 })
})

// Requires TEST_EMAIL and TEST_PASSWORD secrets in CI (verified account)
test('login succeeds and redirects to dashboard', async ({ page }) => {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    test.skip()
    return
  }

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /log in/i }).click()

  await expect(page).toHaveURL('/dashboard')
})
