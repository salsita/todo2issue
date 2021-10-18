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
    'x': { type: 'number', alias: 'first-generated-id' },
  })
  const token = argv['token']
  const root = argv['root']
  const dryRun = argv['dry-run']
  const firstGeneratedId = argv['first-generated-id']

  const config = await readConfig(root, token)
  const files = await findFiles(root, config.filePatterns)
  const todos = await scanForTodos(root, files)
  const issues = groupTodosToIssues(todos)
  const commitHash = await getCurrentCommitHash(root)

  const githubClient = new RestGithubClient(config.repo, config.githubToken)
  const mockGithubClient = new WriteMockGithubClient(githubClient, firstGeneratedId)
  try {
    await syncWithGitHub(
      issues,
      dryRun ? mockGithubClient : githubClient,
      config.issueLabel,
      commitHash
    )
  } finally {
    if (dryRun) {
      console.log(mockGithubClient.log.join('\n'))
    }
    await updateReferences(root, issues)
  }
}

run(process.argv.slice(2)).catch(console.error)

