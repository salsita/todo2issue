#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { findFiles } from './find-files'
import { scanForTodos } from './scan-for-todos'
import { groupTodosToIssues } from './group-todos-to-issues'
import { syncWithGitHub } from './sync-with-github'
import { updateReferences } from './update-references'
import { readConfig } from './config'
import { RestGithubClient } from './github'
import { WriteMockGithubClient } from './mock-github'

async function run (args: string[]) {
  const { argv } = yargs(args).options({
    't': {
      type: 'string',
      alias: 'token',
      description: 'GitHub personal token\ndefaults to GITHUB_TOKEN environment variable\n(.env file supported)'
    },
    'r': {
      type: 'string',
      alias: 'root',
      description: 'root directory of the project that should be synchronized\ndefaults to current directory'
    },
    'd': {
      type: 'boolean',
      default: false,
      alias: 'dry-run',
      description: 'simulate GitHub operations; generates new issue numbers locally'
    }
  })
  const token = argv['token']
  const root = argv['root'] ?? process.cwd()
  const dryRun = argv['dry-run']
  const overwriteBody = argv['overwrite-body']

  const config = await readConfig(root, token)
  const files = await findFiles(root, config.filePatterns)
  const todos = await scanForTodos(root, files)
  const issues = groupTodosToIssues(todos)

  const githubClient = new RestGithubClient(config.repo, config.githubToken)
  const mockGithubClient = new WriteMockGithubClient(githubClient)
  try {
    await syncWithGitHub(
      issues,
      dryRun ? mockGithubClient : githubClient,
      config.repo,
      config.issueLabel,
      config.branch,
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

