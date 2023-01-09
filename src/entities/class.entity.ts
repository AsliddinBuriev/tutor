import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Class {
	@PrimaryGeneratedColumn()
	id?: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	isPaid: boolean;

	@ManyToOne(() => User, (tutor) => tutor.classes)
	tutor: User;

	@ManyToMany(() => User, (user) => user.subscribedClasses)
	@JoinTable()
	students?: User[];
}