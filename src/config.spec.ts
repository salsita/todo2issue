import { readConfig } from './config'
import { resolve } from 'path'

describe('readRepositoryConfig', () => {
  it('reads', async () => {
    const config = await readConfig(resolve(__dirname,'../sample'))
    expect(config).toMatchSnapshot()
  })
})
