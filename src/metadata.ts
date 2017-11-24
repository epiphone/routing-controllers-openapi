import 'reflect-metadata'

export function getParamTypes(target: object, property: string) {
  return Reflect.getMetadata('design:paramtypes', target, property)
}

export function getPropType(target: object, property: string) {
  return Reflect.getMetadata('design:type', target, property)
}
