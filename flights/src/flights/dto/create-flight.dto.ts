export class CreateFlightDto {
  readonly pilot: string;
  readonly airplane: string;
  readonly destinationCity: string;
  readonly flightDate: Date;
}
