import 'reflect-metadata'
import { getFromContainer, MetadataStorage } from 'class-validator' // tslint:disable-line
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { Express } from 'express'
import {
  createExpressServer,
  getMetadataArgsStorage
} from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'

import { UsersController } from './UsersController'

const app: Express = createExpressServer({
  controllers: [UsersController]
})

// Parse class-validator classes into JSON Schema:
const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas
const schemas = validationMetadatasToSchemas(metadatas, {
  refPointerPrefix: '#/components/schemas'
})

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, undefined, {
  components: { schemas },
  info: {
    description: 'Generated with `routing-controllers-openapi`',
    title: 'A sample API',
    version: '1.0.0'
  }
})

// Render spec on root:
app.get('/', (_req, res) => {
  res.json(spec)
})

app.listen(3001)
console.log(
  'Express server is running on port 3001. Open http://localhost:3001/users/'
)
