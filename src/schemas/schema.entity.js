import { Column, Entity, VersionColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Schema {
  @PrimaryColumn({ type: String })
  id;

  @Column({ type: 'text' })
  value;

  @VersionColumn()
  version;
}
