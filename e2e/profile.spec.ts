import { test, expect } from '@playwright/test'

test('unauthenticated user is redirected from profile', async ({ page }) => {
  await page.goto('/profile')
  await expect(page).toHaveURL('/login')
})

test('profile page shows email', async ({ page }) => {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    test.skip()
    return
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /log in/i }).click()
  await expect(page).toHaveURL('/dashboard')

  await page.goto('/profile')
  await expect(page.getByText(email)).toBeVisible()
})
