import { Issue } from './model'
import { GithubClient } from './github'
import { generateIssueBody } from './generate-issue-body'
import { GitRepository } from './config'
import { createBody, updateBody } from './update-issue-body'

export async function syncWithGitHub (
  issues: Issue[],
  githubClient: GithubClient,
  repo: GitRepository,
  issueLabel: string,
  branch: string,
  overwriteBody: boolean = false
) {
  const issuesToUpdate = issues.filter(issue => issue.issueNumber !== undefined)
  const issuesToCreate = issues.filter(issue => issue.issueNumber === undefined)

  for (const issue of issuesToCreate) {
    const generatedContent = generateIssueBody(issue, repo, branch)
    const body = createBody(generatedContent)
    issue.issueNumber = await githubClient.createIssue(issue, issueLabel, body)
    console.log(`created issue #${issue.issueNumber}`)
  }

  const existingIssues = await githubClient.listOpenTodoIssues(issueLabel)
  const existingIssuesByNumber = new Map(existingIssues.map(issue => [issue.issueNumber, issue]))

  for (const issue of issuesToUpdate) {
    const existingIssue = existingIssuesByNumber.get(issue.issueNumber)
    if (!existingIssue) {
      console.warn(`failed to update issue #${issue.issueNumber}, because it isn't present in GitHub or the '${issueLabel}' has been removed, consider removing the TODO`)
      continue
    }

    const newGeneratedContent = generateIssueBody(issue, repo, branch)
    const {
      updated,
      body
    } = overwriteBody
      ? { updated: true, body: createBody(newGeneratedContent) }
      : updateBody(existingIssue.body, newGeneratedContent)

    if (!updated) {
      continue
    }

    await githubClient.updateIssue(issue.issueNumber, body)
    console.log(`updated issue #${issue.issueNumber}`)
  }

  issues.forEach(issue => existingIssuesByNumber.delete(issue.issueNumber))
  for (const obsoleteIssueNumber of existingIssuesByNumber.keys()) {
    await githubClient.closeIssue(obsoleteIssueNumber)
    console.log(`closed issue #${obsoleteIssueNumber}`)
  }
}
