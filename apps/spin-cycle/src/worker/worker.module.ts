import { Module } from '@nestjs/common';

import { DiscogsModule } from '../discogs/discogs.module';
import { SpinsModule } from '../spins/spins.module';
import { UserModule } from '../users/user.module';
import { WorkerService } from './worker.service';

@Module({
  providers: [WorkerService],
  imports: [DiscogsModule, SpinsModule, UserModule],
})
export class WorkerModule {}
