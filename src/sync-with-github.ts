import { Issue } from './model'
import { GithubClient } from './github'

export async function syncWithGitHub (issues: Issue[], githubClient: GithubClient) {
  for (const issue of issues) {
    if (issue.issueNumber === undefined) {
      issue.issueNumber = await githubClient.createIssue(issue)
    }
  }
  const githubIssues = new Set(await githubClient.listOpenTodoIssueNumbers())
  issues.forEach(issue => githubIssues.delete(issue.issueNumber))

  for (const obsoleteIssueNumber of githubIssues) {
    await githubClient.closeIssue(obsoleteIssueNumber)
  }
}
