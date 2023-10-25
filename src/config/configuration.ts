export enum Environment {
  Production = 'production',
  Staging = 'staging',
  Development = 'development',
}

export interface Configuration {
  env: Environment;
  port: string;
  seed: {
    email: string;
    password: string;
  };
  app: {
    enableCron: string;
    enableSeed: string;
  };
  logLevel: string;
  loggly: {
    token: string;
    subdomain: string;
  };
  database: {
    port: string;
    host: string;
    name: string;
    user: string;
    test: string;
    password: string;
    debug: string;
    options: string;
    ssl: {
      ca: string;
    };
  };
  isTest(): boolean;
  isDev(): boolean;
  isProd(): boolean;
  cronEnabled(): boolean;
  jwt: {
    secret: string;
    expiresIn: string | number;
  };

}

export default (): Configuration => ({
  env: process.env.NODE_ENV as Environment,
  port: process.env.HTTP_PORT,
  app: {
    enableCron: process.env.ENABLED_CRON,
    enableSeed: process.env.ENABLED_SEED,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    name: process.env.DATABASE_NAME,
    test: process.env.TEST_DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    debug: process.env.DATABASE_DEBUG,
    options: process.env.DATABASE_OPTIONS,
    ssl: {
      ca: process.env.DATABASE_SSL_CA,
    },
  },
  seed: {
    email: process.env.SEED_EMAIL,
    password: process.env.SEED_PASSWORD,
  },

  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  },
  isDev(): boolean {
    return ['staging', 'development', 'local'].includes(process.env.NODE_ENV);
  },
  isProd(): boolean {
    return process.env.NODE_ENV === 'production';
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  logLevel: process.env.LOGGER_LOG_LEVEL,
  loggly: {
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
  },
  cronEnabled(): boolean {
    return process.env.ENABLED_CRON === 'true';
  },
 

});
