#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { findFiles } from './find-files'
import { scanForTodos } from './scan-for-todos'
import { groupTodosToIssues } from './group-todos-to-issues'
import { syncWithGitHub } from './sync-with-github'
import { updateReferences } from './update-references'
import { readConfig } from './config'
import { RestGithubClient } from './github'
import { getCurrentCommitHash } from './git'
import { WriteMockGithubClient } from './mock-github'

async function run (args: string[]) {
  const { argv } = yargs(args).options({
    't': { type: 'string', alias: 'token' },
    'r': { type: 'string', default: process.cwd(), alias: 'root' },
    'd': { type: 'boolean', default: false, alias: 'dry-run' },
    'o': { type: 'boolean', default: false, alias: 'overwrite-body' },
    's': { type: 'string', alias: 'sequence' },
    'c': { type: 'string', alias: 'commitish' }
  })
  const token = argv['token']
  const root = argv['root']
  const dryRun = argv['dry-run']
  const overwriteBody = argv['overwrite-body']
  const [sequenceStart, sequenceEnd] = argv['sequence']?.split(':').map(Number) ?? []
  const commitish = argv['commitish'] ?? await getCurrentCommitHash(root)

  const config = await readConfig(root, token)
  const files = await findFiles(root, config.filePatterns)
  const todos = await scanForTodos(root, files)
  const issues = groupTodosToIssues(todos)

  const githubClient = new RestGithubClient(config.repo, config.githubToken)
  const mockGithubClient = new WriteMockGithubClient(githubClient, sequenceStart, sequenceEnd)
  try {
    await syncWithGitHub(
      issues,
      dryRun ? mockGithubClient : githubClient,
      config.repo,
      config.issueLabel,
      commitish,
      overwriteBody
    )
  } catch (e) {
    console.error(e)
  } finally {
    if (dryRun) {
      console.log(mockGithubClient.log.join('\n'))
    }
    await updateReferences(root, issues)
  }
}

run(process.argv.slice(2)).catch(console.error)

