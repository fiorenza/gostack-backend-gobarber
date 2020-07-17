import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    const userEmailAlreadUsed = await this.usersRepository.findByEmail(email);

    if (userEmailAlreadUsed && userEmailAlreadUsed.id !== user.id) {
      throw new AppError('E-mail já utilizado');
    }

    user.name = name;
    user.email = email;

    if (
      (password && !old_password) ||
      (old_password &&
        !(await this.hashProvider.compareHash(old_password, user.password)))
    ) {
      throw new AppError('A senha antiga é inválida');
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
