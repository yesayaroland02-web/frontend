export interface Category {
  id: number
  name: string
}

export interface Todo {
  id: number
  title: string
  description?: string
  priority?: string
  completed: boolean

  category?: Category
}