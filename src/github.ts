import { groupTodosByFile, Issue } from './model'
import { Octokit } from '@octokit/rest'
import { GitRepository } from './config'

export interface GithubClient {
  createIssue (issue: Issue, issueLabel: string, commitHash: string): Promise<number>

  listOpenTodoIssueNumbers (issueLabel: string): Promise<number[]>

  closeIssue (issueNumber: number)
}

export function formatIssueBody (issue: Issue, repo: GitRepository, commitHash: string): string {
  const todosByFile = groupTodosByFile(issue.todos)
  const fileOccurrences = Array.from(todosByFile.entries())
    .map(([filename, todos]) => {
      const todoOccurrences = todos.map(todo =>
        `-  [line ${todo.line}](https://github.com/${repo.owner}/${repo.name}/blob/${commitHash}/${filename}#L${todo.line}) - ${todo.text}`
      )
      return `
### \`${filename}\`

${todoOccurrences.join('\n')}
 `
}).join('\n\n')
  return `
_This issue origins from a TODO within the code-base and was synchronized automatically._

## Occurrences
${fileOccurrences}
`
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

  async createIssue (issue: Issue, issueLabel: string, commitHash: string): Promise<number> {
    const { data } = await this.octokit.rest.issues.create({
      owner: this.repo.owner,
      repo: this.repo.name,
      title: issue.todos[0].text,
      labels: [issueLabel],
      body: formatIssueBody(issue, this.repo, commitHash)
    })
    return data.number
  }

  async listOpenTodoIssueNumbers (issueLabel: string): Promise<number[]> {
    const issueNumbers = []
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
      issueNumbers.push(...data.map(issue => issue.number))
    }

    return issueNumbers
  }
}
