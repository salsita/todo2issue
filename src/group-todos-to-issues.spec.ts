import { groupTodosToIssues } from './group-todos-to-issues'
import { scanForTodos } from './scan-for-todos'
import { resolve } from 'path'
import { findFiles } from './find-files'

describe('groupTodosToIssues',() => {
  it('groups', async () => {
    const files = await findFiles(resolve(__dirname, '../sample'), ['**/*.[tj]s?(x)'])
    const todos = await scanForTodos(resolve(__dirname, '../sample'), files)
    const issues = groupTodosToIssues(todos)
    console.log(Object.fromEntries(
      issues.map(issue => [issue.todos[0].text,issue.todos.length])
    ))
  })
})
