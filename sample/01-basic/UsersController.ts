import { IsOptional, IsString, MaxLength } from 'class-validator'
import { Body, Get, JsonController, Param, Post } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'

class CreateUserBody {
  @IsString() name: string

  @IsOptional()
  @MaxLength(20, { each: true })
  hobbies: string[]
}

@JsonController('/users')
export class UsersController {
  @Get('/')
  @OpenAPI({ summary: 'Return a list of users' })
  getAll() {
    return [
      { id: 1, name: 'First user!', hobbies: [] },
      { id: 2, name: 'Second user!', hobbies: ['fishing', 'cycling'] }
    ]
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Return a single user' })
  getOne(@Param('id') id: number) {
    return { name: 'User #' + id }
  }

  @Post('/')
  @OpenAPI({ summary: 'Create a new user' })
  createUser(
    @Body({ validate: true })
    body: CreateUserBody
  ) {
    return { ...body, id: 3 }
  }
}
