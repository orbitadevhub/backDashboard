import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/updateProfileDto';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from 'src/auth/roles.enum';

export const roundOfHashing = 10;
@Injectable()
export class UsersService {
  async enableTwoFactor(userId: string) {
    await this.userRepository.update(userId, {
      twoFactorEnabled: true,
    });
  }

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const email = createUserDto.email.toLowerCase().trim();

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exist');
      }

      if (!createUserDto.password) {
        throw new ConflictException('Password is required');
      }

      const newUser = this.userRepository.create({
        ...createUserDto,
        email,
        password: createUserDto.password,
        roles: [Role.USER],
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el usuario'
      );
    }
  }
  async getTwoFactorSecret(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'twoFactorSecret', 'twoFactorEnabled'],
    });

    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('2FA no está configurado');
    }

    return user.twoFactorSecret;
  }
  async findByIdWithTwoFactorSecret(id: string) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'twoFactorSecret', 'twoFactorEnabled'],
    });
  }

  async findByEmailWithTwoFactor(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'roles',
        'twoFactorEnabled',
        'twoFactorSecret',
      ],
    });
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el usuario'
      );
    }
  }

  async findOrCreateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    name: string;
    roles: string[];
  }) {
    let user = await this.userRepository.findOne({
      where: { googleId: googleUser.googleId },
    });

    if (user) return user;

    user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });

    if (user) {
      user.googleId = googleUser.googleId;
      await this.userRepository.save(user);
      return user;
    }

    const newUser = this.userRepository.create({
      googleId: googleUser.googleId,
      email: googleUser.email,
      firstName: googleUser.name,
      lastName: googleUser.name,
      roles: [Role.USER],
    });

    return await this.userRepository.save(newUser);
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(`Error buscando usuario por email ${email}:`, error);
      throw new InternalServerErrorException(
        'Error al buscar el usuario por email'
      );
    }
  }

  async findOne(id: string) {
    try {
      const userById = await this.userRepository.findOne({
        where: { id },
      });
      if (!userById) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return userById;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(`Error buscando usuario ID ${id}:`, error);
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async update(id: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (dto.email) {
      const email = dto.email.toLowerCase().trim();

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          'El nuevo email ya está registrado por otro usuario'
        );
      }

      dto.email = email;
    }

    const updatedUser = await this.userRepository.preload({
      id,
      ...dto,
    });

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.userRepository.save(updatedUser);

    const { password, ...result } = updatedUser;
    return result;
  }

  async setTwoFactorSecret(userId: string, secret: string) {
    await this.userRepository.update(userId, {
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    });
  }

  async remove(id: string) {
    try {
      const userById = await this.userRepository.findOne({
        where: { id },
      });
      if (!userById) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      await this.userRepository.remove(userById);
      return { message: 'Eliminado correctamente', status: 200 };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(`Error buscando usuario ID ${id}:`, error);
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }
}
