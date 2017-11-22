// tslint:disable:no-submodule-imports
import { MetadataStorage } from 'class-validator'
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata'
import * as _ from 'lodash'
import { SchemaObject } from 'openapi3-ts'

const debug = require('debug')('routing-controllers-openapi')

import * as metadata from './metadata'

export interface ISchemas {
  [name: string]: SchemaObject
}
export interface ISchemaConverters {
  [validatorType: string]: SchemaConverter
}
export type SchemaConverter = (meta: ValidationMetadata) => SchemaObject

export const defaultConverters: ISchemaConverters = {
  arrayNotEmpty: () => ({ minItems: 1 }),
  arrayUnique: () => ({ uniqueItems: true }),
  isBoolean: () => ({ type: 'boolean' }),
  isEmail: () => ({ format: 'email', type: 'string' }),
  isIn: meta => ({ enum: meta.constraints[0], type: 'string' }),
  isNotEmpty: () => ({ minLength: 1, type: 'string' }),
  isString: () => ({ type: 'string' }),
  maxLength: meta => ({ maxLength: meta.constraints[0], type: 'string' }),
  minLength: meta => ({ minLength: meta.constraints[0], type: 'string' }),
  nestedValidation: meta => {
    if (_.isFunction(meta.target)) {
      const type = metadata.getPropType(
        meta.target.prototype,
        meta.propertyName
      )
      return { $ref: getSchemaRef(type) }
    }
    return {}
  }
}

export function metadataToJSONSchema(storage: MetadataStorage): ISchemas {
  const metadatas: ValidationMetadata[] = _.get(storage, 'validationMetadatas')

  return _.reduce(
    metadatas,
    (acc: ISchemas, meta) => {
      const name: string = _.isString(meta.target)
        ? meta.target
        : meta.target.name
      const schema: SchemaObject = acc[name] || { required: [], type: 'object' }
      if (!schema.properties) {
        schema.properties = {}
      }
      const property: SchemaObject = schema.properties[meta.propertyName] || {}
      const schemaProps = getSchemaPropsFromMetadata(meta)
      schema.properties[meta.propertyName] = meta.each
        ? {
            ...property,
            items: { ...property.items, ...schemaProps },
            type: 'array'
          }
        : { ...property, ...schemaProps }

      // TODO handle .isOptional():
      if (!_.includes(schema.required, meta.propertyName)) {
        schema.required = (schema.required || []).concat(meta.propertyName)
      }

      return { ...acc, [name]: schema }
    },
    {}
  )
}

/**
 * Return OpenAPI schema properties derived from a ValidationMetadata object.
 *
 * @param meta A single ValidationMetadata object
 * @param additionalConverters A map of additional metadata-to-schema converters
 * that can be used to supplement or override the default ones. The key should
 * correspond to the 'type' property of a ValidationMetadata object.
 */
export function getSchemaPropsFromMetadata(
  meta: ValidationMetadata,
  additionalConverters: ISchemaConverters = {}
): SchemaObject {
  const converters: ISchemaConverters = {
    ...defaultConverters,
    ...additionalConverters
  }
  if (!converters[meta.type]) {
    debug('No schema converter found for validation metadata', meta)
    return {}
  }

  return converters[meta.type](meta)
}

function getSchemaRef(target: string | { name: string }) {
  return '#/components/schemas/' + (_.isString(target) ? target : target.name)
}
