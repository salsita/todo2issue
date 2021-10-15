import { getCurrentCommitHash } from './git'
import { resolve } from 'path'


describe('getCurrentCommitHash', () => {
  it('gets something', async () => {
    const hash = await getCurrentCommitHash(resolve(__dirname,'../sample'))
    expect(hash.length).toBe(40)
  })
})
