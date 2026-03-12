import { test, expect } from '@playwright/test'

test('GET /api/lists returns 401 when unauthenticated', async ({ request }) => {
  const res = await request.get('/api/lists')
  expect(res.status()).toBe(401)
})
