import { config as loadDotenv } from 'dotenv'
import { resolve } from 'path'
import { readFile } from 'fs/promises'
import { promisify } from 'util'
import readJson from 'read-package-json'
import gitUrlParse from 'git-url-parse'

const readJsonAsync = promisify(readJson)

loadDotenv({
  path: resolve(process.cwd(), '.env')
})

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export interface GitRepository {
  name: string
  owner: string
}

export interface Config {
  filePatterns: string[]
  repo: GitRepository
}

const defaultConfig: Partial<Config> = {
  filePatterns: ['**/*.[tj]s?(x)']
}

export async function readConfig (root: string): Promise<Config> {
  const {
    repository,
    todo2issue: {
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
  return {
    filePatterns,
    repo: { name, owner }
  }
}
