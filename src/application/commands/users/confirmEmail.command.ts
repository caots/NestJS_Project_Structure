import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ResponseModel,
  RESPONSE_STATUS,
} from 'src/application/core/configs/response-status.config';
import { AuthService } from 'src/application/core/auth/auth.service';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/domain/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailCommand {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}

@CommandHandler(ConfirmEmailCommand)
export class LoginHandler implements ICommandHandler<ConfirmEmailCommand> {
  constructor(private authService: AuthService) {}

  public async execute(
    command: ConfirmEmailCommand,
  ): Promise<
    ResponseModel<{
      user: Users
    }>
  > {
    const response = new ResponseModel<{
      user: Users
    }>();
    
    // response.data = {};
    response.status = RESPONSE_STATUS.SUCCESSED;
    response.message = 'Login successfully';
    return response;
  }
}
