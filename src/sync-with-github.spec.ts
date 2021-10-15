import { Issue } from './model'
import { GithubClient } from './github'
import { findFiles } from './find-files'
import { resolve } from 'path'
import { scanForTodos } from './scan-for-todos'
import { groupTodosToIssues } from './group-todos-to-issues'
import { syncWithGitHub } from './sync-with-github'
import { MockGithubClient } from './mock-github'

describe('syncWithGithub', () => {
  it('syncs', async () => {
    const files = await findFiles(resolve(__dirname, '../sample'), ['**/*.[tj]s?(x)'])
    const todos = await scanForTodos(resolve(__dirname, '../sample'), files)
    const issues = groupTodosToIssues(todos)
    const mockGithubClient = new MockGithubClient()
    await syncWithGitHub(issues, mockGithubClient)
    expect(mockGithubClient.log).toMatchSnapshot()
  })
})
