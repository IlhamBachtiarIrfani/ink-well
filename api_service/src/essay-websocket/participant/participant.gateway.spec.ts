import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantGateway } from './participant.gateway';

describe('ParticipantGateway', () => {
  let gateway: ParticipantGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantGateway],
    }).compile();

    gateway = module.get<ParticipantGateway>(ParticipantGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
