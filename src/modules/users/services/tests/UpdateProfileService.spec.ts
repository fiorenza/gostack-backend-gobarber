import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Nome Teste',
      email: 'teste@teste.com',
    });

    expect(updatedUser.name).toBe('Nome Teste');
    expect(updatedUser.email).toBe('teste@teste.com');
  });

  it('should not be able to update the profile of a non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'user.id-fake',
        name: 'Nome Teste',
        email: 'teste@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the email to an existing email', async () => {
    await fakeUsersRepository.create({
      name: 'John',
      email: 'john2@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Nome Teste',
        email: 'john2@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Nome Teste',
      email: 'teste@teste.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Nome Teste',
        email: 'teste@teste.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with worng old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Nome Teste',
        email: 'teste@teste.com',
        old_password: '1231233',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
