import { endMarker, parseBody, startMarker } from './parse-issue-body'

export interface UpdateBodyResult {
  updated: boolean
  body: string
}

const normalize = (content: string) => content.trim().replace(/\r\n/g,'\n')

export function updateBody (oldBody: string, newGeneratedContent: string): UpdateBodyResult {
  const parsedBody = parseBody(oldBody)
  if (parsedBody === null) {
    return {
      updated: false,
      body: oldBody
    }
  }
  const { prefix, generatedContent, suffix } = parsedBody

  if (normalize(generatedContent) === normalize(newGeneratedContent)) {
    return {
      updated: false,
      body: oldBody
    }
  }
  return {
    updated: true,
    body: `${prefix}${startMarker}\n${newGeneratedContent}\n${endMarker}${suffix}`
  }
}

export function createBody (text: string) {
  return `${startMarker}\n${text}\n${endMarker}`
}
