import { IBlogRepository } from "./modules/blog/repositories/blog.repository.interface";
import { MongoBlogRepository } from "./modules/blog/repositories/mongodb/blog.repository";
import { ICategoryRepository } from "./modules/category/repositories/category.repository.interface";
import { MongoCategoryRepository } from "./modules/category/repositories/mongodb/category.repository";
import { MongoUserRepository } from "./modules/users/repositories/mongodb/user.repository";
import { IUserRepository } from "./modules/users/repositories/user.repository.interface";

export class RepositoryProvider {
    private static _userRepositoryInstance: MongoUserRepository;
    private static _categoryRepositoryInstance: MongoCategoryRepository;
    private static _blogRepositoryInstance: MongoBlogRepository;

    static get userRepository(): IUserRepository {
        if (!this._userRepositoryInstance)
            this._userRepositoryInstance = new MongoUserRepository();
        return this._userRepositoryInstance;
    }

    static get categoryRepository(): ICategoryRepository {
        if (!this._categoryRepositoryInstance)
            this._categoryRepositoryInstance = new MongoCategoryRepository();
        return this._categoryRepositoryInstance;
    }

    static get blogRepository(): IBlogRepository {
        if (!this._blogRepositoryInstance)
            this._blogRepositoryInstance = new MongoBlogRepository();
        return this._blogRepositoryInstance;
    }
}
