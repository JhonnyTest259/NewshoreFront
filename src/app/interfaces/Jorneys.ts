import { Flight } from './Flight';

export interface Jorneys {
  flights: Flight[];
  origin: string;
  destination: string;
  currency: string;
  price: number;
}
