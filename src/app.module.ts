import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product } from './products/product.entity';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';

function parseJdbcUrl(jdbcUrl: string) {
  const url = jdbcUrl.replace('jdbc:sqlserver://', '');
  const [hostPort, ...params] = url.split(';');
  const [host, port] = hostPort.split(':');

  const database =
    params
      .find(p => p.startsWith('databaseName='))
      ?.split('=')[1] || '';

  return {
    host,
    port: Number(port),
    database,
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // CASE 1: DÙNG DB_URL (Render)
        if (process.env.DB_URL) {
          const { host, port, database } = parseJdbcUrl(
            process.env.DB_URL,
          );

          console.log(' Using DB_URL:', host, port, database);

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
        }

        // CASE 2: DÙNG DB_HOST (local fallback)
        console.log(' Using DB_HOST fallback');

        return {
          type: 'mssql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [Product],
          synchronize: true,
          options: {
            encrypt: true,
            trustServerCertificate: true,
          },
        };
      },
    }), ProductsModule],
  controllers: [AppController],
})
export class AppModule {}
