import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles, Users } from 'src/entities';
import { hashPassword } from 'src/utils/password';
import { Repository } from 'typeorm';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async create(username: string, password: string) {
    if (!username || !password) {
      return {
        status: 400,
        message: { message: 'Username and password are required' },
      };
    }
    try {
      const userExists = await this.usersRepository.findOneBy({ username });
      if (userExists) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const roleName = 'user';
      const role = await this.rolesRepository.findOneBy({
        name: roleName,
      });
      if (!role) {
        return { status: 500, message: { message: 'Role not found' } };
      }
      const hashedPassword = await hashPassword(password);
      await this.usersRepository.save({
        username,
        password: hashedPassword,
        role,
      });
      return {
        status: 201,
        message: { message: 'User registered successfully' },
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: { message: `Error registering user: ${error.message}` },
      };
    }
  }
}
