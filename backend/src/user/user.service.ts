import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async userList() {
    return await this.prisma.student.findMany({
      orderBy: {
        studentId: 'asc',
      },
    });
  }

  async createUser(dto: UserDTO) {
    try {
      const { course, name, studentID } = dto;

      const newUser = await this.prisma.student.create({
        data: {
          course,
          name,
          studentId: studentID,
        },
      });

      return newUser;
    } catch (e) {
      console.error('[USER_CREATE_SERVICE_ERROR]', e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      if (e.code === 'P2002') {
        throw new ConflictException('Student ID already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: string) {
    return await this.prisma.student.delete({ where: { id } });
  }

  async findByIdUser(id: string) {
    return await this.prisma.student.findUnique({ where: { id } });
  }

  async updateUser(id: string, dto: UserDTO) {
    try {
      if (!id) {
        throw new BadRequestException('User Id is missing');
      }

      const existingUser = await this.prisma.student.findUnique({
        where: {
          id,
        },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const updateUser = await this.prisma.student.update({
        where: {
          id,
        },
        data: {
          course: dto.course,
          studentId: dto.studentID,
          name: dto.name,
        },
      });

      return updateUser;
    } catch (e) {
      console.error('[USER_EDIT_SERVICE_ERROR]', e);

      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
      if (e.code === 'P2002') {
        throw new ConflictException('Student ID already exists');
      }

      throw new InternalServerErrorException();
    }
  }
}
