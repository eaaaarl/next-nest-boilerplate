import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async userList() {
    const data = await this.userService.userList();

    return {
      success: true,
      statusCode: 200,
      data,
      meta: {},
    };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() dto: UserDTO) {
    return this.userService.createUser({
      course: dto.course,
      name: dto.name,
      studentID: dto.studentID,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findByIdUser(@Param('id') id: string) {
    const data = await this.userService.findByIdUser(id);
    return {
      success: true,
      statusCode: 200,
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/edit')
  async updateUser(@Param('id') id: string, @Body() payload: UserDTO) {
    const data = await this.userService.updateUser(id, {
      name: payload.name,
      course: payload.course,
      studentID: payload.studentID,
    });

    return {
      success: true,
      statusCode: 201,
      data,
    };
  }
}
