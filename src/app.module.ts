import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RenderModule } from 'nest-next';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupModule } from './signup/signup.module';
import { LoginModule } from './login/login.module';
import { VerifedModule } from './verifed/verifed.module';
import { AdminModule } from './admin/admin.module';
import { UserSignupModule } from './user_signup/user_signup.module';
import { UserloginModule } from './userlogin/userlogin.module';
import { ForgetpasswordModule } from './forgetpassword/forgetpassword.module';
import { TaskModule } from './task/task.module';
import { Auth } from './modules/manager';
import { Employee_db } from './modules/employee';
import { Task_DB } from './modules/task_db';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { MemcachedModule } from '@andreafspeziale/nestjs-memcached';
import { UpdatepasswordModule } from './updatepassword/updatepassword.module';
import { EmployeesModule } from './employees/employees.module';
import { TasksModule } from './tasks/tasks.module';
import { EmployeetaskModule } from './employeetask/employeetask.module';
import { TrackingModule } from './tracking/tracking.module';
import { MyGateway } from './websocket/websocket';
import {  WebSocketModule } from './websocket/websocket.module';
import { EmployeedbliveTrackModule } from './employeedblive-track/employeedblive-track.module';
import { UplodimagesModule } from './uplodimages/uplodimages.module';
import { AzureBlobModule } from './azure-storage/azura-blob.module';
import { TasksforemployeeModule } from './tasksforemployee/tasksforemployee.module';
import { AzureStorgeDownloadModule } from './azure-storge-download/azure-storge-download.module';
import { NotifactionModule } from './notifaction/notifaction.module';
import { NotifactionGateway } from './notifaction/notifaction.gateway';
import { ManagerNotification } from './modules/manager_notication';
import { EmployeeNotification } from './modules/employee_notication';
import { ManageridModule } from './managerid/managerid.module';
import { ManagernotificationsModule } from './managernotifications/managernotifications.module';
import { PinManager } from './encryption/encriptionfunction';
import { RabbitMQConsumerService } from './queueWorker/rabbitmq.controller';
import { RabbitMQProducerService } from './queueWorker/rabbitmq.producer';
import { RabbitModule } from './queueWorker/rabbit.module';
import { AuthModule } from './jwt/jwt.module';
import { KPI } from './modules/performance';

// Define all entities in one place
const allEntities = [
  Auth,
  Employee_db,
  Task_DB,
  ManagerNotification,
  EmployeeNotification,
  KPI
];

@Module({
  imports: [ 
    ConfigModule.forRoot({ isGlobal: true,  envFilePath: `.env`,
 }),
     
    

    ...(process.env.MODE == 'prod'
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
                  name: 'default',

useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get<string>('DB_HOST_PROD'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME_PROD'),
          password: configService.get<string>('DB_PASSWORD_PROD'),
          database: configService.get<string>('DB_NAME_Auth_PROD'),
          entities: allEntities,
          synchronize: true,
          logging: false,
        }),
            inject: [ConfigService],
          }),
        ]
      : [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
             name:"auth_db",

            useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_NAME_Auth'),
              entities: [Auth, Employee_db],
              synchronize: true,
              logging: true,
            }),
            inject: [ConfigService],
          }),
     TypeOrmModule.forRootAsync({
  name: 'task_db',
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('DB_HOST');
    const port = Number(configService.get<number>('DB_PORT'));
    const username = configService.get<string>('DB_USERNAME');
    const password = configService.get<string>('DB_PASSWORD');
    const dbName = configService.get<string>('DB_NAME_task');

    console.log('[task_db] Connecting to DB with:', {
      host,
      port,
      username,
      passwordHidden: !!password,
      dbName,
    });

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database: dbName,
      entities: [Task_DB, KPI],
      synchronize: true,
      logging: true    };
  },
  inject: [ConfigService],
}),

TypeOrmModule.forRootAsync({
  name: 'notification',
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const host = configService.get<string>('DB_HOST');
    const port = Number(configService.get<number>('DB_PORT'));
    const username = configService.get<string>('DB_USERNAME');
    const password = configService.get<string>('DB_PASSWORD');
    const dbName = configService.get<string>('DB_NAME_notification');

    console.log('[notification] Connecting to DB with:', {
      host,
      
      port,
      username,
      passwordHidden: !!password,
      dbName,
    });

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database: dbName,
      entities: [ManagerNotification, EmployeeNotification],
      synchronize: true,
      logging: true,
    };
  },
  inject: [ConfigService],
}),

        ]),
        MemcachedModule.forRoot({
      connections: [
        {
          host: 'localhost',
          port: 11212,
        },
      ],
      ttl: 60,
      ttr: 30,
      superjson: true,
      keyProcessor: (key) => `prefix_${key}`,
      wrapperProcessor: ({ value, ttl, ttr }) => ({
        content: value,
        ttl,
        ...(ttr ? { ttr } : {}),
        createdAt: new Date(),
      }),
      log: true,
    }),
process.env.MODE == 'prod'
  ? TypeOrmModule.forFeature([Auth])
  : TypeOrmModule.forFeature([Auth], 'auth_db')

,
    AuthModule,
    SignupModule,
    LoginModule,
    VerifedModule,
    AdminModule,
    UserSignupModule,
    UserloginModule,
    ForgetpasswordModule,
    TaskModule,
    ResetPasswordModule,
    UpdatepasswordModule,
    EmployeesModule,
    TasksModule,
    AzureBlobModule,
    EmployeetaskModule,
    TrackingModule,
    AzureBlobModule,
    RabbitModule,
    WebSocketModule,
    EmployeedbliveTrackModule,
    UplodimagesModule,
    TasksforemployeeModule,
    AzureStorgeDownloadModule,
    NotifactionModule,
    ManageridModule,
    ManagernotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService, MyGateway, NotifactionGateway],
})
export class AppModule {}