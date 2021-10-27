import { resolve } from 'path'
import { Todo } from './model'
import { findAuthors } from './find-authors'

describe('findAuthors', () => {
  it('finds authors', async () => {

    const root = resolve(__dirname, '../')
    const todos: Todo[] = [
      {
        line: 1,
        text: 'A',
        tag: 'TODO',
        filename: 'sample/src/index.ts'
      },
      {
        line: 4,
        text: 'B',
        tag: 'TODO',
        filename: 'sample/src/index.ts'
      },
      {
        line: 1,
        text: 'C',
        tag: 'TODO',
        filename: 'sample/src/helpers/helper.ts'
      },
      {
        line: 16,
        text: 'line comments',
        tag: 'TODO',
        filename: 'sample/src/index.ts'
      }
    ]
    await findAuthors(root, todos, {'jirist@salsitasoft.com': 'goce-cz'})
    expect(todos).toMatchSnapshot()
  })
})
