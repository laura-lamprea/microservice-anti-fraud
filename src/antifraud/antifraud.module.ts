import { Module } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Module({
  providers: [AntifraudService, ProducerService, ConsumerService],
})
export class AntifraudModule { }
