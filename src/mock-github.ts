import { GithubClient } from './github'
import { Issue } from './model'

export class MockGithubClient implements GithubClient {
  private issueNumberCounter = 0
  public readonly log: string[] = []

  async createIssue (issue: Issue): Promise<number> {
    const issueNumber = ++this.issueNumberCounter
    this.log.push(`created issue #${issueNumber} for ${issue.todos[0].text}`)
    return issueNumber
  }

  async listOpenTodoIssueNumbers (): Promise<number[]> {
    const issueNumbers = [123, 124, 125, 126]
    this.log.push(`listed issues ${issueNumbers.map(issueNumber => `#${issueNumber}`).join(', ')}`)
    return issueNumbers
  }

  async closeIssue (issueNumber: number) {
    this.log.push(`close issues #${issueNumber}`)
  }
}
