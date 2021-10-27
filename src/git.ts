import spawnAsync from '@expo/spawn-async'

export async function getCurrentBranchName (root: string) {
  const { stdout } = await spawnAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: root
  })
  return stdout.trim()
}

export interface Contribution {
  name: string
  email: string
  time: number
  timeZone: string
}

export interface BlameInfo {
  commitHash: string
  filename: string
  lineStart: number
  lineEnd: number
  author: Contribution
  committer: Contribution
  summary: string
  text: string[]
}

const leadingLinePattern = /^([a-z0-9]{40}) ([0-9]+) ([0-9]+) ([0-9]+)$/
const keyValuePattern = /^([a-z\-]+) (.+)$/

const unwrapEmail = (email: string) => (/^<(.+)>$/.exec(email) ?? [undefined, email] as const)[1]

export function parseBlameInfo (blameOutput: string): BlameInfo[] {
  const results: BlameInfo[] = []
  let lastInfo: BlameInfo | null = null
  for (const line of blameOutput.split('\n')) {
    const [, commitHash, lineStart, lineEnd] = leadingLinePattern.exec(line) ?? []
    if (commitHash) {
      if (lastInfo != null) {
        results.push(lastInfo as BlameInfo)
      }
      lastInfo = {
        commitHash,
        lineStart: Number(lineStart),
        lineEnd: Number(lineEnd),
        text: [],
        author: {} as Contribution,
        committer: {} as Contribution,
        filename: undefined,
        summary: ''
      }
      continue
    }

    if (lastInfo == null) {
      continue
    }

    if (lastInfo.filename != undefined) {
      if (lastInfo.text.length <= (lastInfo.lineEnd - lastInfo.lineStart)) {
        lastInfo.text.push(line)
      }
      continue
    }

    const [, key, value] = keyValuePattern.exec(line) ?? []
    switch (key) {
      case 'author':
        lastInfo.author.name = value
        break
      case 'author-mail':
        lastInfo.author.email = unwrapEmail(value)
        break
      case 'author-time':
        lastInfo.author.time = Number(value)
        break
      case 'author-tz':
        lastInfo.author.timeZone = value
        break
      case 'committer':
        lastInfo.committer.name = unwrapEmail(value)
        break
      case 'committer-mail':
        lastInfo.committer.email = value
        break
      case 'committer-time':
        lastInfo.committer.time = Number(value)
        break
      case 'committer-tz':
        lastInfo.committer.timeZone = value
        break
      case 'summary':
        lastInfo.summary = value
        break
      case 'filename':
        lastInfo.filename = value
        break
    }
  }

  if (lastInfo != null) {
    results.push(lastInfo)
  }

  return results
}

export async function blameFile (root: string, filename: string, lines: number[]) {
  const args = [
    'blame',
    filename,
    ...lines.flatMap(line => ['-L', `${line},${line}`]),
    '--line-porcelain'
  ]
  const { stdout } = await spawnAsync('git', args, {
    cwd: root
  })
  return parseBlameInfo(stdout.trim())
}
