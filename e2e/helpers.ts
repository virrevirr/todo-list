import { Page, expect } from '@playwright/test'

export function hasCredentials(): boolean {
  return !!(process.env.TEST_EMAIL && process.env.TEST_PASSWORD)
}

export async function login(page: Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(process.env.TEST_EMAIL!)
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
  await page.getByRole('button', { name: /log in/i }).click()
  await expect(page).toHaveURL('/dashboard')
}

export async function openSidebarAndSelectList(page: Page, fallbackName = 'E2E List') {
  await page.getByRole('button', { name: /open sidebar/i }).click()
  await expect(page.getByRole('button', { name: '+ New List' })).toBeVisible()

  const listItems = page.locator('aside nav > div')
  if ((await listItems.count()) > 0) {
    await listItems.first().click()
  } else {
    await page.getByRole('button', { name: '+ New List' }).click()
    await page.getByPlaceholder('List name').fill(fallbackName)
    await page.getByRole('button', { name: /^add$/i }).click()
  }

  await expect(page.getByPlaceholder('Add a new task...')).toBeVisible({ timeout: 10000 })
}

export async function addTodo(page: Page, title: string) {
  await page.getByPlaceholder('Add a new task...').fill(title)
  await page.getByRole('button', { name: /^add$/i }).click()
  await expect(page.getByText(title)).toBeVisible({ timeout: 5000 })
}
