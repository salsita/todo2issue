import { updateBody } from './update-issue-body'
import { endMarker, startMarker } from './parse-issue-body'

describe('updateIssueBody', () => {
  it('does not update matching generated content', () => {
    const oldBody = `[](start-of-generated-content)
ABC
[](end-of-generated-content)`
    expect(
      updateBody(oldBody, 'ABC')
    ).toMatchObject({
      updated: false,
      body: oldBody
    })
  })

  it('does not update plain text', () => {
    const oldBody = 'ABC'
    expect(
      updateBody(oldBody, 'EFG')
    ).toMatchObject({
      updated: false,
      body: oldBody
    })
  })

  it('keeps surrounding text when updating', () => {
    const oldBody = `prefix
[](start-of-generated-content)
ABC
[](end-of-generated-content)
suffix`
    expect(
      updateBody(oldBody, 'EFG')
    ).toMatchObject({
      updated: true,
      body: `prefix\n${startMarker}\nEFG\n${endMarker}\nsuffix`
    })
  })
})
