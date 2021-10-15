import { scanForTodos } from './scan-for-todos'
import { resolve } from 'path'

describe('scanForTodos', () => {
  it('finds all TODOs', async () => {
    const todos = await scanForTodos(resolve(__dirname, '../sample'), ['src/index.ts'])
    console.log(JSON.stringify(todos, null, 2))
    expect(todos).toMatchSnapshot()
  })
})
