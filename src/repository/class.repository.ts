import { Not, Repository } from 'typeorm';
import dataSource from '../dataSource';
import { Class } from '../entities/class.entity';

export class ClassesRepository {
    classRepo: Repository<Class>;
    constructor() {
        this.classRepo = dataSource.getRepository(Class);
    }
    async create(classs: Class) {
        return this.classRepo.save(classs);
    }
    async getAll() {
        return this.classRepo.find();
    }
    async findOne(query: object) {
        return this.classRepo.findOne(query)
    }
    async update(id: string, classs: Partial<Class>) {
        return this.classRepo.update(id, classs);
    }
    async delete(id: string) {
        return this.classRepo.delete(id);
    }
}