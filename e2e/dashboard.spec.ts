import { test, expect } from '@playwright/test'

const email = process.env.TEST_EMAIL
const password = process.env.TEST_PASSWORD

// Log in before each test
test.beforeEach(async ({ page }) => {
  if (!email || !password) test.skip()

  await page.goto('/login')
  await page.getByLabel('Email').fill(email!)
  await page.getByLabel('Password').fill(password!)
  await page.getByRole('button', { name: /log in/i }).click()
  await expect(page).toHaveURL('/dashboard')
})

// Helper: open the drawer
async function openSidebar(page: ReturnType<typeof test.extend>) {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await expect(page.getByRole('complementary')).toBeVisible()
}

test('sidebar opens when hamburger is clicked', async ({ page }) => {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await expect(page.getByRole('complementary')).toBeVisible()
})

test('can add a new list', async ({ page }) => {
  const listName = `Test list ${Date.now()}`

  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: /new list/i }).click()
  await page.getByPlaceholder('List name').fill(listName)
  await page.getByRole('button', { name: /^add$/i }).click()

  // Header shows the new list title after auto-select
  await expect(page.getByRole('heading', { name: listName })).toBeVisible()

  // Clean up — reopen sidebar and delete
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('navigation').getByText(listName).hover()
  await page.getByRole('button', { name: `Delete ${listName}` }).evaluate((el: HTMLElement) => el.click())
})

test('can cancel adding a new list', async ({ page }) => {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: /new list/i }).click()
  await page.getByPlaceholder('List name').fill('Should not be saved')
  await page.getByRole('button', { name: /cancel/i }).click()

  await expect(page.getByRole('button', { name: /new list/i })).toBeVisible()
  await expect(page.getByText('Should not be saved')).not.toBeVisible()
})

test('selecting a list updates the header', async ({ page }) => {
  const listName = `Select test ${Date.now()}`

  // Create a list first
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: /new list/i }).click()
  await page.getByPlaceholder('List name').fill(listName)
  await page.getByRole('button', { name: /^add$/i }).click()

  // Sidebar closes after selecting — header should show the list title
  await expect(page.getByRole('heading', { name: listName })).toBeVisible()

  // Clean up
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('navigation').getByText(listName).hover()
  await page.getByRole('button', { name: `Delete ${listName}` }).evaluate((el: HTMLElement) => el.click())
})

test('can delete a list', async ({ page }) => {
  const listName = `Delete me ${Date.now()}`

  // Create a list to delete
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: /new list/i }).click()
  await page.getByPlaceholder('List name').fill(listName)
  await page.getByRole('button', { name: /^add$/i }).click()

  // Reopen sidebar and intercept the DELETE response to debug
  await page.getByRole('button', { name: /open sidebar/i }).click()

  await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/lists/') && res.request().method() === 'DELETE'),
    page.getByRole('button', { name: `Delete ${listName}` }).evaluate((el: HTMLElement) => el.click()),
  ])

  // Sidebar stays open after deleting — check the list is gone directly
  await expect(page.getByRole('navigation').getByText(listName)).not.toBeVisible()
})

test('logout redirects to home page', async ({ page }) => {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: /log out/i }).click()
  await expect(page).toHaveURL('/')
})
