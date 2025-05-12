import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Schema {
  @PrimaryColumn({ type: String })
  id;

  @Column({ type: 'simple-json' })
  value;
}
