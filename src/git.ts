import spawnAsync from '@expo/spawn-async'

export async function getCurrentCommitHash (root: string) {
  const { stdout } = await spawnAsync('git', ['rev-parse', '--verify', 'HEAD'], {
    cwd: root
  })
  return stdout.trim()
}
