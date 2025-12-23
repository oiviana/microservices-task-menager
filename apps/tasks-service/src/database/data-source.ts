import 'reflect-metadata'; // Necessário para leitura dos decorators
import { DataSource } from 'typeorm'; // Configuração + conexão com o banco
import { entities } from './entities'; // Array com todas as entidades

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'microservices_tasks',
  entities: entities,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});

export default AppDataSource;
