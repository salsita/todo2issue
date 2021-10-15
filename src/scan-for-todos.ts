import { readFile } from 'fs/promises'
import { extname, resolve } from 'path'
import { parse } from 'leasot'
import { Todo } from './model'

const ISSUE_NUMBER_PATTERN = /^#([0-9]+)$/

export async function scanForTodos(root: string, files: string[]): Promise<Todo[]> {
  const todos: Todo[] = []
  for (const filename of files) {
    const contents = await readFile(resolve(root, filename), 'utf8')
    const todoComments = parse(contents, { filename, extension: extname(filename) })

    todos.push(
      ...todoComments.map((todoComment) => {
        const { line, text, tag, ref } = todoComment
        const [, issueNumber] = ISSUE_NUMBER_PATTERN.exec(ref) || []
        const todo = {
          filename,
          line,
          tag,
          text,
          issueNumber: issueNumber ? Number(issueNumber) : undefined,
        }
        return todo
      }),
    )
  }
  return todos
}
