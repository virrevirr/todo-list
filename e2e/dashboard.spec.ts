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

test('sidebar opens when hamburger is clicked', async ({ page }) => {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await expect(page.getByRole('complementary')).toBeVisible()
})

test('logout redirects to home page', async ({ page }) => {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: /log out/i }).click()
  await expect(page).toHaveURL('/')
})
