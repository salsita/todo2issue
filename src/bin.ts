import yargs from 'yargs/yargs'
import { findFiles } from './find-files'
import { scanForTodos } from './scan-for-todos'
import { groupTodosToIssues } from './group-todos-to-issues'
import { syncWithGitHub } from './sync-with-github'
import { updateReferences } from './update-references'
import { readConfig } from './config'
import { RestGithubClient } from './github'
import { getCurrentCommitHash } from './git'

async function run (args: string[]) {
  const { argv } = yargs(args).options({
    't': { type: 'string', alias: 'token' },
    'd': { type: 'string', default: process.cwd(), alias: 'directory' }
  })
  const root = argv['d']
  const token = argv['t']

  const config = await readConfig(root, token)
  const files = await findFiles(root, config.filePatterns)
  const todos = await scanForTodos(root, files)
  const issues = groupTodosToIssues(todos)
  const commitHash = await getCurrentCommitHash(root)

  const githubClient = new RestGithubClient(config.repo, config.githubToken)
  await syncWithGitHub(issues, githubClient, config.issueLabel, commitHash)
  await updateReferences(root, issues)
}

run(process.argv.slice(2)).catch(console.error)

