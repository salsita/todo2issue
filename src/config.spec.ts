import { readConfig } from './config'
import { resolve } from 'path'

describe('readRepositoryConfig', () => {
  it('reads', async () => {
    const { githubToken, ...rest } = await readConfig(resolve(__dirname, '../sample'))
    expect(githubToken?.length).toBeGreaterThan(5)
    expect(rest).toMatchSnapshot()
  })
})
