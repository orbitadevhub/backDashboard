import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Contact } from '../../contacts/entities/contact.entity';
import { Role } from '../../auth/roles.enum';



@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30 })
  firstName: string;

  @Column({ length: 30 })
  lastName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  roles: Role[];

  @Column({ nullable: true })
  googleId?: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true, select: false })
  twoFactorSecret?: string;

<<<<<<< HEAD
  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
=======
  @CreateDateColumn()
>>>>>>> b2390c1fad995188252c9f9cb62c49e447a647f9
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Contact, (contact) => contact.owner)
  contacts: Contact[];
}
