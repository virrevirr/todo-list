export type List = {
  id: string
  user_id: string
  title: string
  created_at: string
}

export type Todo = {
  id: string
  list_id: string
  user_id: string
  title: string
  completed: boolean
  created_at: string
}
