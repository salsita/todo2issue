export interface Todo {
  filename: string
  line: number
  text: string
  tag: string
  issueNumber?: number
}

export interface Issue {
  todos: Todo[]
  issueNumber?: number
}


