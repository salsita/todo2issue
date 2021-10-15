import globby from 'globby'

export function findFiles(root: string, patterns: string[]): Promise<string[]> {
  return globby(patterns, {
    cwd: root,
    expandDirectories: false,
    gitignore: true
  })
}
