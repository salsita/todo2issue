import { parse as parseDotenv } from 'dotenv'
import { resolve } from 'path'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import readJson from 'read-package-json'
import gitUrlParse from 'git-url-parse'

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
}

const defaultConfig: Partial<Config> = {
  filePatterns: ['**/*.[tj]s?(x)'],
  issueLabel: 'TODO'
}

export async function readConfig (root: string): Promise<Config> {
  const envFile = resolve(root,'.env')
  const dotenv = existsSync(envFile) && parseDotenv(await readFile(envFile))
  const githubToken = process.env.GITHUB_TOKEN ?? dotenv.GITHUB_TOKEN

  const {
    repository,
    todo2issue: {
      issueLabel = defaultConfig.issueLabel,
      filePatterns = defaultConfig.filePatterns
    } = defaultConfig
  } = await readJsonAsync(resolve(root, 'package.json'))

  if (!repository?.url) {
    throw new Error(`'repository.url' missing in 'package.json'`)
  }

  const { name, owner } = gitUrlParse(repository?.url)

  if (!Array.isArray(filePatterns) || filePatterns.some(pattern => typeof pattern !== 'string')) {
    throw new Error(`'todo2issue.filePatterns' property is expected to be an array of glob patterns`)
  }

  if (typeof issueLabel !== 'string' || issueLabel.trim() === '') {
    throw new Error(`'todo2issue.issueLabel' property must be a non-empty string`)
  }

  if (!githubToken || issueLabel.trim() === '') {
    throw new Error(`Github personal token missing, please provide it through 'GITHUB_TOKEN' environment variable ('.env' is supported)`)
  }

  return {
    githubToken,
    filePatterns,
    issueLabel,
    repo: { name, owner }
  }
}
