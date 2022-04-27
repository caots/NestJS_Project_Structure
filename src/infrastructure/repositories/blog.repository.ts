import { EntityRepository, FindConditions, Like } from 'typeorm';
import { Blog } from 'src/domain/entities/blog.entity';
import { BaseRepository } from 'src/infrastructure/repositories/base.repository';

@EntityRepository(Blog)
export class BlogsRepository extends BaseRepository<Blog> {
  public async getBlogInHome(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [result, total] = await this.findAndCount(
      {
        // where: { name: Like('%' + keyword + '%') }, 
        order: { name: "DESC" },
        take: limit,
        skip: skip
      } as FindConditions<Blog>
    );

    return {
      data: result,
      count: total
    }
  }
}
