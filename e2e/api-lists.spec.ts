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
