import { Issue } from './model'
import { GithubClient } from './github'

export async function syncWithGitHub (issues: Issue[], githubClient: GithubClient, issueLabel: string, commitHash: string) {
  for (const issue of issues) {
    if (issue.issueNumber === undefined) {
      issue.issueNumber = await githubClient.createIssue(issue, issueLabel, commitHash)
      console.log(`created issue #${issue.issueNumber}`)
    }
  }
  const githubIssues = new Set(await githubClient.listOpenTodoIssueNumbers(issueLabel))
  issues.forEach(issue => githubIssues.delete(issue.issueNumber))

  for (const obsoleteIssueNumber of githubIssues) {
    await githubClient.closeIssue(obsoleteIssueNumber)
    console.log(`closed issue #${obsoleteIssueNumber}`)
  }
}
