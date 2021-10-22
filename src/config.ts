import { parse as parseDotenv } from 'dotenv'
import { resolve } from 'path'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import readJson from 'read-package-json'
import gitUrlParse from 'git-url-parse'
import { getCurrentBranchName } from './git'

const readJsonAsync = promisify(readJson)

export interface GitRepository {
  name: string
  owner: string
}

export interface Config {
  githubToken: string
  filePatterns: string[]
  repo: GitRepository
  issueLabel: string
  branch: string
}

const defaultConfig: Partial<Config> = {
  filePatterns: ['**/*.[tj]s?(x)'],
  issueLabel: 'TODO'
}

async function readGithubToken (root: string): Promise<string | undefined> {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN
  }
  const envFile = resolve(root, '.env')
  const dotenv = existsSync(envFile) && parseDotenv(await readFile(envFile))
  return dotenv?.GITHUB_TOKEN
}

export async function readConfig (root: string, githubTokenOverride?: string): Promise<Config> {
  const githubToken = githubTokenOverride ?? await readGithubToken(root)
  if (!githubToken || githubToken.trim() === '') {
    throw new Error(`Github personal token missing, please provide it either through 'GITHUB_TOKEN' environment variable ('.env' is supported) or as a '--token' command line option`)
  }

  const {
    repository,
    todo2issue: {
      issueLabel = defaultConfig.issueLabel,
      filePatterns = defaultConfig.filePatterns,
      branch = await getCurrentBranchName(root)
    } = defaultConfig,
  } = await readJsonAsync(resolve(root, 'package.json'))

  if (!repository?.url) {
    throw new Error(`'repository.url' missing in 'package.json'`)
  }

  if (!branch) {
    throw new Error(`Branch name could not be determined, please specify it either in 'package.json/todo2issue.branch' or via '--branch' command line option`)
  }

  const { name, owner } = gitUrlParse(repository?.url)

  if (!Array.isArray(filePatterns) || filePatterns.some(pattern => typeof pattern !== 'string')) {
    throw new Error(`'package.json/todo2issue.filePatterns' property is expected to be an array of glob patterns`)
  }

  if (typeof issueLabel !== 'string' || issueLabel.trim() === '') {
    throw new Error(`'package.json/todo2issue.issueLabel' property must be a non-empty string`)
  }

  return {
    githubToken,
    branch,
    filePatterns,
    issueLabel,
    repo: { name, owner }
  }
}
