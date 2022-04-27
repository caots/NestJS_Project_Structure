import {
  ICommandHandler,
  CommandHandler,
  EventPublisher,
  EventBus,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ResponseModel,
  RESPONSE_STATUS,
} from 'src/application/core/configs/response-status.config';
import { Blog } from 'src/domain/entities/blog.entity';
import { ApiProperty } from '@nestjs/swagger';
import { NotFoundException } from 'src/application/core/exceptions-filter/not-found.filter';
import { BlogsRepository } from 'src/infrastructure/repositories/blog.repository';

export class AddOrUpdateBlogCommand {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  sub_title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ isArray: true, type: Number })
  tags?: number[];

  @ApiProperty({ isArray: true, type: Number })
  categories?: number[];

  @ApiProperty()
  status?: number;

  constructor(
    id: number,
    title: string,
    sub_title: string,
    content: string,
    tags?: number[],
    categories?: number[],
    status?: number,
  ) {
    this.id = id;
    this.title = title;
    this.sub_title = sub_title;
    this.content = content;
    this.tags = tags || [];
    this.categories = categories || [];
    this.status = status;
  }
}

@CommandHandler(AddOrUpdateBlogCommand)
export class AddOrUpdateBlogHandler
  implements ICommandHandler<AddOrUpdateBlogCommand> {
  constructor(
    @InjectRepository(BlogsRepository)
    private readonly blogRepository: BlogsRepository,
    private publisher: EventPublisher,
  ) {}

  public async execute(
    command: AddOrUpdateBlogCommand,
  ): Promise<ResponseModel<Blog>> {
    const response = new ResponseModel();
    try {
      if (command.id == 0) {
        const blogTemp = new Blog();
        blogTemp.content = command.content;
        blogTemp.title = command.title;
        blogTemp.sub_title = command.sub_title;
        blogTemp.status = command.status;
        const blog = await this.blogRepository.insertData(blogTemp);
        // await this.blogTagMappingRepository.insertList(blog.id, command.tags);
        // await this.blogCategoryMappingRepository.insertList(blog.id, command.categories);
        response.data = blog;
        response.status = RESPONSE_STATUS.SUCCESSED;
      } else {
        const blog = await this.blogRepository.getById(command.id);
        if (blog == null) {
          throw new NotFoundException('Blog not found');
        }

        this.publisher.mergeObjectContext(blog);
        blog.updateBlog(
          command.content,
          command.title,
          command.sub_title,
          command.status,
        );
        const blogResponse = await this.blogRepository.updateData(blog);
        // await this.blogTagMappingRepository.deleteByBlog(blog.id);
        // await this.blogTagMappingRepository.insertList(blog.id, command.tags);
        // await this.blogCategoryMappingRepository.deleteByBlog(blog.id);
        // await this.blogCategoryMappingRepository.insertList(blog.id, command.categories);
        delete blogResponse.domainEvents;
        response.data = blogResponse;
      }
    } catch (err) {
      console.log(err);
      response.data = null;
      response.status = RESPONSE_STATUS.ERROR;
      response.message = err;
    }
    return response as ResponseModel<Blog>;
  }
}
