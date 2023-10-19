import { Test, TestingModule } from '@nestjs/testing';
import { MessageBrokerService } from './message_broker.service';

describe('MessageBrokerService', () => {
  let service: MessageBrokerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageBrokerService],
    }).compile();

    service = module.get<MessageBrokerService>(MessageBrokerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
