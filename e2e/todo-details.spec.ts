import { test, expect } from '@playwright/test'
import { hasCredentials, login, openSidebarAndSelectList, addTodo } from './helpers'

test.beforeEach(async ({ page }) => {
  if (!hasCredentials()) test.skip()
  await login(page)
  await openSidebarAndSelectList(page)
})

test('clicking a todo opens the detail sidebar', async ({ page }) => {
  const title = `Detail open ${Date.now()}`
  await addTodo(page, title)

  await page.getByText(title).click()

  await expect(page.getByText('Task name')).toBeVisible()
  await expect(page.getByText('Description')).toBeVisible()
  await expect(page.getByText('Deadline')).toBeVisible()
})

test('can edit a todo description and save', async ({ page }) => {
  const title = `Desc edit ${Date.now()}`
  await addTodo(page, title)

  await page.getByText(title).click()
  await expect(page.getByText('Description')).toBeVisible()

  const textarea = page.locator('textarea')
  await textarea.fill('A detailed description')

  await page.locator('footer').getByRole('button', { name: /^done$/i }).click()

  // Reopen and verify the description persisted
  await page.getByText(title).click()
  await expect(textarea).toHaveValue('A detailed description')
})

test('can set a deadline date and time', async ({ page }) => {
  const title = `Deadline set ${Date.now()}`
  await addTodo(page, title)

  await page.getByText(title).click()

  await page.locator('input[type="date"]').fill('2026-12-25')
  await page.locator('input[type="time"]').fill('14:30')

  await page.locator('footer').getByRole('button', { name: /^done$/i }).click()

  // A deadline tag should now appear on the todo item
  await expect(page.locator('li', { hasText: title }).getByText(/dec/i)).toBeVisible({ timeout: 5000 })
})

test('cancel discards unsaved changes', async ({ page }) => {
  const title = `Cancel edit ${Date.now()}`
  await addTodo(page, title)

  await page.getByText(title).click()

  const textarea = page.locator('textarea')
  await textarea.fill('Should not persist')

  await page.locator('footer').getByRole('button', { name: /^cancel$/i }).click()

  // Reopen and verify description is still empty
  await page.getByText(title).click()
  await expect(textarea).toHaveValue('')
})

test('can rename a todo via the detail sidebar title field', async ({ page }) => {
  const title = `Rename detail ${Date.now()}`
  const renamed = `Renamed detail ${Date.now()}`
  await addTodo(page, title)

  await page.getByText(title).click()

  // Click the title display to enter edit mode
  const titleButton = page.locator('aside button', { hasText: title })
  await titleButton.click()

  const titleInput = page.locator('aside input[type="text"]').first()
  await titleInput.fill(renamed)
  await titleInput.blur()

  await page.locator('footer').getByRole('button', { name: /^done$/i }).click()

  await expect(page.getByText(renamed)).toBeVisible({ timeout: 5000 })
})

test('can delete a todo from the detail sidebar', async ({ page }) => {
  const title = `Sidebar delete ${Date.now()}`
  await addTodo(page, title)

  await page.getByText(title).click()
  await expect(page.getByText('Task name')).toBeVisible()

  await page.getByRole('button', { name: new RegExp(`delete ${title}`, 'i') }).click()

  await expect(page.getByText(title)).not.toBeVisible({ timeout: 5000 })
})
