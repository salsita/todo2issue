import { GithubClient, PartialGithubIssue } from './github'
import { Issue } from './model'

const mockIssues: PartialGithubIssue[] = [
  {issueNumber: 123, body: 'Some'},
  {issueNumber: 124, body: 'Somewhat else'},
  {issueNumber: 125, body: 'Completely else'},
  {issueNumber: 126, body: 'Different league'},
]

export class MockGithubClient implements GithubClient {
  protected issueNumberCounter: number | null = null
  public readonly log: string[] = []

  async createIssue (issue: Issue, issueLabel: string, body: string): Promise<number> {
    if(this.issueNumberCounter === null) {
      this.issueNumberCounter = 0
    }
    const issueNumber = ++this.issueNumberCounter
    this.log.push(`created issue #${issueNumber} for\n${JSON.stringify(issue, null, 2)}`)
    return issueNumber
  }

  async updateIssue (issueNumber: number, body: string): Promise<void> {
    this.log.push(`updated issue #${issueNumber}`)
  }

  async listOpenTodoIssues (issueLabel: string): Promise<PartialGithubIssue[]> {
    this.log.push(`listed issues ${mockIssues.map(issue => `#${issue.issueNumber}`).join(', ')}`)
    return mockIssues
  }

  async closeIssue (issueNumber: number) {
    this.log.push(`close issues #${issueNumber}`)
  }
}

export class WriteMockGithubClient extends MockGithubClient {
  constructor (
    private realClient: GithubClient,
    sequenceStart?: number,
    private readonly sequenceEnd?: number
  ) {
    super()
    if (sequenceStart) {
      this.issueNumberCounter = sequenceStart - 1
    }
  }

  async createIssue (issue: Issue, issueLabel: string, commitish: string): Promise<number> {
    if(this.issueNumberCounter === null) {
      const existingIssues = await this.realClient.listOpenTodoIssues(issueLabel)
      this.issueNumberCounter = Math.max(0, ...existingIssues.map(issue => issue.issueNumber))
    }
    if (this.issueNumberCounter >= this.sequenceEnd) {
      throw new Error('sequence exhausted')
    }
    return super.createIssue(issue, issueLabel, commitish);
  }

  async listOpenTodoIssues (issueLabel: string): Promise<PartialGithubIssue[]> {
    return this.realClient.listOpenTodoIssues(issueLabel);
  }
}
