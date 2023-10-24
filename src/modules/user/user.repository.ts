import { Repository } from 'typeorm';

import { CustomRepository } from '../database/decorators';

import { User } from './user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    buildBaseQB() {
        return this.createQueryBuilder('user');
    }
}
