import { parseBody } from './parse-issue-body'

describe('parseBody', () => {
  it('parses fully generated body', () => {
    expect(
      parseBody(`[](start-of-generated-content)
ABC
[](end-of-generated-content)`)
    ).toMatchObject({
      prefix: '',
      generatedContent: '\nABC\n',
      suffix: ''
    })
  })

  it('parses body with prefix', () => {
    expect(
      parseBody(`prefix
[](start-of-generated-content)
ABC
[](end-of-generated-content)`)
    ).toMatchObject({
      prefix: 'prefix\n',
      generatedContent: '\nABC\n',
      suffix: ''
    })
  })

  it('parses body with suffix', () => {
    expect(
      parseBody(`[](start-of-generated-content)
ABC
[](end-of-generated-content)
suffix`)
    ).toMatchObject({
      prefix: '',
      generatedContent: '\nABC\n',
      suffix: '\nsuffix'
    })
  })
  it('parses body with prefix and suffix', () => {
    expect(
      parseBody(`prefix
[](start-of-generated-content)
ABC
[](end-of-generated-content)
suffix`)
    ).toMatchObject({
      prefix: 'prefix\n',
      generatedContent: '\nABC\n',
      suffix: '\nsuffix'
    })
  })

  it('does not parse when start marker is missing', () => {
    expect(
      parseBody(`ABC
[](end-of-generated-content)`)
    ).toBe(null)
  })

  it('does not parse when end marker is missing', () => {
    expect(
      parseBody(`[](start-of-generated-content)
ABC`)
    ).toBe(null)
  })

  it('does not parse when markers are missing', () => {
    expect(
      parseBody(`
ABC
EFG
`)
    ).toBe(null)
  })
})
