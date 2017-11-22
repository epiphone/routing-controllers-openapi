import {
  getFromContainer,
  IsOptional,
  IsString,
  MaxLength,
  MetadataStorage,
  MinLength,
  ValidateNested
} from 'class-validator'
const debug = require('debug')('routing-controllers-openapi')

import { metadataToJSONSchema } from '../src/classValidatorToSchema'

class User {
  @IsString() id: string

  @MinLength(5)
  firstName: string

  @IsOptional()
  @MaxLength(20, { each: true })
  tags: string[]
}

class Post {
  @IsOptional()
  @ValidateNested()
  user: User
}
const storage = getFromContainer(MetadataStorage)
// debug('storage', storage)
// debug('metadataArgs', getMetadataArgsStorage())
const schema = metadataToJSONSchema(storage)

describe('classValidatorToSchema', () => {
  it('generates a schema for each validated class', () => {
    expect(schema).toEqual({
      Post: {
        properties: {
          user: {
            $ref: '#/components/schemas/User'
          }
        },
        required: [],
        type: 'object'
      },
      User: {
        properties: {
          firstName: { minLength: 5, type: 'string' },
          id: { type: 'string' },
          tags: {
            items: {
              maxLength: 20,
              type: 'string'
            },
            type: 'array'
          }
        },
        required: ['id', 'firstName'],
        type: 'object'
      }
    })
  })
})
