import { test, expect } from '@playwright/test'
import { hasCredentials, login } from './helpers'

test('complete user journey: login → lists → todos → details → profile → logout', async ({ page }) => {
  if (!hasCredentials()) test.skip()
  await login(page)

  // --- Create a new list ---
  const listName = `Journey ${Date.now()}`
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await page.getByRole('button', { name: '+ New List' }).click()
  await page.getByPlaceholder('List name').fill(listName)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByRole('heading', { name: listName })).toBeVisible({ timeout: 10000 })

  // --- Add two todos ---
  const todo1 = `Buy groceries ${Date.now()}`
  await page.getByPlaceholder('Add a new task...').fill(todo1)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByText(todo1)).toBeVisible({ timeout: 5000 })

  const todo2 = `Clean house ${Date.now()}`
  await page.getByPlaceholder('Add a new task...').fill(todo2)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByText(todo2)).toBeVisible({ timeout: 5000 })

  // --- Complete the first todo ---
  const firstItem = page.locator('li', { hasText: todo1 })
  await firstItem.getByRole('button', { name: /mark complete/i }).click()
  await expect(firstItem.getByText('Done')).toBeVisible({ timeout: 5000 })

  // --- Open detail sidebar for second todo and add a description ---
  await page.getByText(todo2).click()
  await expect(page.getByText('Task name')).toBeVisible()
  await page.locator('textarea').fill('Kitchen and living room')
  await page.locator('footer').getByRole('button', { name: /^done$/i }).click()

  // Verify description appears as a preview under the todo title
  await expect(page.getByText('Kitchen and living room')).toBeVisible({ timeout: 5000 })

  // --- Navigate to profile ---
  await page.getByRole('button', { name: /profile/i }).click()
  await expect(page).toHaveURL('/profile')
  await expect(page.getByText(process.env.TEST_EMAIL!)).toBeVisible()

  // --- Return to dashboard ---
  await page.getByRole('button', { name: /back/i }).click()
  await expect(page).toHaveURL('/dashboard')

  // --- Delete the list we created (cleanup) ---
  await page.getByRole('button', { name: /open sidebar/i }).click()
  const listEntry = page.locator('aside nav > div', { hasText: listName })
  await listEntry.hover()
  await listEntry.getByRole('button', { name: new RegExp(`delete ${listName}`, 'i') }).click()
  await expect(listEntry).not.toBeVisible({ timeout: 5000 })

  // --- Log out ---
  await page.getByRole('button', { name: /log out/i }).click()
  await expect(page).toHaveURL('/')
})
