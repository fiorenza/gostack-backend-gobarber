import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvaibilityService from '@modules/appointments/services/ListProviderDayAvaibilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvaibilityService: ListProviderDayAvaibilityService;

describe('ListProviderDayAvaibilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvaibilityService = new ListProviderDayAvaibilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the day avaibility from provider', async () => {
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

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });

    const avaibility = await listProviderDayAvaibilityService.execute({
      provider_id: 'teste',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(avaibility).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
