import { Issue } from './group'

let counter = 0

export async function createIssue(issue: Issue) {
  issue.issueNumber = ++counter
  await Promise.resolve()
}

export async function updateIssue(issue: Issue) {

}

export async function closeMissingIssues(issues: Issue[]) {

}
