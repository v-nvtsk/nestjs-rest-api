import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@/entities/users.entity';
import { Roles } from '@/entities/roles.entity';
import { hashPassword } from '../../utils/password';

@Injectable()
export class DatabaseInitService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async onApplicationBootstrap() {
    await this.initRoles();
    await this.initAdmin();
  }

  private async initRoles() {
    const roles = ['admin', 'interviewer', 'user'];

    for (const roleName of roles) {
      const existingRole = await this.rolesRepository.findOneBy({
        name: roleName,
      });
      if (!existingRole) {
        const role = this.rolesRepository.create({ name: roleName });
        await this.rolesRepository.save(role);
        // eslint-disable-next-line no-console
        console.log(`Role "${roleName}" added.`);
      }
    }
  }

  private async initAdmin() {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';

    const existingAdmin = await this.usersRepository.findOneBy({
      username: adminUsername,
    });
    if (!existingAdmin) {
      const hashedPassword = await hashPassword(adminPassword);

      const adminRole = await this.rolesRepository.findOneBy({ name: 'admin' });

      const admin = await this.usersRepository.create({
        username: adminUsername,
        password: hashedPassword,
        role: adminRole,
      });

      await this.usersRepository.save(admin);
      // eslint-disable-next-line no-console
      console.log(`Admin user "${adminUsername}" created.`);
    } else {
      console.error(`Admin user "${adminUsername}" already exists.`);
    }
  }
}
