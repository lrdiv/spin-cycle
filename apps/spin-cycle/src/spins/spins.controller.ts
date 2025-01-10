import { Controller, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';

@Controller('/spins')
@UseGuards(AuthGuard)
export class SpinsController {}
