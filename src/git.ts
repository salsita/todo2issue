import spawnAsync from '@expo/spawn-async'

export async function getCurrentBranchName (root: string) {
  const { stdout } = await spawnAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: root
  })
  return stdout.trim()
}
