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

  // Open sidebar and select (or create) a list to work with
  await page.getByRole('button', { name: /open sidebar/i }).click()
  const firstList = page.locator('aside li button').first()
  if (await firstList.isVisible()) {
    await firstList.click()
  } else {
    await page.getByRole('button', { name: /new list/i }).click()
    await page.getByPlaceholder('List name').fill('E2E List')
    await page.getByRole('button', { name: /^add$/i }).click()
  }
})

test('can add a todo', async ({ page }) => {
  const title = `Task ${Date.now()}`
  await page.getByPlaceholder('Add a new task...').fill(title)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByText(title)).toBeVisible({ timeout: 5000 })
})

test('can toggle a todo to completed', async ({ page }) => {
  const title = `Toggle ${Date.now()}`
  await page.getByPlaceholder('Add a new task...').fill(title)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByText(title)).toBeVisible({ timeout: 5000 })

  // Click the checkbox button for this todo
  const item = page.locator('li', { hasText: title })
  await item.getByRole('button', { name: /mark complete/i }).click()

  await expect(item.getByText('Done')).toBeVisible({ timeout: 5000 })
})

test('can delete a todo', async ({ page }) => {
  const title = `Delete me ${Date.now()}`
  await page.getByPlaceholder('Add a new task...').fill(title)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByText(title)).toBeVisible({ timeout: 5000 })

  const item = page.locator('li', { hasText: title })
  await item.hover()
  await item.getByRole('button', { name: /delete/i }).click()

  await expect(page.getByText(title)).not.toBeVisible({ timeout: 5000 })
})

test('can rename a todo by clicking on it', async ({ page }) => {
  const title = `Rename me ${Date.now()}`
  const renamed = `Renamed ${Date.now()}`
  await page.getByPlaceholder('Add a new task...').fill(title)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByText(title)).toBeVisible({ timeout: 5000 })

  await page.getByText(title).click()
  await page.locator('input[type="text"]').last().fill(renamed)
  await page.keyboard.press('Enter')

  await expect(page.getByText(renamed)).toBeVisible({ timeout: 5000 })
})
