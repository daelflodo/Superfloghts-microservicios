import { IPassenger } from "./passenger.interface";
import { IWeather } from "./weather.interface";

export interface IFlight{
  _id?: string;
  pilot: string;
  airplalne: string;
  destinationCity: string;
  flightDate: Date;
  passengers: IPassenger[];
  weather: IWeather[];
}
