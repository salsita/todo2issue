import { Issue } from './model'
import { GithubClient } from './github'

export async function syncWithGitHub (issues: Issue[], githubClient: GithubClient, issueLabel: string) {
  for (const issue of issues) {
    if (issue.issueNumber === undefined) {
      issue.issueNumber = await githubClient.createIssue(issue, issueLabel)
    }
  }
  const githubIssues = new Set(await githubClient.listOpenTodoIssueNumbers(issueLabel))
  issues.forEach(issue => githubIssues.delete(issue.issueNumber))

  for (const obsoleteIssueNumber of githubIssues) {
    await githubClient.closeIssue(obsoleteIssueNumber)
  }
}
