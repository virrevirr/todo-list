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

test('POST /api/todos creates a todo in a list', async ({ page }) => {
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

  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  const listId = lists[0].id

  const res = await page.request.post('/api/todos', {
    data: { title: 'Test todo', list_id: listId },
  })
  expect(res.status()).toBe(201)

  const todo = await res.json()
  expect(todo.title).toBe('Test todo')
  expect(todo.completed).toBe(false)
})

test('PATCH /api/todos/:id toggles completion status', async ({ page }) => {
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

  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  const listId = lists[0].id

  const createRes = await page.request.post('/api/todos', {
    data: { title: 'Toggle me', list_id: listId },
  })
  const created = await createRes.json()

  const res = await page.request.patch(`/api/todos/${created.id}`, {
    data: { completed: true },
  })
  expect(res.status()).toBe(200)

  const updated = await res.json()
  expect(updated.completed).toBe(true)
})

test('POST /api/lists creates a new list', async ({ page }) => {
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

  const title = `API list ${Date.now()}`
  const res = await page.request.post('/api/lists', {
    data: { title },
  })
  expect(res.status()).toBe(201)

  const list = await res.json()
  expect(list.title).toBe(title)
  expect(list.id).toBeTruthy()

  // Cleanup: delete the list
  await page.request.delete(`/api/lists/${list.id}`)
})

test('POST /api/lists rejects empty title', async ({ page }) => {
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

  const res = await page.request.post('/api/lists', {
    data: { title: '' },
  })
  expect(res.status()).toBe(400)
})

test('DELETE /api/lists/:id deletes a list', async ({ page }) => {
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

  // Create a list to delete
  const createRes = await page.request.post('/api/lists', {
    data: { title: `Delete me ${Date.now()}` },
  })
  const list = await createRes.json()

  const res = await page.request.delete(`/api/lists/${list.id}`)
  expect(res.status()).toBe(204)

  // Verify it no longer appears
  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  expect(lists.find((l: { id: string }) => l.id === list.id)).toBeUndefined()
})

test('PATCH /api/todos/:id can update title and description', async ({ page }) => {
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

  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  const listId = lists[0].id

  const createRes = await page.request.post('/api/todos', {
    data: { title: 'Original title', list_id: listId },
  })
  const created = await createRes.json()

  const res = await page.request.patch(`/api/todos/${created.id}`, {
    data: {
      title: 'Updated title',
      description: 'A new description',
    },
  })
  expect(res.status()).toBe(200)

  const updated = await res.json()
  expect(updated.title).toBe('Updated title')
  expect(updated.description).toBe('A new description')
})

test('PATCH /api/todos/:id can set a deadline', async ({ page }) => {
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

  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  const listId = lists[0].id

  const createRes = await page.request.post('/api/todos', {
    data: { title: 'Deadline todo', list_id: listId },
  })
  const created = await createRes.json()

  const deadline = '2026-12-25T14:00:00.000Z'
  const res = await page.request.patch(`/api/todos/${created.id}`, {
    data: { deadline },
  })
  expect(res.status()).toBe(200)

  const updated = await res.json()
  expect(updated.deadline).toBeTruthy()
})

test('PATCH /api/todos/:id rejects invalid completed value', async ({ page }) => {
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

  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  const listId = lists[0].id

  const createRes = await page.request.post('/api/todos', {
    data: { title: 'Invalid toggle', list_id: listId },
  })
  const created = await createRes.json()

  const res = await page.request.patch(`/api/todos/${created.id}`, {
    data: { completed: 'not-a-boolean' },
  })
  expect(res.status()).toBe(400)
})

test('DELETE /api/todos/:id deletes a todo', async ({ page }) => {
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

  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  const listId = lists[0].id

  const createRes = await page.request.post('/api/todos', {
    data: { title: 'Delete via API', list_id: listId },
  })
  const created = await createRes.json()

  const res = await page.request.delete(`/api/todos/${created.id}`)
  expect(res.status()).toBe(204)

  // Verify it's gone
  const todosRes = await page.request.get(`/api/todos?list_id=${listId}`)
  const todos = await todosRes.json()
  expect(todos.find((t: { id: string }) => t.id === created.id)).toBeUndefined()
})

test('POST /api/todos rejects missing title', async ({ page }) => {
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

  const listsRes = await page.request.get('/api/lists')
  const lists = await listsRes.json()
  const listId = lists[0].id

  const res = await page.request.post('/api/todos', {
    data: { list_id: listId },
  })
  expect(res.status()).toBe(400)
})

test('POST /api/todos rejects missing list_id', async ({ page }) => {
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

  const res = await page.request.post('/api/todos', {
    data: { title: 'No list id' },
  })
  expect(res.status()).toBe(400)
})

test('GET /api/todos returns 404 for non-existent list', async ({ page }) => {
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

  const res = await page.request.get('/api/todos?list_id=00000000-0000-0000-0000-000000000000')
  expect(res.status()).toBe(404)
})
