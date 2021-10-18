import { findFiles } from './find-files'
import { resolve } from 'path'
import { scanForTodos } from './scan-for-todos'
import { groupTodosToIssues } from './group-todos-to-issues'
import { syncWithGitHub } from './sync-with-github'
import { MockGithubClient } from './mock-github'
import { readConfig } from './config'

describe('syncWithGithub', () => {
  it('syncs', async () => {
    const root = resolve(__dirname, '../sample')
    const config = await readConfig(root)
    const files = await findFiles(root, config.filePatterns)
    const todos = await scanForTodos(root, files)
    const issues = groupTodosToIssues(todos)
    const mockGithubClient = new MockGithubClient()
    await syncWithGitHub(issues, mockGithubClient, config.repo, 'TODO', 'master')
    expect(mockGithubClient.log).toMatchSnapshot()
  })
})
