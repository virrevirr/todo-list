import { test, expect } from '@playwright/test'

test('GET /api/lists returns 401 when unauthenticated', async ({ request }) => {
  const res = await request.get('/api/lists')
  expect(res.status()).toBe(401)
})

// Requires TEST_EMAIL and TEST_PASSWORD secrets in CI
test('GET /api/lists returns lists for authenticated user', async ({ page, request }) => {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    test.skip()
    return
  }

  // Log in via the UI to get a session cookie
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /log in/i }).click()
  await expect(page).toHaveURL('/dashboard')

  // Use the authenticated session to call the API
  const res = await page.request.get('/api/lists')
  expect(res.status()).toBe(200)

  const lists = await res.json()
  expect(Array.isArray(lists)).toBe(true)
})

test('GET /api/todos returns todos for a valid list_id', async ({ page }) => {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    test.skip()
    return
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /log in/i }).click()
  await expect(page).toHaveURL('/dashboard')

  // Get a list to query todos for
  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  expect(lists.length).toBeGreaterThan(0)

  const listId = lists[0].id

  // Fetch todos for that list
  const res = await page.request.get(`/api/todos?list_id=${listId}`)
  expect(res.status()).toBe(200)

  const todos = await res.json()
  expect(Array.isArray(todos)).toBe(true)
})

test('GET /api/todos returns 400 without list_id', async ({ page }) => {
  const email = process.env.TEST_EMAIL
  const password = process.env.TEST_PASSWORD

  if (!email || !password) {
    test.skip()
    return
  }

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /log in/i }).click()
  await expect(page).toHaveURL('/dashboard')

  const res = await page.request.get('/api/todos')
  expect(res.status()).toBe(400)
})
