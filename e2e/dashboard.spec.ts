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

test('can add a new list', async ({ page }) => {
  const listName = `Test list ${Date.now()}`

  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: '+ New List' }).click()
  await page.getByPlaceholder('List name').fill(listName)
  await page.getByRole('button', { name: /^add$/i }).click()

  await expect(page.getByRole('heading', { name: listName })).toBeVisible({ timeout: 10000 })
})

test('can cancel adding a new list', async ({ page }) => {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: '+ New List' }).click()
  await page.getByPlaceholder('List name').fill('Should not be saved')
  await page.getByRole('button', { name: /cancel/i }).click()

  await expect(page.getByRole('button', { name: '+ New List' })).toBeVisible()
  await expect(page.getByText('Should not be saved')).not.toBeVisible()
})

test('can delete a list from the sidebar', async ({ page }) => {
  const listName = `Delete list ${Date.now()}`

  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: '+ New List' }).click()
  await page.getByPlaceholder('List name').fill(listName)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByRole('heading', { name: listName })).toBeVisible({ timeout: 10000 })

  // Reopen sidebar and delete the list
  await page.getByRole('button', { name: /open sidebar/i }).click()
  const listEntry = page.locator('aside nav > div', { hasText: listName })
  await listEntry.hover()
  await listEntry.getByRole('button', { name: new RegExp(`delete ${listName}`, 'i') }).click()

  await expect(listEntry).not.toBeVisible({ timeout: 5000 })
})

test('selecting a list shows the todo input', async ({ page }) => {
  const listName = `Select test ${Date.now()}`

  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: '+ New List' }).click()
  await page.getByPlaceholder('List name').fill(listName)
  await page.getByRole('button', { name: /^add$/i }).click()

  await expect(page.getByPlaceholder('Add a new task...')).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('heading', { name: listName })).toBeVisible()
})

test('logout redirects to home page', async ({ page }) => {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: /log out/i }).click()
  await expect(page).toHaveURL('/')
})
