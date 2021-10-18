import { groupTodosByFile, Issue } from './model'
import { GitRepository } from './config'

export function generateIssueBody (issue: Issue, repo: GitRepository, commitish: string): string {
  const todosByFile = groupTodosByFile(issue.todos)
  const fileOccurrences = Array.from(todosByFile.entries())
    .map(([filename, todos]) => {
      const todoOccurrences = todos.map(todo =>
        `-  [line ${todo.line}](https://github.com/${repo.owner}/${repo.name}/blob/${commitish}/${filename}#L${todo.line}) - ${todo.text}`
      )
      return `
### \`${filename}\`

${todoOccurrences.join('\n')}
 `
    }).join('\n\n')
  return `---
_This issue origins from a TODO within the code-base and was synchronized automatically._

## Occurrences
${fileOccurrences}
---`
}
