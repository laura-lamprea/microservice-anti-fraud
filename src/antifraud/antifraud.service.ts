import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { ProducerService } from "src/kafka/producer.service";
import { ConsumerService } from "src/kafka/consumer.service";

@Injectable()
export class AntifraudService implements OnModuleInit {
    constructor(private readonly producerService: ProducerService, private readonly consumerService: ConsumerService) { }

    async onModuleInit() {
        await this.consumerService.consume(
            'transactions',
            {
                eachMessage: async ({ topic, partition, message }) => {
                    const transaction = JSON.parse(message.value.toString());
                    await this.validate(transaction);
                }
            }
        )
    }

    async validate(transaction: any) {
        try {
            if (!transaction.accountExternalIdDebit || !transaction.accountExternalIdCredit || !transaction.tranferTypeId || !transaction.value)
                throw new BadRequestException('All fields are required');
            const isApproved = Math.random() > 0.5;
            await this.producerService.produce({
                topic: 'antifraud-transaction-status',
                messages: [
                    {
                        key: 'transaction-status',
                        value: JSON.stringify({ transactionId: transaction.id, status: isApproved ? 'approved' : 'rejected' }),
                    },
                ],
            });
        } catch (error) {
            throw new BadRequestException('Failed to validating transaction');
        }
    }
}