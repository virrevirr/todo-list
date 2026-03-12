import { test, expect } from '@playwright/test'

test.describe('unauthenticated page access', () => {
  test('dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('profile redirects to login', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL('/login')
  })
})

test.describe('unauthenticated API access', () => {
  test('GET /api/lists returns 401', async ({ request }) => {
    const res = await request.get('/api/lists')
    expect(res.status()).toBe(401)
  })

  test('POST /api/lists returns 401', async ({ request }) => {
    const res = await request.post('/api/lists', {
      data: { title: 'Unauthorized list' },
    })
    expect(res.status()).toBe(401)
  })

  test('DELETE /api/lists/:id returns 401', async ({ request }) => {
    const res = await request.delete('/api/lists/nonexistent-id')
    expect(res.status()).toBe(401)
  })

  test('GET /api/todos returns 401', async ({ request }) => {
    const res = await request.get('/api/todos?list_id=fake')
    expect(res.status()).toBe(401)
  })

  test('POST /api/todos returns 401', async ({ request }) => {
    const res = await request.post('/api/todos', {
      data: { title: 'Unauthorized todo', list_id: 'fake' },
    })
    expect(res.status()).toBe(401)
  })

  test('PATCH /api/todos/:id returns 401', async ({ request }) => {
    const res = await request.patch('/api/todos/nonexistent-id', {
      data: { completed: true },
    })
    expect(res.status()).toBe(401)
  })

  test('DELETE /api/todos/:id returns 401', async ({ request }) => {
    const res = await request.delete('/api/todos/nonexistent-id')
    expect(res.status()).toBe(401)
  })

  test('PATCH /api/profile returns 401', async ({ request }) => {
    const res = await request.patch('/api/profile', {
      data: { first_name: 'Test', last_name: 'User' },
    })
    expect(res.status()).toBe(401)
  })

  test('DELETE /api/profile returns 401', async ({ request }) => {
    const res = await request.delete('/api/profile')
    expect(res.status()).toBe(401)
  })
})
