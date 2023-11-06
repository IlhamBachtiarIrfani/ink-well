import { Test, TestingModule } from '@nestjs/testing';
import { EssayWebsocketService } from './essay-websocket.service';

describe('EssayWebsocketService', () => {
  let service: EssayWebsocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EssayWebsocketService],
    }).compile();

    service = module.get<EssayWebsocketService>(EssayWebsocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
