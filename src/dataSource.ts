import { DataSource } from 'typeorm';
class AppDataSource {
	private dataSource;
	constructor() {
		this.dataSource = new DataSource({
			type: 'sqlite',
			database: './db.sqlite',
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true,
		});
	}

	initialize(): Promise<void> {
		return this.dataSource.initialize();
	}
	getRepository(entityClass) {
		return this.dataSource.getRepository(entityClass);
	}
}
export default new AppDataSource();
