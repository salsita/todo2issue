import { Issue, Todo } from './model'

export function groupTodosToIssues(todos: Todo[]): Issue[] {
  const issues: Issue[] = []
  const issuesByNumber = new Map<number, Issue>()
  todos
    .filter((todo) => !!todo.issueNumber)
    .forEach((todo) => {
      let issue = issuesByNumber.get(todo.issueNumber!)
      if (!issue) {
        issue = { todos: [], issueNumber: todo.issueNumber }
        issuesByNumber.set(todo.issueNumber!, issue)
        issues.push(issue)
      }

      issue.todos.push(todo)
    })

  const issuesByText = new Map<string, Issue>()

  Array.from(issuesByNumber.values()).forEach((issue) => {
    issue.todos.forEach((todo) => issuesByText.set(todo.text, issue))
  })

  todos
    .filter((todo) => !todo.issueNumber)
    .forEach((todo) => {
      let issue = issuesByText.get(todo.text)
      if (!issue) {
        issue = { todos: [] }
        issuesByText.set(todo.text, issue)
        issues.push(issue)
      }
      issue.todos.push(todo)
    })

  return issues
}
