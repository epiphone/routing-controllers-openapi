import {
  getFromContainer,
  IsOptional,
  IsString,
  MaxLength,
  MetadataStorage,
  MinLength,
  ValidateNested
} from 'class-validator'
import * as _ from 'lodash'

import { validationMetadatasToSchemas } from '../../src/classValidatorConverter'

class User {
  @IsString() id: string

  @MinLength(5)
  firstName: string

  @IsOptional()
  @MaxLength(20, { each: true })
  tags: string[]
}

// @ts-ignore: not referenced
class Post {
  @IsOptional()
  @ValidateNested()
  user: User
}

const storage = getFromContainer(MetadataStorage)
const schemas = validationMetadatasToSchemas(
  _.get(storage, 'validationMetadatas')
)

describe('classValidatorToSchema', () => {
  it('generates a schema for each validated class', () => {
    expect(schemas).toEqual({
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
