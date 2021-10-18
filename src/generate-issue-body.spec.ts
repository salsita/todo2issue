import { readConfig } from './config'
import { resolve } from 'path'
import { generateIssueBody } from './generate-issue-body'


describe('generateIssueBody', () => {
  it('generates description of issue', async () => {
    const config = await readConfig(resolve(__dirname, '../sample'))
    const body = generateIssueBody({
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
    expect(body).toMatchSnapshot()
  })
})

