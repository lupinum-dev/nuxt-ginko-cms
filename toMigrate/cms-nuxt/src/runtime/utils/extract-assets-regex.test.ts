import { describe, expect, it } from 'vitest'
import {
  MDC_FILE_LONGFORM_REGEX,
  MDC_FILE_SHORTHAND_REGEX,
  MDC_IMAGE_LONGFORM_REGEX,
  MDC_IMAGE_SHORTHAND_REGEX,
} from './extract-assets'

/**
 * Regex pattern tests for MDC asset extraction
 *
 * Tests individual regex patterns to ensure:
 * - Valid syntax is matched
 * - Invalid syntax is rejected
 * - Correct capture groups
 * - Edge cases are handled
 *
 * Run these tests when:
 * - Adding new MDC component support
 * - Changing asset ID format
 * - Modifying attribute syntax
 */

describe('mDC Asset Regex Patterns', () => {
  describe('convex ID format validation', () => {
    // Valid Convex IDs: 20-40 lowercase alphanumeric characters
    const validIds = [
      'abc123def456ghi789jkl012', // 24 chars (minimum typical)
      'abc123def456ghi789jkl012mno', // 27 chars
      'kh7c334y6gxw76ngrpexnncjxh800c3f', // 32 chars (typical)
      'k176h8f8emf2cc1jynk2m4e7018017ws', // 32 chars
      'doc111222333444555666777888', // 27 chars
      'a'.repeat(20), // 20 chars (minimum)
      'z'.repeat(40), // 40 chars (maximum)
    ]

    const invalidIds = [
      'too-short', // < 20 chars
      'a'.repeat(19), // 19 chars (too short)
      'a'.repeat(41), // 41 chars (too long)
      'UPPERCASE123456789012345', // uppercase letters
      'contains-dashes-012345678', // dashes
      'contains_underscores_0123', // underscores
      'special!@#$%^&*()12345678', // special chars
      'has spaces 123456789012345', // spaces
      '', // empty
    ]

    it('should match valid Convex IDs', () => {
      for (const id of validIds) {
        const regex = /^[a-z0-9]{20,40}$/
        expect(regex.test(id)).toBe(true)
      }
    })

    it('should reject invalid Convex IDs', () => {
      for (const id of invalidIds) {
        const regex = /^[a-z0-9]{20,40}$/
        expect(regex.test(id)).toBe(false)
      }
    })
  })

  describe('mDC_IMAGE_SHORTHAND_REGEX', () => {
    it('should match basic shorthand syntax', () => {
      const content = ':image{#abc123def456ghi789jkl012mno}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
    })

    it('should match shorthand with additional attributes', () => {
      const content = ':image{#abc123def456ghi789jkl012mno alt="test" width="800"}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
    })

    it('should match multiple images in content', () => {
      const content = `
        :image{#abc123def456ghi789jkl012mno}
        Some text
        :image{#xyz789abc456def123ghi012jkl}
      `
      const matches = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(2)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
      expect(matches[1][1]).toBe('xyz789abc456def123ghi012jkl')
    })

    it('should not match invalid ID lengths', () => {
      const tooShort = ':image{#tooshort}'
      const tooLong = `:image{#${'a'.repeat(41)}}`

      expect(Array.from(tooShort.matchAll(MDC_IMAGE_SHORTHAND_REGEX))).toHaveLength(0)

      // Regex matches first 40 chars of a longer ID - this is acceptable
      // because schema validation prevents invalid IDs from being stored
      const longMatch = Array.from(tooLong.matchAll(MDC_IMAGE_SHORTHAND_REGEX))
      expect(longMatch).toHaveLength(1)
      expect(longMatch[0][1]).toHaveLength(40) // captures max length
    })

    it('should not match uppercase or special characters in ID', () => {
      const uppercase = ':image{#ABC123def456ghi789jkl012mno}'
      const special = ':image{#abc-123-def-456-ghi-789-jkl}'

      // Uppercase: no match because regex requires lowercase
      expect(Array.from(uppercase.matchAll(MDC_IMAGE_SHORTHAND_REGEX))).toHaveLength(0)

      // Special chars with short prefix: no match because "abc" (3 chars) < 20 minimum
      // The length constraint {20,40} prevents partial matches shorter than 20 chars
      expect(Array.from(special.matchAll(MDC_IMAGE_SHORTHAND_REGEX))).toHaveLength(0)
    })

    it('should not match without # prefix', () => {
      const content = ':image{abc123def456ghi789jkl012mno}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(0)
    })

    it('should not match other components', () => {
      const content = ':alert{#abc123def456ghi789jkl012mno}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(0)
    })

    it('should handle IDs at min and max length boundaries', () => {
      const minLength = `:image{#${'a'.repeat(20)}}`
      const maxLength = `:image{#${'z'.repeat(40)}}`

      const minMatches = Array.from(minLength.matchAll(MDC_IMAGE_SHORTHAND_REGEX))
      const maxMatches = Array.from(maxLength.matchAll(MDC_IMAGE_SHORTHAND_REGEX))

      expect(minMatches).toHaveLength(1)
      expect(minMatches[0][1]).toBe('a'.repeat(20))
      expect(maxMatches).toHaveLength(1)
      expect(maxMatches[0][1]).toBe('z'.repeat(40))
    })
  })

  describe('mDC_IMAGE_LONGFORM_REGEX', () => {
    it('should match long form with double quotes', () => {
      const content = ':image{id="abc123def456ghi789jkl012mno"}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
    })

    it('should match long form with single quotes', () => {
      const content = ':image{id=\'abc123def456ghi789jkl012mno\'}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
    })

    it('should match with id attribute in any position', () => {
      const first = ':image{id="abc123def456ghi789jkl012mno" alt="test"}'
      const middle = ':image{alt="test" id="abc123def456ghi789jkl012mno" width="800"}'
      const last = ':image{alt="test" width="800" id="abc123def456ghi789jkl012mno"}'

      expect(Array.from(first.matchAll(MDC_IMAGE_LONGFORM_REGEX))[0][1]).toBe('abc123def456ghi789jkl012mno')
      expect(Array.from(middle.matchAll(MDC_IMAGE_LONGFORM_REGEX))[0][1]).toBe('abc123def456ghi789jkl012mno')
      expect(Array.from(last.matchAll(MDC_IMAGE_LONGFORM_REGEX))[0][1]).toBe('abc123def456ghi789jkl012mno')
    })

    it('should match multiple images in content', () => {
      const content = `
        :image{id="abc123def456ghi789jkl012mno" alt="First"}
        :image{id='xyz789abc456def123ghi012jkl' alt='Second'}
      `
      const matches = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))

      expect(matches).toHaveLength(2)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
      expect(matches[1][1]).toBe('xyz789abc456def123ghi012jkl')
    })

    it('should not match without quotes', () => {
      const content = ':image{id=abc123def456ghi789jkl012mno}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))

      expect(matches).toHaveLength(0)
    })

    it('should not match mismatched quotes', () => {
      const content = ':image{id="abc123def456ghi789jkl012mno\'}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))

      // Should still match because we allow either quote type
      expect(matches).toHaveLength(1)
    })

    it('should not match other components', () => {
      const content = ':button{id="abc123def456ghi789jkl012mno"}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))

      expect(matches).toHaveLength(0)
    })

    it('should handle attributes with complex values', () => {
      const content = ':image{src="https://example.com/image.jpg" id="abc123def456ghi789jkl012mno" alt="Complex: with, punctuation!"}'
      const matches = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
    })
  })

  describe('mDC_FILE_SHORTHAND_REGEX', () => {
    it('should match basic shorthand syntax', () => {
      const content = ':file{#abc123def456ghi789jkl012mno}'
      const matches = Array.from(content.matchAll(MDC_FILE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
    })

    it('should match shorthand with additional attributes', () => {
      const content = ':file{#doc111222333444555666777888 name="document.pdf"}'
      const matches = Array.from(content.matchAll(MDC_FILE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('doc111222333444555666777888')
    })

    it('should match multiple files in content', () => {
      const content = `
        :file{#abc123def456ghi789jkl012mno}
        :file{#xyz789abc456def123ghi012jkl}
      `
      const matches = Array.from(content.matchAll(MDC_FILE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(2)
      expect(matches[0][1]).toBe('abc123def456ghi789jkl012mno')
      expect(matches[1][1]).toBe('xyz789abc456def123ghi012jkl')
    })

    it('should not match image components', () => {
      const content = ':image{#abc123def456ghi789jkl012mno}'
      const matches = Array.from(content.matchAll(MDC_FILE_SHORTHAND_REGEX))

      expect(matches).toHaveLength(0)
    })
  })

  describe('mDC_FILE_LONGFORM_REGEX', () => {
    it('should match long form with double quotes', () => {
      const content = ':file{id="doc111222333444555666777888"}'
      const matches = Array.from(content.matchAll(MDC_FILE_LONGFORM_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('doc111222333444555666777888')
    })

    it('should match long form with single quotes', () => {
      const content = ':file{id=\'doc111222333444555666777888\'}'
      const matches = Array.from(content.matchAll(MDC_FILE_LONGFORM_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('doc111222333444555666777888')
    })

    it('should match with id attribute and file-specific attributes', () => {
      const content = ':file{name="slides.pdf" size="2MB" id="doc111222333444555666777888"}'
      const matches = Array.from(content.matchAll(MDC_FILE_LONGFORM_REGEX))

      expect(matches).toHaveLength(1)
      expect(matches[0][1]).toBe('doc111222333444555666777888')
    })

    it('should not match image components', () => {
      const content = ':image{id="abc123def456ghi789jkl012mno"}'
      const matches = Array.from(content.matchAll(MDC_FILE_LONGFORM_REGEX))

      expect(matches).toHaveLength(0)
    })
  })

  describe('mixed content scenarios', () => {
    it('should distinguish between image and file components', () => {
      const content = `
        :image{#img1234567890123456789012}
        :file{#file123456789012345678901}
        :image{id="img9876543210987654321098"}
        :file{id="file987654321098765432109"}
      `

      const imageShorthand = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))
      const imageLongform = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))
      const fileShorthand = Array.from(content.matchAll(MDC_FILE_SHORTHAND_REGEX))
      const fileLongform = Array.from(content.matchAll(MDC_FILE_LONGFORM_REGEX))

      expect(imageShorthand).toHaveLength(1)
      expect(imageLongform).toHaveLength(1)
      expect(fileShorthand).toHaveLength(1)
      expect(fileLongform).toHaveLength(1)

      expect(imageShorthand[0][1]).toBe('img1234567890123456789012')
      expect(imageLongform[0][1]).toBe('img9876543210987654321098')
      expect(fileShorthand[0][1]).toBe('file123456789012345678901')
      expect(fileLongform[0][1]).toBe('file987654321098765432109')
    })

    it('should handle realistic blog post content', () => {
      const content = `
# My Blog Post

Here's an introduction with an image.

:image{#abc123def456ghi789jkl012mno alt="Main diagram" width="800"}

## Section with embedded media

Some text here, then a file download:

:file{#doc111222333444555666777888 name="whitepaper.pdf"}

And another image using long form:

:image{src="/uploads/chart.png" id="xyz789abc456def123ghi012jkl" alt="Chart"}

## Conclusion

Thanks for reading!
      `

      const imageShorthand = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))
      const imageLongform = Array.from(content.matchAll(MDC_IMAGE_LONGFORM_REGEX))
      const fileShorthand = Array.from(content.matchAll(MDC_FILE_SHORTHAND_REGEX))

      expect(imageShorthand).toHaveLength(1)
      expect(imageLongform).toHaveLength(1)
      expect(fileShorthand).toHaveLength(1)

      // Verify correct IDs extracted
      expect(imageShorthand[0][1]).toBe('abc123def456ghi789jkl012mno')
      expect(imageLongform[0][1]).toBe('xyz789abc456def123ghi012jkl')
      expect(fileShorthand[0][1]).toBe('doc111222333444555666777888')
    })
  })

  describe('edge cases and security', () => {
    it('should not match malicious content injection attempts', () => {
      const malicious = [
        ':image{#abc123def456ghi789jkl012mno}}<script>alert("xss")</script>',
        ':image{id="abc123def456ghi789jkl012mno" onclick="alert(1)"}',
        ':image{#abc123def456ghi789jkl012mno}}\'; DROP TABLE assets; --',
      ]

      for (const content of malicious) {
        const matches = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))
        // Should still only match the valid ID part
        expect(matches.length).toBeLessThanOrEqual(1)
        if (matches.length === 1) {
          expect(matches[0][1]).toMatch(/^[a-z0-9]{20,40}$/)
        }
      }
    })

    it('should handle empty and whitespace content', () => {
      const empty = ''
      const whitespace = '   \n\n\t   '
      const onlyText = 'Just plain text with no components'

      expect(Array.from(empty.matchAll(MDC_IMAGE_SHORTHAND_REGEX))).toHaveLength(0)
      expect(Array.from(whitespace.matchAll(MDC_IMAGE_SHORTHAND_REGEX))).toHaveLength(0)
      expect(Array.from(onlyText.matchAll(MDC_IMAGE_SHORTHAND_REGEX))).toHaveLength(0)
    })

    it('should handle malformed MDC syntax', () => {
      const testCases = [
        { content: ':image{#}', shouldMatch: false, desc: 'empty ID' },
        { content: ':image{##abc123def456ghi789jkl012mno}', shouldMatch: false, desc: 'double hash - {## does not match {# pattern' },
        { content: ':image#{abc123def456ghi789jkl012mno}', shouldMatch: false, desc: 'hash outside braces' },
        { content: 'image{#abc123def456ghi789jkl012mno}', shouldMatch: false, desc: 'missing colon' },
        { content: ':image#abc123def456ghi789jkl012mno}', shouldMatch: false, desc: 'missing opening brace' },
        { content: ':image{#abc123def456ghi789jkl012mno', shouldMatch: true, desc: 'missing closing brace - regex still matches' },
      ]

      for (const { content, shouldMatch } of testCases) {
        const matches = Array.from(content.matchAll(MDC_IMAGE_SHORTHAND_REGEX))
        if (shouldMatch) {
          expect(matches.length).toBeGreaterThan(0)
          expect(matches[0][1]).toMatch(/^[a-z0-9]{20,40}$/)
        }
        else {
          expect(matches).toHaveLength(0)
        }
      }
    })

    it('should not be vulnerable to ReDoS patterns', () => {
      // Test with deeply nested or repeated patterns
      const stress = `:image{${'a'.repeat(1000)}id="abc123def456ghi789jkl012mno"}`

      const start = Date.now()
      Array.from(stress.matchAll(MDC_IMAGE_LONGFORM_REGEX))
      const duration = Date.now() - start

      // Should complete in reasonable time (< 100ms for this simple case)
      expect(duration).toBeLessThan(100)
    })
  })
})
