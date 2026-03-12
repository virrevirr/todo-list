import { test, expect } from '@playwright/test'

const email = process.env.TEST_EMAIL
const password = process.env.TEST_PASSWORD

test('can add a todo and mark it complete', async ({ page }) => {
  if (!email || !password) test.skip()

  await page.goto('/login')
  await page.getByLabel('Email').fill(email!)
  await page.getByLabel('Password').fill(password!)
  await page.getByRole('button', { name: /log in/i }).click()
  await expect(page).toHaveURL('/dashboard')

  await page.getByRole('button', { name: /open sidebar/i }).click()
  const firstList = page.locator('aside nav > div').first()
  if ((await firstList.count()) > 0 && (await firstList.isVisible())) {
    await firstList.click()
  } else {
    await page.getByRole('button', { name: '+ New List' }).click()
    await page.getByPlaceholder('List name').fill('E2E List')
    await page.getByRole('button', { name: /^add$/i }).click()
  }

  await expect(page.getByPlaceholder('Add a new task...')).toBeVisible({ timeout: 10000 })

  const title = `Task ${Date.now()}`
  await page.getByPlaceholder('Add a new task...').fill(title)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByText(title)).toBeVisible({ timeout: 5000 })

  const item = page.locator('li', { hasText: title })
  await item.getByRole('button', { name: /mark complete/i }).click()
  await expect(item.getByText('Done')).toBeVisible({ timeout: 5000 })
})
