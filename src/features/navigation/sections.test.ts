import { describe, expect, it } from 'vitest'
import { pathForSection, sectionForPath, SECTIONS } from './sections'

describe('section paths', () => {
  it('maps every section to a unique clean path and back', () => {
    const paths = SECTIONS.map((s) => s.path)
    expect(new Set(paths).size).toBe(paths.length)
    SECTIONS.forEach((s) => {
      expect(s.path).not.toContain('#')
      expect(sectionForPath(pathForSection(s.id))).toBe(s.id)
    })
  })

  it('ignores trailing slashes', () => {
    expect(sectionForPath('/moon/')).toBe('moon')
  })

  it('falls back to the top for unknown paths', () => {
    expect(sectionForPath('/nope')).toBe('top')
    expect(sectionForPath('/')).toBe('top')
  })
})
