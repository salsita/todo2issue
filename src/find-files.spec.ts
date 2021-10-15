import { resolve } from 'path'
import { findFiles } from './find-files'

describe('findFiles', () => {
  it('finds files while respecting .gitignore', async () => {
    const files = await findFiles(resolve(__dirname, '../sample'), ['**/*.[tj]s?(x)'])
    expect(files.sort()).toEqual([
      'src/helpers/helper.ts',
      'src/index.ts'
    ])
  })
})
