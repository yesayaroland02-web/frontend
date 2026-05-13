import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Popconfirm,
  message,
  Checkbox,
} from 'antd'

import { useEffect, useState } from 'react'
import api from '../api/api'

import type { Todo, Category } from '../types/todo'

const { Search } = Input

function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [open, setOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [submitting, setSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const [form] = Form.useForm()

  // =====================
  // FETCH CATEGORIES (ONCE)
  // =====================
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data)
      } catch (err) {
        console.log(err)
        message.error('Failed to fetch categories')
      }
    }

    loadCategories()
  }, [])

  // =====================
  // FETCH TODOS (DEPEND ON FILTER)
  // =====================
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const res = await api.get('/todos', {
          params: {
            category: selectedCategory || undefined,
          },
        })

        setTodos(res.data)
      } catch (err) {
        console.log(err)
        message.error('Failed to fetch todos')
      }
    }

    loadTodos()
  }, [selectedCategory])

  // =====================
  // CREATE / UPDATE
  // =====================
  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      const values = await form.validateFields()

      if (editingTodo) {
        await api.put(`/todos/${editingTodo.id}`, values)
        message.success('Todo updated')
      } else {
        await api.post('/todos', values)
        message.success('Todo created')
      }

      form.resetFields()
      setEditingTodo(null)
      setOpen(false)

      const res = await api.get('/todos', {
        params: {
          category: selectedCategory || undefined,
        },
      })

      setTodos(res.data)
    } catch (err) {
      console.log(err)
      message.error('Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  // =====================
  // DELETE
  // =====================
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/todos/${id}`)
      message.success('Todo deleted')

      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.log(err)
      message.error('Delete failed')
    }
  }

  // =====================
  // TOGGLE
  // =====================
  const handleToggle = async (id: number) => {
    try {
      await api.patch(`/todos/${id}/toggle`)

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completed: !t.completed }
            : t
        )
      )
    } catch (err) {
      console.log(err)
      message.error('Toggle failed')
    }
  }

  // =====================
  // EDIT
  // =====================
  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)

    form.setFieldsValue({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      category_id: todo.category?.id,
    })

    setOpen(true)
  }

  // =====================
  // FILTER + PAGINATION
  // =====================
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  )

  const pageSize = 5

  const paginatedTodos = filteredTodos.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  return (
    <div style={{ padding: 20 }}>
      <Card title="Industrix Todo App">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* TOP BAR */}
          <Space style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Search placeholder="Search todo" onSearch={setSearch} style={{ width: 250 }} />

            <Select
              placeholder="Filter Category"
              allowClear
              style={{ width: 200 }}
              onChange={(value) => setSelectedCategory(value || null)}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>

            <Button
              type="primary"
              onClick={() => {
                form.resetFields()
                setEditingTodo(null)
                setOpen(true)
              }}
            >
              Add Todo
            </Button>
          </Space>

          {/* TABLE */}
          <Table
            dataSource={paginatedTodos}
            rowKey="id"
            pagination={false}
            scroll={{ x: true }}
            columns={[
              {
                title: 'Done',
                render: (_, record) => (
                  <Checkbox
                    checked={record.completed}
                    onChange={() => handleToggle(record.id)}
                  />
                ),
              },
              { title: 'Title', dataIndex: 'title' },
              { title: 'Description', dataIndex: 'description' },
              {
                title: 'Priority',
                dataIndex: 'priority',
                render: (p) => <Tag>{p}</Tag>,
              },
              {
                title: 'Category',
                render: (_, record) => record.category?.name || '-',
              },
              {
                title: 'Status',
                render: (_, record) => (
                  <Tag>{record.completed ? 'Completed' : 'Pending'}</Tag>
                ),
              },
              {
                title: 'Action',
                render: (_, record) => (
                  <Space>
                    <Button onClick={() => handleEdit(record)}>Edit</Button>

                    <Popconfirm
                      title="Delete todo?"
                      onConfirm={() => handleDelete(record.id)}
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />

          {/* PAGINATION */}
          <Pagination
            current={page}
            pageSize={pageSize}
            total={filteredTodos.length}
            onChange={setPage}
          />
        </Space>
      </Card>

      {/* MODAL */}
      <Modal
        open={open}
        title={editingTodo ? 'Edit Todo' : 'Create Todo'}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        confirmLoading={submitting}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Priority" name="priority">
            <Select>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category_id">
            <Select allowClear>
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DashboardPage