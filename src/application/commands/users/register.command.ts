import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/domain/entities/user.entity';
import { UsersRepository } from 'src/infrastructure/repositories/user.repository';
import { SecurityService } from 'src/application/core/securities/security.service';
import {
  ResponseModel,
  RESPONSE_STATUS,
} from 'src/application/core/configs/response-status.config';
import { ROLE_CONFIG } from 'src/application/core/auth/auth.config';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserCommand {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  last_ip: string;
  constructor(username: string, password: string, last_ip: string) {
    this.username = username;
    this.password = password;
    this.last_ip = last_ip;
  }
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly securityService: SecurityService,
  ) {}

  public async execute(
    command: RegisterUserCommand,
  ): Promise<ResponseModel<Users>> {
    let response = new ResponseModel();
    const userTemp = await this.usersRepository.getByUserName(command.username);
    if (userTemp) {
      response.status = RESPONSE_STATUS.ERROR;
      response.message = 'Exists user';
      return response as ResponseModel<Users>;
    }
    const user = new Users();
    const password = await this.securityService.encryptPassword(
      command.password,
    );
    user.password = password.hash;
    user.password_salt = password.salt;
    user.username = command.username;
    user.last_ip = command.last_ip;
    user.role_id = ROLE_CONFIG.admin;
    response.data = await this.usersRepository.insertData(user);
    response.status = RESPONSE_STATUS.SUCCESSED;
    response.message = 'Created user successfully';
    return response as ResponseModel<Users>;
  }
}
