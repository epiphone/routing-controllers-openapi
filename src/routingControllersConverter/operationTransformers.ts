// tslint:disable:no-submodule-imports
import * as _ from 'lodash'
import * as oa from 'openapi3-ts'
import { ParamMetadataArgs } from 'routing-controllers/metadata/args/ParamMetadataArgs'
import { ResponseHandlerMetadataArgs } from 'routing-controllers/metadata/args/ResponseHandleMetadataArgs'

const debug = require('debug')('routing-controllers-openapi')

export type RoutingControllerMetadata = ParamMetadataArgs | ResponseHandlerMetadataArgs
export interface IParamTransformers {
  [argType: string]: Transformer<ParamMetadataArgs>
}
export interface IResponseHandlerTransformers {
  [argType: string]: Transformer<ResponseHandlerMetadataArgs>
}

export interface ITransformers {
  [type: string]: Transformer<ParamMetadataArgs | ResponseHandlerMetadataArgs>
}

export type Transformer<T> = (
  operation: oa.OperationObject,
  arg: T
) => oa.OperationObject

export const defaultParamTransformers: IParamTransformers = {}

export const defaultResponseHandlerTransformers: IResponseHandlerTransformers = {
  'success-code': (op, arg) => {
    const responses = {
      ..._.omit(op.responses, '200'),
      '201': op.responses['200']
    }
    return { ...op, responses }
  }
}

export function apply(
  operation: oa.OperationObject,
  args: RoutingControllerMetadata[],
  additionalTransformers: ITransformers = {}
) {
  const transformers = {...default}
  return _.reduce(
    args,
    (acc, arg) => {
      const transform = transformers[arg.type]
      if (transform) {
        return transform(acc, arg)
      }
      debug('No handler found for routing-controller metadata', arg)
      return acc
    },
    operation
  )
}
// export function apply<T extends { type: string }>(
//   operation: oa.OperationObject,
//   args: T[],
//   additionalTransformers: { [type: string]: Transformer<T> } = {}
// ) {
//   const transformers = {...default}
//   return _.reduce(
//     args,
//     (acc, arg) => {
//       const transform = transformers[arg.type]
//       if (transform) {
//         return transform(acc, arg)
//       }
//       debug('No handler found for routing-controller metadata', arg)
//       return acc
//     },
//     operation
//   )
// }
