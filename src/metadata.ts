import 'reflect-metadata'

export function getPropType(target: object, property: string) {
  return Reflect.getMetadata('design:type', target, property)
}
