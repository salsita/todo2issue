import escapeRegexp from 'escape-string-regexp'

export const startMarker = '[](start-of-generated-content)'
export const endMarker = '[](end-of-generated-content)'

const markerPattern = new RegExp(`^(.*)${escapeRegexp(startMarker)}(.*)${escapeRegexp(endMarker)}(.*)$`, 's')

export interface ParsedBody {
  prefix: string
  generatedContent: string
  suffix: string
}

export function parseBody (body): ParsedBody | null {
  const match = markerPattern.exec(body)
  if (!match) {
    return null
  }
  const [, prefix, generatedContent, suffix] = match
  return { prefix, generatedContent, suffix }
}
