import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);

    authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to autheticate', async () => {
    const user = await createUserService.execute({
      name: 'Marcio',
      email: 'marciofiorenza@gmail.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'marciofiorenza@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to autheticate with non existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'marciofiorenza@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to autheticate with wrong password', async () => {
    await createUserService.execute({
      name: 'Marcio',
      email: 'marciofiorenza@gmail.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'marciofiorenza@gmail.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
