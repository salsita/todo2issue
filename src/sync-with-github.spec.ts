import { findFiles } from './find-files'
import { resolve } from 'path'
import { scanForTodos } from './scan-for-todos'
import { groupTodosToIssues } from './group-todos-to-issues'
import { syncWithGitHub } from './sync-with-github'
import { MockGithubClient } from './mock-github'
import { updateReferences } from './update-references'

describe('syncWithGithub', () => {
  it('syncs', async () => {
    const root = resolve(__dirname, '../sample')
    const files = await findFiles(root, ['**/*.[tj]s?(x)'])
    const todos = await scanForTodos(root, files)
    const issues = groupTodosToIssues(todos)
    const mockGithubClient = new MockGithubClient()
    await syncWithGitHub(issues, mockGithubClient, 'TODO')
    expect(mockGithubClient.log).toMatchSnapshot()

    await updateReferences(root,issues)
  })
})
