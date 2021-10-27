import { scanForTodos } from './scan-for-todos'
import { resolve } from 'path'

describe('scanForTodos', () => {
  it('finds all TODOs', async () => {
    const todos = await scanForTodos(resolve(__dirname, '../'), ['sample/src/index.ts'])
    expect(todos).toMatchSnapshot()
  })
})
