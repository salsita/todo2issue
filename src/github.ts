import { Issue } from './model'
import { Octokit } from '@octokit/rest'
import { GitRepository } from './config'



export interface GithubClient {
  createIssue (issue: Issue): Promise<number>

  listOpenTodoIssueNumbers (): Promise<number[]>

  closeIssue (issueNumber: number)
}

export class RestGithubClient implements GithubClient {
  private readonly octokit

  constructor (
    private readonly repo: GitRepository,
    personalToken: string
  ) {
    this.octokit = new Octokit({ auth: personalToken })
  }

  closeIssue (issueNumber: number) {
    this.octokit.rest.issues.update({
      owner: this.repo.owner,
      repo: this.repo.name,
      issue_number: issueNumber,
      state: 'closed'
    });
  }

  createIssue (issue: Issue): Promise<number> {
    return Promise.resolve(0)
  }

  listOpenTodoIssueNumbers (): Promise<number[]> {
    return Promise.resolve([])
  }

}
