import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionInfo } from '~/common/constants/config';

@Controller('session')
export class SessionController {
  constructor(private session: SessionService) {}

  @Get('/')
  public async sessions() {
    const sessions = await this.session.all();
    return `<select name="select-partition">
      <option value="">Not select</option>
      ${Object.values(sessions)
        .map(
          (ses) =>
            `<option value="${ses.partition}">Partition: ${ses.partition}(${ses.homepage})</option>`,
        )
        .join('\n')}
    </select>`;
  }

  @Post('/')
  @Header('HX-Trigger', 'load-sessions')
  public async create(@Body() payload: SessionInfo) {
    return this.session.set(payload);
  }
}
