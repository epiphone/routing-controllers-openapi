// tslint:disable:no-submodule-imports
import * as _ from 'lodash'
import * as oa from 'openapi3-ts'
import { ParamMetadataArgs } from 'routing-controllers/metadata/args/ParamMetadataArgs'
import { ResponseHandlerMetadataArgs } from 'routing-controllers/metadata/args/ResponseHandleMetadataArgs'

const debug = require('debug')('routing-controllers-openapi')

import * as metadata from '../metadata'

export interface IParamConverters {
  [argType: string]: Converter<ParamMetadataArgs>
}
export interface IResponseHandlerConverters {
  [argType: string]: Converter<ResponseHandlerMetadataArgs>
}

export type Converter<T> = (arg: T) => Partial<oa.OperationObject>

export const defaultParamConverters: IParamConverters = {
  body: meta => {
    const type = metadata.getParamTypes(meta.object, meta.method)[meta.index]
    return {
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/' + type.name } // TODO reuse
          }
        },
        description: type.name,
        required: meta.required !== false // TODO handle global required option
      }
    }
  },
  param: meta => {
    const typeCls = metadata.getParamTypes(meta.object, meta.method)[meta.index]
    const type = _.isNumber(typeCls.prototype) ? 'number' : 'string' // TODO improve handling

    return {
      parameters: [
        {
          in: 'path',
          name: meta.name || '',
          required: meta.required !== false, // TODO handle global required option
          schema: { type }
        }
      ]
    }
  },
  queries: _meta => ({})
}

export function parseParamMetadata(
  param: ParamMetadataArgs,
  converters: IParamConverters
): Partial<oa.OperationObject> {
  if (!converters[param.type]) {
    debug('No schema converter found for param metadata', param)
    return {}
  }

  return converters[param.type](param)
}
