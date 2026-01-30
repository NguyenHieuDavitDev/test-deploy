import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductsModule } from './products/products.module';

function parseJdbcUrl(jdbcUrl: string) {
  // Bỏ "jdbc:"
  const url = jdbcUrl.replace('jdbc:', '');

  // tách host:port
  const [serverPart, paramsPart] = url.split(';', 2);
  const server = serverPart.replace('sqlserver://', '');

  const [host, portStr] = server.split(':');

  const params = new URLSearchParams(
    paramsPart?.replace(/;/g, '&') ?? '',
  );

  return {
    host,
    port: Number(portStr),
    database: params.get('databaseName') || '',
    encrypt: params.get('encrypt') === 'true',
    trustServerCertificate: params.get('trustServerCertificate') === 'true',
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const jdbcUrl = config.get<string>('DB_URL');
        if (!jdbcUrl) {
          throw new Error('DB_URL is missing');
        }

        const db = parseJdbcUrl(jdbcUrl);

        return {
          type: 'mssql',
          host: db.host,
          port: db.port,
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: db.database,

          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,

          options: {
            encrypt: db.encrypt,
            enableArithAbort: true,
          },

          extra: {
            trustServerCertificate: db.trustServerCertificate,
            charset: 'utf8',
          },
        };
      },
    }),

    ProductsModule,
  ],
})
export class AppModule {}
