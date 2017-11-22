import { sum } from '../src'

describe('index', () => {
  it('sums two numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
