import { Body, Controller, HttpStatus, Post, Request, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordCommand, LoginCommand, RegisterUserCommand } from 'src/application/commands/users/_index';
import { ROLE_CONFIG } from 'src/application/core/auth/auth.config';
import { JwtAuthGuard } from 'src/application/core/auth/jwt-auth.guard';
import { Roles } from 'src/application/core/decorators/roles.decorator';
@UseGuards(JwtAuthGuard)
@Controller('api/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Roles(ROLE_CONFIG.anonymous)
  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  public async registerUser(
    @Body() body: RegisterUserCommand,
    @Request() req,
    @Res() response,
    @UploadedFile() file
  ) {
    const commandResponse = await this.commandBus.execute(
      new RegisterUserCommand(body.username, body.password, file ,req.ip),
    );
    response.status(HttpStatus.OK).json(commandResponse);
  }

  @Roles(ROLE_CONFIG.logged)
  @Post('change-password')
  public async changePassword(
    @Body() body: ChangePasswordCommand,
    @Res() response,
  ) {
    const commandResponse = await this.commandBus.execute(
      new ChangePasswordCommand(
        body.username,
        body.old_password,
        body.new_password,
      ),
    );

    response.status(HttpStatus.OK).json(commandResponse);
  }

  @Roles(ROLE_CONFIG.anonymous)
  @Post('login')
  public async loginUser(@Body() body: LoginCommand, @Res() response) {
    const commandResponse = await this.commandBus.execute(
      new LoginCommand(body.username, body.password),
    );

    response.status(HttpStatus.OK).json(commandResponse);
  }

  @Roles(ROLE_CONFIG.anonymous)
  @Post('confirm')
  public async confirm(@Body() confirmationData) {
   
  }
}
