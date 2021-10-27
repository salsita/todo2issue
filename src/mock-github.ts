import { GithubClient, PartialGithubIssue } from './github'
import { Issue } from './model'

export class MockGithubClient implements GithubClient {
  protected issueNumberCounter: number | null = null
  public readonly log: string[] = []

  constructor (private readonly mockIssues: PartialGithubIssue[]) {
  }

  async createIssue (issue: Issue, issueLabel: string, body: string): Promise<number> {
    if(this.issueNumberCounter === null) {
      this.issueNumberCounter = 0
    }
    const issueNumber = ++this.issueNumberCounter
    this.log.push(`created issue #${issueNumber} for\n${JSON.stringify(issue, null, 2)}`)
    return issueNumber
  }

  async updateIssue (issue: Issue, body: string): Promise<void> {
    this.log.push(`updated issue #${issue.issueNumber}`)
  }

  async listOpenTodoIssues (issueLabel: string): Promise<PartialGithubIssue[]> {
    this.log.push(`listed issues ${this.mockIssues.map(issue => `#${issue.issueNumber}`).join(', ')}`)
    return this.mockIssues
  }

  async closeIssue (issueNumber: number) {
    this.log.push(`close issues #${issueNumber}`)
  }
}

export class WriteMockGithubClient extends MockGithubClient {
  constructor (
    private realClient: GithubClient
  ) {
    super([])
  }

  async createIssue (issue: Issue, issueLabel: string, body: string): Promise<number> {
    if(this.issueNumberCounter === null) {
      const existingIssues = await this.realClient.listOpenTodoIssues(issueLabel)
      this.issueNumberCounter = Math.max(0, ...existingIssues.map(issue => issue.issueNumber))
    }
    return super.createIssue(issue, issueLabel, body);
  }

  async listOpenTodoIssues (issueLabel: string): Promise<PartialGithubIssue[]> {
    return this.realClient.listOpenTodoIssues(issueLabel);
  }
}
