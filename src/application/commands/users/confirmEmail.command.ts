import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ResponseModel,
  RESPONSE_STATUS,
} from 'src/application/core/configs/response-status.config';
import { AuthService } from 'src/application/core/auth/auth.service';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/domain/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/application/core/auth/auth.config';
import { EmailService } from 'src/application/core/ultils/email.service';
import { BadRequestException } from '@nestjs/common';

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
  constructor(
    private emailService: EmailService,
    private jwtService: JwtService,
  ) { }

  public async execute(
    command: ConfirmEmailCommand,
  ): Promise<
    ResponseModel<boolean>
  > {
    const response = new ResponseModel<boolean>();
    const payload = await this.jwtService.verify(command.token, {
      secret: jwtConstants.secret,
    });
    let email = "";
    if (typeof payload === 'object' && 'username' in payload) {
      email = payload.username;
    }
    if (email == "") {
      throw new BadRequestException('Email not found');
    }
    await this.emailService.confirmEmail(email);
    response.data = true;
    response.status = RESPONSE_STATUS.SUCCESSED;
    response.message = 'Login successfully';
    return response;
  }
}
