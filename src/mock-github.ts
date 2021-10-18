import { GithubClient } from './github'
import { Issue } from './model'

export class MockGithubClient implements GithubClient {
  protected issueNumberCounter = 0
  public readonly log: string[] = []

  async createIssue (issue: Issue, issueLabel: string, commitHash: string): Promise<number> {
    const issueNumber = ++this.issueNumberCounter
    this.log.push(`created issue #${issueNumber} for\n${JSON.stringify(issue, null, 2)}`)
    return issueNumber
  }

  async listOpenTodoIssueNumbers (issueLabel: string): Promise<number[]> {
    const issueNumbers = [123, 124, 125, 126]
    this.log.push(`listed issues ${issueNumbers.map(issueNumber => `#${issueNumber}`).join(', ')}`)
    return issueNumbers
  }

  async closeIssue (issueNumber: number) {
    this.log.push(`close issues #${issueNumber}`)
  }
}

export class WriteMockGithubClient extends MockGithubClient {
  constructor (private realClient: GithubClient, firstGeneratedId?: number) {
    super()
    if (firstGeneratedId) {
      this.issueNumberCounter = firstGeneratedId - 1
    }
  }

  async createIssue (issue: Issue, issueLabel: string, commitHash: string): Promise<number> {
    if(this.issueNumberCounter === 0) {
      this.issueNumberCounter = Math.max(1, ...(await this.realClient.listOpenTodoIssueNumbers(issueLabel)))
    }
    return super.createIssue(issue, issueLabel, commitHash);
  }

  async listOpenTodoIssueNumbers (issueLabel: string): Promise<number[]> {
    return this.realClient.listOpenTodoIssueNumbers(issueLabel);
  }
}
