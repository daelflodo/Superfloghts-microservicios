import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Passenger } from './passenger.entity';

@Entity({ name: 'flight' })
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  pilot: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  airplane: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  destinationCity: string;

  @Column({
    type: 'date'
  })
  flightDate: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Passenger, (passenger) => passenger.flight)
  passengers: Passenger[];
}
