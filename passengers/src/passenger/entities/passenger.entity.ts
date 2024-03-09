import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'passenger' })
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;
}
