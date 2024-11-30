import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RMQ_URL')],
            queue: configService.get<string>('RMQ_NOTI_QUEUE'),
            queueOptions: {
              durable: true,
              arguments: {
                'x-dead-letter-exchange': 'dead-letter-exchange', // DLX name
                'x-dead-letter-routing-key': 'dead-letter-routing-key', // Routing key for the DLX
                // 'x-message-ttl': 10000, // TTL (optional)
                // 'x-expires': 10000,
              },
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}
