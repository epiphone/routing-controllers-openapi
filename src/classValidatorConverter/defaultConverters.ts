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
  arrayNotEmpty: () => ({ minItems: 1 }),
  arrayUnique: () => ({ uniqueItems: true }),
  [ValidationTypes.CONDITIONAL_VALIDATION]: () => ({}),
  isBoolean: () => ({ type: 'boolean' }),
  isEmail: () => ({ format: 'email', type: 'string' }),
  isIn: meta => ({ enum: meta.constraints[0], type: 'string' }),
  isNotEmpty: () => ({ minLength: 1, type: 'string' }),
  isString: () => ({ type: 'string' }),
  maxLength: meta => ({ maxLength: meta.constraints[0], type: 'string' }),
  minLength: meta => ({ minLength: meta.constraints[0], type: 'string' }),
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
