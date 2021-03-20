import { Type } from 'class-transformer'
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator'
import {
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParams,
} from 'routing-controllers'
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi'

class Child {
  @IsString()
  name: string
}

class CreateUserBody {
  @IsString()
  name: string

  @IsOptional()
  @MaxLength(20, { each: true })
  hobbies: string[]

  @ValidateNested()
  child: Child

  @ValidateNested({ each: true })
  @Type(() => Child)
  children: Child[]
}

class UserResponse {
  @IsString()
  name: string

  @IsString({ each: true })
  hobbies: string[]
}

class PaginationQuery {
  @IsNumber()
  @IsPositive()
  public limit: number

  @IsNumber()
  @IsOptional()
  public offset?: number
}

@OpenAPI({
  security: [{ basicAuth: [] }],
})
@JsonController('/users')
export class UsersController {
  @Get('/')
  @OpenAPI({ summary: 'Return a list of users' })
  @ResponseSchema(UserResponse, { isArray: true })
  getAll(@QueryParams() query: PaginationQuery) {
    return [
      { id: 1, name: 'First user!', hobbies: [] },
      { id: 2, name: 'Second user!', hobbies: ['fishing', 'cycling'] },
    ]
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Return a single user' })
  @ResponseSchema(UserResponse)
  getOne(@Param('id') id: number) {
    return { name: 'User #' + id, hobbies: ['something'] }
  }

  @Post('/')
  @OpenAPI({ summary: 'Create a new user' })
  createUser(@Body({ validate: true }) body: CreateUserBody) {
    return { ...body, id: 3 }
  }

  @Put('/')
  createManyUsers(@Body({ type: CreateUserBody }) body: CreateUserBody[]) {
    return {}
  }
}
