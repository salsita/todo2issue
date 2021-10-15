import { groupTodosToIssues } from './group-todos-to-issues'
import { scanForTodos } from './scan-for-todos'
import { resolve } from 'path'
import { findFiles } from './find-files'

describe('groupTodosToIssues',() => {
  it('groups', async () => {
    const files = await findFiles(resolve(__dirname, '../sample'), ['**/*.[tj]s?(x)'])
    const todos = await scanForTodos(resolve(__dirname, '../sample'), files)
    const issues = groupTodosToIssues(todos)
    expect(issues).toMatchSnapshot()
  })
})
