import { resolve } from 'path'
import { Issue, Todo } from './model'
import { readFile, writeFile } from 'fs/promises'
import escapeRegexp from 'escape-string-regexp'

export async function updateReferences (root: string, issues: Issue[]) {
  const updates = issues.flatMap(issue =>
    issue.todos
      .filter(todo => todo.issueNumber === undefined)
      .map(todo => ({ ...todo, issueNumber: issue.issueNumber }))
  )

  const updatesByFile = updates.reduce(
    (map, todo) => {
      let fileUpdates = map.get(todo.filename)
      if (fileUpdates) {
        fileUpdates.push(todo)
      } else {
        fileUpdates = [todo]
        map.set(todo.filename, fileUpdates)
      }
      return map
    },
    new Map<string, Todo[]>()
  )

  for (const [filename, todos] of updatesByFile.entries()) {
    const absoluteFilename = resolve(root, filename)
    const contents = await readFile(absoluteFilename, 'utf8')
    const lines = contents.split(/(?=\r?\n)/)
    todos.forEach(todo => {
      lines[todo.line - 1] = updateReference(lines[todo.line - 1], todo)
    })
    await writeFile(absoluteFilename, lines.join(''), 'utf8')
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
