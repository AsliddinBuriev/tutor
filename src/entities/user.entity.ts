import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToMany,
} from 'typeorm';
import { Class } from './class.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id?: string;

	@Column()
	name: string;

	@Column({
		unique: true,
	})
	email: string;

	@Column()
	password: string;
	@Column()
	role: 'tutor' | 'student';

	@OneToMany(() => Class, (classes) => classes.tutor)
	classes?: Class[];

	@ManyToMany(() => Class, (classes) => classes.students)
	subscribedClasses?: Class[];
}
