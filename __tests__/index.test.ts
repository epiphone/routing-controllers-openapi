import { Get, JsonController } from 'routing-controllers'

import { sum } from '../src'

@JsonController('/users')
class UsersController {
  @Get('/')
  list() {
    return [1, 2]
  }

  create() {
    return
  }
}

describe('index', () => {
  it('sums two numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
