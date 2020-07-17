import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getHours, isAfter } from 'date-fns';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvaibilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, day, month, year }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      day,
      month,
      year,
    });

    const hourStart = 8;

    const eachHourArray = Array.from({ length: 10 }, (_, index) => index + hourStart);

    const currentDate = new Date(Date.now());

    return eachHourArray.map((hour) => {
      const appointmentInDay = appointments.find((appointment) => getHours(appointment.date) === hour);

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !appointmentInDay && isAfter(compareDate, currentDate),
      };
    });
  }
}

export default ListProviderDayAvaibilityService;
