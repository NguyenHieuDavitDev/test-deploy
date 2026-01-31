import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';

function parseJdbcUrl(jdbcUrl: string) {
  const url = jdbcUrl.replace('jdbc:sqlserver://', '');
  const [hostPort, ...params] = url.split(';');
  const [host, port] = hostPort.split(':');

  const database =
    params.find(p => p.startsWith('databaseName='))?.split('=')[1];

  return { host, port: Number(port), database };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (!process.env.DB_URL) {
          throw new Error('DB_URL is missing');
        }

        const { host, port, database } = parseJdbcUrl(process.env.DB_URL);

        return {
          type: 'mssql',
          host,
          port,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database,
          entities: [Product],
          synchronize: true,
          options: {
            encrypt: true,
            trustServerCertificate: true,
          },
        };
      },
    }),

      ProductsModule,
  ],
})
export class AppModule {}
