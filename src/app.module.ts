import { Module } from '@nestjs/common';
import { AntifraudModule } from './antifraud/antifraud.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    AntifraudModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }