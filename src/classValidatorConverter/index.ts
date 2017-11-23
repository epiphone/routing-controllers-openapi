// tslint:disable:no-submodule-imports
import { ValidationTypes } from 'class-validator'
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata'
import * as _ from 'lodash'
import { SchemaObject } from 'openapi3-ts'
const debug = require('debug')('routing-controllers-openapi')

import { defaultConverters, ISchemaConverters } from './defaultConverters'

export interface IOptions {
  /**
   * A map of additional metadata-to-schema
   * converters that can be used to supplement or override the default ones. The
   * key should correspond to the 'type' property of a ValidationMetadata object.
   */
  additionalConverters?: ISchemaConverters
}

/**
 * Convert class-validator metadata objects into OpenAPI Schema definitions.
 * @param metadatas All class-validator metadata objects.
 */
export function validationMetadatasToSchemas(
  metadatas: ValidationMetadata[],
  options: IOptions = {}
) {
  const converters = {
    ...defaultConverters,
    ...options.additionalConverters
  }
  const schemas: { [key: string]: SchemaObject } = _(metadatas)
    .groupBy('target.name')
    .map((metas, schemaName) => {
      const properties = _(metas)
        .groupBy('propertyName')
        .mapValues(d =>
          // @ts-ignore: array spread
          _.merge(...d.map(m => getSchemaProperties(m, converters)))
        )
        .value()

      const schema = {
        properties,
        required: getRequiredPropNames(metas),
        type: 'object'
      }

      return [schemaName, schema]
    })
    .fromPairs()
    .value()

  return schemas
}

/**
 * Convert class-validator metadata into OpenAPI Schema properties.
 */
function getSchemaProperties(
  meta: ValidationMetadata,
  converters: ISchemaConverters
): SchemaObject {
  if (!converters[meta.type]) {
    debug('No schema converter found for validation metadata', meta)
    return {}
  }

  const items = converters[meta.type](meta)
  return meta.each ? { items, type: 'array' } : items
}

/**
 * Get the required property names of a validated class.
 * @param metadatas Validation metadata objects of the validated class.
 */
function getRequiredPropNames(metadatas: ValidationMetadata[]) {
  return _(metadatas)
    .groupBy('propertyName')
    .mapValues(d => _.find(d, { type: ValidationTypes.CONDITIONAL_VALIDATION }))
    .omitBy(d => d)
    .keys()
    .value()
}
