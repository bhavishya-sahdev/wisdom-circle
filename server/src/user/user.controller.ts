import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import {
  AuthenticateUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.userService.create(createUserDto, res);
  }

  @Post('authenticate')
  authenticate(
    @Body() authenticateUserDto: AuthenticateUserDto,
    @Res() res: Response,
  ) {
    return this.userService.authenticate(authenticateUserDto, res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    return this.userService.update(+id, updateUserDto, res);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.userService.remove(+id, res);
  }
}
