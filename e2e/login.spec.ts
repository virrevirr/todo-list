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

test('login shows error on wrong credentials', async ({ page }) => {
  await page.getByLabel('Email').fill('wrong@example.com')
  await page.getByLabel('Password').fill('wrongpassword')
  await page.getByRole('button', { name: /log in/i }).click()

  await expect(page).not.toHaveURL('/dashboard')
  await expect(page.getByText(/invalid login credentials/i)).toBeVisible({ timeout: 10000 })
})
