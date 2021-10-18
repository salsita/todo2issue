import { groupTodosByFile, Issue } from './model'
import { Octokit } from '@octokit/rest'
import { GitRepository } from './config'

export interface PartialGithubIssue {
  issueNumber: number
  body: string
}

export interface GithubClient {
  createIssue (issue: Issue, issueLabel: string, body: string): Promise<number>

  updateIssue (issueNumber: number, body: string): Promise<void>

  listOpenTodoIssues (issueLabel: string): Promise<PartialGithubIssue[]>

  closeIssue (issueNumber: number)
}

export class RestGithubClient implements GithubClient {
  private readonly octokit

  constructor (
    private readonly repo: GitRepository,
    personalToken: string
  ) {
    this.octokit = new Octokit({ auth: personalToken })
  }

  async closeIssue (issueNumber: number) {
    await this.octokit.rest.issues.update({
      owner: this.repo.owner,
      repo: this.repo.name,
      issue_number: issueNumber,
      state: 'closed'
    })
  }

  async createIssue (issue: Issue, issueLabel: string, body: string): Promise<number> {
    const { data } = await this.octokit.rest.issues.create({
      owner: this.repo.owner,
      repo: this.repo.name,
      title: issue.todos[0].text,
      labels: [issueLabel],
      body
    })
    return data.number
  }

  async updateIssue (issueNumber: number, body: string): Promise<void> {
    const { data } = await this.octokit.rest.issues.update({
      issue_number: issueNumber,
      owner: this.repo.owner,
      repo: this.repo.name,
      body
    })
    return data.number
  }

  async listOpenTodoIssues (issueLabel: string): Promise<PartialGithubIssue[]> {
    const partialIssues: PartialGithubIssue[] = []
    let lastPageSize = 100
    let page = 0
    while (lastPageSize === 100) {
      page++
      const { data } = await this.octokit.rest.issues.listForRepo({
        owner: this.repo.owner,
        repo: this.repo.name,
        labels: [issueLabel],
        per_page: 100,
        page
      })
      lastPageSize = data.length
      partialIssues.push(...data.map(({ number, body }) => ({ issueNumber: number, body })))
    }

    return partialIssues
  }
}
