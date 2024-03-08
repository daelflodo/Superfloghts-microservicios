import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { RabbitMQ } from '../constanst';
//Conexion y configuracion de RabbitMQ
@Injectable()
export class ClientProxySuperFlights {
  constructor(private readonly config: ConfigService) {}
  // ClientProxy y ClientProxyFactory: Utilizados para crear y configurar instancias de clientes proxy 
  // para comunicarse con microservicios en Nest.js.
  clientProxyUsers(): ClientProxy {
    return ClientProxyFactory.create({
      //Transport: Enumeración que define los diferentes tipos de transporte que pueden ser utilizados por los clientes proxy.
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.UserQueue,
      },
    });
  }
  clientProxyPassengers():ClientProxy{
    return ClientProxyFactory.create({
      transport:Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.PassengerQueue,
      },
    })
  }

  clientProxyFlights():ClientProxy{
    return ClientProxyFactory.create({
      transport:Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.FlightQueue,
      },
    })
  }
}
