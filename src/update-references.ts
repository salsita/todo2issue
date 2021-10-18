import { resolve } from 'path'
import { Issue, Todo, groupTodosByFile } from './model'
import { readFile, writeFile } from 'fs/promises'
import escapeRegexp from 'escape-string-regexp'

export async function updateReferences (root: string, issues: Issue[]) {
  const updates = issues
    .filter(issue => issue.issueNumber !== undefined)
    .flatMap(issue =>
      issue.todos
        .filter(todo => todo.issueNumber === undefined)
        .map(todo => ({ ...todo, issueNumber: issue.issueNumber }))
    )

  const updatesByFile = groupTodosByFile(updates)

  for (const [filename, todos] of updatesByFile.entries()) {
    const absoluteFilename = resolve(root, filename)
    const contents = await readFile(absoluteFilename, 'utf8')
    const lines = contents.split(/(?=\r?\n)/)
    todos.forEach(todo => {
      lines[todo.line - 1] = updateReference(lines[todo.line - 1], todo)
    })
    await writeFile(absoluteFilename, lines.join(''), 'utf8')
    console.log(`updated file '${filename}'`)
  }
}

export function updateReference (line: string, todo: Todo): string {
  const pattern = new RegExp(`(${escapeRegexp(todo.tag)})([: ] *${escapeRegexp(todo.text)})`, 'i')
  const updatedLine = line.replace(pattern, `$1(#${todo.issueNumber})$2`)
  if (updatedLine === line) {
    console.warn(`Failed to update reference to #${todo.issueNumber} at '${todo.filename}:${todo.line}'\n\t${line}`)
  }
  return updatedLine
}
