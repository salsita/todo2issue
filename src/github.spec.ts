import { formatIssueBody, RestGithubClient } from './github'
import { readConfig } from './config'
import { resolve } from 'path'

describe('listOpenTodoIssueNumbers', () => {
  it.skip('lists issues', async () => {
    const config = await readConfig(resolve(__dirname, '../sample'))
    const client = new RestGithubClient(config.repo, config.githubToken)
    const issueNumbers = await client.listOpenTodoIssueNumbers(config.issueLabel)
    console.log(issueNumbers)
  })
})


describe('createIssue', () => {
  it.skip('create issue', async () => {
    const config = await readConfig(resolve(__dirname, '../sample'))
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
    }, config.issueLabel, 'master')
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

describe('formatIssueBody', () => {
  it.skip('formats description of issue', async () => {
    const config = await readConfig(resolve(__dirname, '../sample'))
    const body = formatIssueBody({
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
    }, config.repo, 'master')
    console.log(body)
  })
})
