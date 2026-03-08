import { test, expect } from '@playwright/test'

test('home page loads publicly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/ToDo/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('home page links navigate to auth pages', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: /log in/i }).click()
  await expect(page).toHaveURL('/login')

  await page.goto('/')
  await page.getByRole('link', { name: /sign up/i }).first().click()
  await expect(page).toHaveURL('/signup')
})
