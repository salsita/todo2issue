import { getCurrentBranchName, parseBlameInfo } from './git'
import { resolve } from 'path'

describe('getCurrentBranchName', () => {
  it('gets something', async () => {
    const branchName = await getCurrentBranchName(resolve(__dirname, '../'))
    expect(typeof branchName).toBe('string')
    expect(branchName.includes(' ')).toBe(false)
  })
})

describe('parseBlameInfo', () => {
  it('parses blame info', async () => {
    const mockBlameOutput = `aa73a7deb88f1487c0006abcd3b684bf91c2266e 1 1 2
author Jiří Staniševský
author-mail <jirist@salsitasoft.com>
author-time 1634279203
author-tz +0200
committer Jiří Staniševský
committer-mail <jirist@salsitasoft.com>
committer-time 1634279340
committer-tz +0200
summary Add sample "code-base"
boundary
filename sample/src/index.ts
\t// TODO Single line todo comment
aa73a7deb88f1487c0006abcd3b684bf91c2266e 2 2
author Jiří Staniševský
author-mail <jirist@salsitasoft.com>
author-time 1634279203
author-tz +0200
committer Jiří Staniševský
committer-mail <jirist@salsitasoft.com>
committer-time 1634279340
committer-tz +0200
summary Add sample "code-base"
boundary
filename sample/src/index.ts
\t// TODO(#123) Single line todo comment with reference
be1ec0218067e7152167afaf1de0f84e6c55fd43 4 4 2
author Jiří Staniševský
author-mail <jirist@salsitasoft.com>
author-time 1634279489
author-tz +0200
committer Jiří Staniševský
committer-mail <jirist@salsitasoft.com>
committer-time 1634281973
committer-tz +0200
summary Scanning WiP
previous aa73a7deb88f1487c0006abcd3b684bf91c2266e sample/src/index.ts
filename sample/src/index.ts
\t// TODO(#123) Same reference different comment
be1ec0218067e7152167afaf1de0f84e6c55fd43 5 5
author Jiří Staniševský
author-mail <jirist@salsitasoft.com>
author-time 1634279489
author-tz +0200
committer Jiří Staniševský
committer-mail <jirist@salsitasoft.com>
committer-time 1634281973
committer-tz +0200
summary Scanning WiP
previous aa73a7deb88f1487c0006abcd3b684bf91c2266e sample/src/index.ts
filename sample/src/index.ts
\t// TODO Same reference different comment`

    expect(parseBlameInfo(mockBlameOutput)).toMatchSnapshot()
  })
})


