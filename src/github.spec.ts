import { RestGithubClient } from './github'
import { readConfig } from './config'
import { resolve } from 'path'
import { collectAssignees } from './sync-with-github'
import { Issue } from './model'

describe('listOpenTodoIssueNumbers', () => {
  it.skip('lists issues', async () => {
    const config = await readConfig(resolve(__dirname, '../sample'))
    const client = new RestGithubClient(config.repo, config.githubToken)
    const issueNumbers = await client.listOpenTodoIssues(config.issueLabel)
    console.log(issueNumbers)
  })
})


describe('createIssue', () => {
  it.skip('create issue', async () => {
    const config = await readConfig(resolve(__dirname, '../'))
    const client = new RestGithubClient(config.repo, config.githubToken)
    const issueNumber = await client.createIssue({
      todos: [
        {
          'filename': 'sample/src/index.ts',
          'line': 1,
          'tag': 'TODO',
          'text': 'Single line todo comment'
        },
        {
          'filename': 'sample/src/index.ts',
          'line': 2,
          'tag': 'TODO',
          'text': 'Single line todo comment with reference'
        }
      ]
    }, config.issueLabel, 'master', undefined)
    console.log(issueNumber)
  })
})

describe('updateIssue', () => {
  it.skip('update issue', async () => {
    const config = await readConfig(resolve(__dirname, '../'))
    const client = new RestGithubClient(config.repo, config.githubToken)
    const issue: Issue = {
      issueNumber: 19,
      todos: [
        {
          filename: 'sample/src/index.ts',
          line: 1,
          tag: 'TODO',
          text: 'Single line todo comment',
          author: 'goce-cz'
        },
        {
          filename: 'sample/src/index.ts',
          line: 2,
          tag: 'TODO',
          text: 'Single line todo comment with reference',
          author: 'goce-cz'
        }
      ]
    }
    const issueNumber = await client.updateIssue(issue, 'master', collectAssignees(issue.todos))
    console.log(issueNumber)
  })
})

describe('closeIssue', () => {
  it.skip('closes issue', async () => {
    const config = await readConfig(resolve(__dirname, '../sample'))
    const client = new RestGithubClient(config.repo, config.githubToken)
    await client.closeIssue(2)
  })
})
