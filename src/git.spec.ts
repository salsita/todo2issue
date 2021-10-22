import { getCurrentBranchName } from './git'
import { resolve } from 'path'

describe('getCurrentBranchName', () => {
  it('gets something', async () => {
    const branchName = await getCurrentBranchName(resolve(__dirname,'../sample'))
    expect(typeof branchName).toBe('string')
    expect(branchName.includes(' ')).toBe(false)
  })
})
