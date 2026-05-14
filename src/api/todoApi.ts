import api from './api'

// GET TODOS
export const getTodos = (params?: any) => {
  return api.get('/todos', { params })
}

// CREATE TODO
export const createTodo = (data: any) => {
  return api.post('/todos', data)
}

// UPDATE TODO
export const updateTodo = (id: number, data: any) => {
  return api.put(`/todos/${id}`, data)
}

// DELETE TODO
export const deleteTodo = (id: number) => {
  return api.delete(`/todos/${id}`)
}
