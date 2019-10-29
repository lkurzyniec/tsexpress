import { DbLogger } from './../loggers/db.logger';
import { AppConfig } from './../configurations/app.config';
import * as mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import { isNullOrWhitespace } from './../helpers/string.helper';

@injectable()
export class MongoDbConnector {
  @inject(AppConfig) private readonly appConfig: AppConfig;
  @inject(DbLogger) private readonly dbLogger: DbLogger;

  public connect(): void {
    const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

    let connector;
    if (isNullOrWhitespace(this.appConfig.mongoUser) && isNullOrWhitespace(this.appConfig.mongoPassword)) {
      connector = mongoose.connect(`mongodb://${this.appConfig.mongoHost}:${this.appConfig.mongoPort}/${this.appConfig.mongoDatabase}`, connectionOptions);
    } else {
      connector = mongoose.connect(`mongodb://${this.appConfig.mongoUser}:${this.appConfig.mongoPassword}@${this.appConfig.mongoHost}:${this.appConfig.mongoPort}/${this.appConfig.mongoDatabase}`, connectionOptions);
    }

    connector.then(
      () => {
        this.dbLogger.info(`Successfully connected to '${this.appConfig.mongoDatabase}'.`);
      },
      err => {
        this.dbLogger.error(err, `Error while connecting to '${this.appConfig.mongoDatabase}'.`);
      }
    );

    //mongoose.set('debug', true);
  }

  public static globalSchemaOptions(): mongoose.SchemaOptions {
    return {
      toJSON: {
        versionKey: false,
      }
    };
  }
}
