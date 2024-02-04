import { Transport } from "./Transport";

export interface Flight {
  transport: Transport;
  origin: string;
  destination: string;
  price: number;
}
