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

test('signup succeeds with valid credentials', async ({ page }) => {
  const email = `test+${Date.now()}@example.com`
  const password = 'testpassword123'

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /create account/i }).click()

  await expect(page).toHaveURL('/dashboard')
})
