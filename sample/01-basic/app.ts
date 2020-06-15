import 'reflect-metadata'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import { Express } from 'express'
import {
  createExpressServer,
  getMetadataArgsStorage
} from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import * as swaggerUiExpress from 'swagger-ui-express';

import { UsersController } from './UsersController'

const routingControllersOptions = {
  controllers: [UsersController],
  routePrefix: '/api'
}
const app: Express = createExpressServer(routingControllersOptions)

// Parse class-validator classes into JSON Schema:
const schemas = validationMetadatasToSchemas({
  refPointerPrefix: '#/components/schemas/'
})

// Parse routing-controllers classes into OpenAPI spec:
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage, routingControllersOptions, {
  components: {
    schemas,
    securitySchemes: {
      basicAuth: {
        scheme: 'basic',
        type: 'http'
      }
    }
  },
  info: {
    description: 'Generated with `routing-controllers-openapi`',
    title: 'A sample API',
    version: '1.0.0'
  }
})

app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

// Render spec on root:
app.get('/', (_req, res) => {
  res.json(spec)
})

app.listen(3001)
console.log(
  'Express server is running on port 3001. Open http://localhost:3001/users/'
)
