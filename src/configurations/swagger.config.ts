import { AppConfig } from './app.config';
import { injectable, inject } from 'inversify';
import * as swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { Application, Router } from 'express';

@injectable()
export class SwaggerConfig {
  @inject(AppConfig) private readonly appConfig: AppConfig;

  public initialize(app: Application) {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'Very simple API in NodeJS using express',
          version: '1.0.2',
          description: 'Made by Łukasz K.',
          contact: {
            url: 'https://kurzyniec.pl'
          }
        },
        schemes: ['http'],
        host: `${this.appConfig.applicationHost}:${this.appConfig.applicationPort}`,
        basePath: this.appConfig.apiPath,
      },
      apis: [
        `${this.appConfig.sourcePath}/controllers/*.controller.ts`,
        `${this.appConfig.sourcePath}/dtos/**/*.dto.ts`,
      ]
    }

    const swaggerSpec = swaggerJSDoc(options);

    const swaggerRouter = Router();
    swaggerRouter.get('/v1/swagger.json', function (req, res) {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerSpec)
    })
    swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/swagger', swaggerRouter);
  }
}
