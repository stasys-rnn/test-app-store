import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { DeveloperCompany } from './developer-company';
import { UserApp } from './user-app';

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DeveloperCompany, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'developerId' })
  developer: DeveloperCompany;

  @Column()
  @Index()
  developerId: number;

  @OneToMany(() => UserApp, userApp => userApp.app)
  userApp: UserApp;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column({ type: 'text', nullable: true })
  longDescription: string;

  // free app is the one with 0 price
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  price: number;

  @Column({ default: false })
  published: boolean;
}
