import { describe, it, expect } from 'vitest'
import { formatDecimal, formatCurrency } from '@/utils/formatters'

describe('formatDecimal', () => {
  it('should format a number to one decimal place', () => {
    expect(formatDecimal(3.14159)).toBe('3.1')
    expect(formatDecimal(10)).toBe('10.0')
    expect(formatDecimal(0)).toBe('0.0')
  })

  it('should round correctly', () => {
    // Note: JavaScript toFixed uses banker's rounding in some cases
    expect(formatDecimal(3.16)).toBe('3.2')
    expect(formatDecimal(3.14)).toBe('3.1')
    expect(formatDecimal(2.96)).toBe('3.0')
  })

  it('should handle negative numbers', () => {
    expect(formatDecimal(-5.678)).toBe('-5.7')
    expect(formatDecimal(-0.1)).toBe('-0.1')
  })

  it('should return non-number values as-is', () => {
    expect(formatDecimal('text')).toBe('text')
    expect(formatDecimal(null)).toBe(null)
    expect(formatDecimal(undefined)).toBe(undefined)
  })
})

describe('formatCurrency', () => {
  it('should format a number as currency with $ symbol', () => {
    const result = formatCurrency(1234.56)
    expect(result).toMatch(/^\$ /)
    expect(result).toContain('1')
    expect(result).toContain('234')
  })

  it('should format zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toMatch(/^\$ 0[,.]00$/)
  })

  it('should handle decimal rounding', () => {
    const result = formatCurrency(99.999)
    expect(result).toMatch(/^\$ /)
  })

  it('should return placeholder for non-number values', () => {
    expect(formatCurrency('text')).toBe('$ --.--')
    expect(formatCurrency(null)).toBe('$ --.--')
    expect(formatCurrency(undefined)).toBe('$ --.--')
  })

  it('should return placeholder for NaN', () => {
    expect(formatCurrency(NaN)).toBe('$ --.--')
  })

  it('should handle negative numbers', () => {
    const result = formatCurrency(-500)
    expect(result).toMatch(/^\$ -/)
  })
})
