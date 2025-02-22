import { Injectable } from '@nestjs/common';
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
    const { course, name, studentID } = dto;

    const newUser = await this.prisma.student.create({
      data: {
        course,
        name,
        studentId: studentID,
      },
    });

    return newUser;
  }

  async deleteUser(id: string) {
    return await this.prisma.student.delete({ where: { id } });
  }
}
