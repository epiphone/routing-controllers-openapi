// tslint:disable:no-submodule-imports
import { ValidationTypes } from 'class-validator'
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata'
import * as _ from 'lodash'
import { SchemaObject } from 'openapi3-ts'

import * as metadata from '../metadata'

export interface ISchemaConverters {
  [validatorType: string]: SchemaConverter
}
export type SchemaConverter = (meta: ValidationMetadata) => SchemaObject

export const defaultConverters: ISchemaConverters = {
  [ValidationTypes.ARRAY_NOT_EMPTY]: () => ({
    minItems: 1
  }),
  [ValidationTypes.ARRAY_UNIQUE]: () => ({
    uniqueItems: true
  }),
  [ValidationTypes.CONDITIONAL_VALIDATION]: () => ({}),
  [ValidationTypes.IS_BOOLEAN]: () => ({
    type: 'boolean'
  }),
  [ValidationTypes.IS_EMAIL]: () => ({
    format: 'email',
    type: 'string'
  }),
  [ValidationTypes.IS_IN]: meta => ({
    enum: meta.constraints[0],
    type: 'string'
  }),
  [ValidationTypes.IS_NOT_EMPTY]: () => ({
    minLength: 1,
    type: 'string'
  }),
  [ValidationTypes.IS_STRING]: () => ({
    type: 'string'
  }),
  [ValidationTypes.MAX_LENGTH]: meta => ({
    maxLength: meta.constraints[0],
    type: 'string'
  }),
  [ValidationTypes.MIN_LENGTH]: meta => ({
    minLength: meta.constraints[0],
    type: 'string'
  }),
  [ValidationTypes.NESTED_VALIDATION]: meta => {
    if (_.isFunction(meta.target)) {
      const childType = metadata.getPropType(
        meta.target.prototype,
        meta.propertyName
      )
      const schema = _.isFunction(childType) ? childType.name : childType
      return { $ref: '#/components/schemas/' + schema }
    }
    return {}
  }
}
