export interface Todo {
  filename: string
  line: number
  text: string
  tag: string
  issueNumber?: number
  author?: string
}

export interface Issue {
  todos: Todo[]
  issueNumber?: number
  assignees?: string[]
}


export const groupTodosByFile = (todos: Todo[]) => todos.reduce(
  (map, todo) => {
    let fileUpdates = map.get(todo.filename)
    if (fileUpdates) {
      fileUpdates.push(todo)
    } else {
      fileUpdates = [todo]
      map.set(todo.filename, fileUpdates)
    }
    return map
  },
  new Map<string, Todo[]>()
)
