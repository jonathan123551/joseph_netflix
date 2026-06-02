import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMinistryDto } from './dto/create-ministry.dto';
import { UpdateMinistryDto } from './dto/update-ministry.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MinistriesService {
  constructor(private prisma: PrismaService) {}

  create(createMinistryDto: CreateMinistryDto) {
    return this.prisma.ministry.create({
      data: createMinistryDto,
    });
  }

  findAll() {
    return this.prisma.ministry.findMany();
  }

  async findOne(id: string) {
    const ministry = await this.prisma.ministry.findUnique({
      where: { id },
    });
    if (!ministry) {
      throw new NotFoundException(`Ministry with id ${id} not found`);
    }
    return ministry;
  }

  update(id: string, updateMinistryDto: UpdateMinistryDto) {
    return this.prisma.ministry.update({
      where: { id },
      data: updateMinistryDto,
    });
  }

  remove(id: string) {
    return this.prisma.ministry.delete({
      where: { id },
    });
  }
}
