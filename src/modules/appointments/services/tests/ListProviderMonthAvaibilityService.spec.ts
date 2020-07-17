import ListProviderMonthAvaibilityService from '@modules/appointments/services/ListProviderMonthAvaibilityService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvaibilityService: ListProviderMonthAvaibilityService;

describe('ListProviderMonthAvaibilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvaibilityService = new ListProviderMonthAvaibilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the month avaibility from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 20, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'teste',
      user_id: 'teste',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const avaibility = await listProviderMonthAvaibilityService.execute({
      provider_id: 'teste',
      month: 5,
      year: 2020,
    });

    expect(avaibility).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
