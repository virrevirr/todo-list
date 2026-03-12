import { test, expect } from '@playwright/test'
import { hasCredentials, login } from './helpers'

test.describe('Profile API', () => {
  test.beforeEach(async ({ page }) => {
    if (!hasCredentials()) test.skip()
    await login(page)
  })

  test('PATCH /api/profile updates names successfully', async ({ page }) => {
    const res = await page.request.patch('/api/profile', {
      data: { first_name: 'Test', last_name: 'User' },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('PATCH /api/profile rejects empty first_name', async ({ page }) => {
    const res = await page.request.patch('/api/profile', {
      data: { first_name: '', last_name: 'User' },
    })
    expect(res.status()).toBe(400)
  })

  test('PATCH /api/profile rejects numeric names', async ({ page }) => {
    const res = await page.request.patch('/api/profile', {
      data: { first_name: '12345', last_name: 'User' },
    })
    expect(res.status()).toBe(400)
  })

  test('PATCH /api/profile rejects names over 50 characters', async ({ page }) => {
    const longName = 'A'.repeat(51)
    const res = await page.request.patch('/api/profile', {
      data: { first_name: longName, last_name: 'User' },
    })
    expect(res.status()).toBe(400)
  })

  test('PATCH /api/profile accepts accented characters', async ({ page }) => {
    const res = await page.request.patch('/api/profile', {
      data: { first_name: 'André', last_name: "O'Brien" },
    })
    expect(res.status()).toBe(200)
  })
})
