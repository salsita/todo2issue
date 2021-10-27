import { groupTodosByFile, Todo } from './model'
import { blameFile } from './git'

export async function findAuthors (root: string, todos: Todo[], authorsByEmail: Record<string, string>, ignoreUnresolvedAuthors: boolean = false) {
  const todosByFile = groupTodosByFile(todos)
  const missingAuthorEmails = new Set<string>()
  for (const [file, fileTodos] of todosByFile.entries()) {
    const blameInfos = await blameFile(root, file, fileTodos.map(todo => todo.line))
    const blamesPerLine = new Map(blameInfos.map(blameInfo => [blameInfo.lineAfter, blameInfo]))
    todos.forEach(todo => {
      const blameInfo = blamesPerLine.get(todo.line)
      if(blameInfo && blameInfo.author.email !== 'not.committed.yet') {
        todo.author = authorsByEmail[blameInfo.author.email]
        if(!todo.author) {
          missingAuthorEmails.add(blameInfo.author.email)
        }
      }
    })
  }

  if(missingAuthorEmails.size > 0) {
    const message = `cannot resolve GitHub users from emails:\n\t${Array.from(missingAuthorEmails).join('\n\t')}`
    if(ignoreUnresolvedAuthors) {
      console.warn(message)
    } else {
      throw new Error(message)
    }
  }
}
