import { Author } from './../models/author.model';
import { AuthorResponseDto } from './../dtos/author/author.dto';
import { Book, Publisher } from '../models/book.model';
import { BookResponseDto, BookRequestDto, BookPublisherResponseDto } from '../dtos/book/book.dto';
import { BooksRepository } from '../repositories/books.repository';
import { inject, injectable } from 'inversify';

@injectable()
export class BooksService {
  @inject(BooksRepository) private readonly repo: BooksRepository;

  public async getAll(): Promise<BookResponseDto[]> {
    const books = await this.repo.getAll();
    const result = books.map((item) => this.modelToDto(item));
    return result;
  }

  public async findById(id: string): Promise<BookResponseDto> {
    const book = await this.repo.findById(id);
    if (book) {
      return this.modelToDto(book);
    }
    return null;
  }

  public async getByAuthorId(authorId: string): Promise<BookResponseDto[]> {
    const books = await this.repo.findMany({ author: authorId });
    const result = books.map((item) => {
      const dto = this.modelToDto(item);
      delete dto.author;
      return dto;
    });
    return result;
  }

  public async create(dto: BookRequestDto): Promise<BookResponseDto> {
    let model = this.dtoToModel(dto);
    model = await this.repo.create(model);
    const result = this.modelToDto(model);
    return result;
  }

  public async update(id: string, dto: BookRequestDto): Promise<BookResponseDto> {
    let model = this.dtoToModel(dto);
    model = await this.repo.update(id, model);
    if (model) {
      return this.modelToDto(model);
    }
    return null;
  }

  public delete(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }

  private modelToDto(model: Book): BookResponseDto {
    let result = new BookResponseDto({
      id: model._id,
      title: model.title
    });

    if (model.author !== null) {
      result.author = new AuthorResponseDto({
        id: model.author._id,
        fullName: model.author.fullName,
      });
    }

    if (model.publisher !== null) {
      result.publisher = new BookPublisherResponseDto({
        name: model.publisher.name,
        address: model.publisher.address,
      });
    }

    return result;
  }

  private dtoToModel(dto: BookRequestDto): Book {
    const result = new Book({
      title: dto.title,
    });

    if (dto.authorId) {
      result.author = new Author({
        _id: dto.authorId,
      });
    }

    if (dto.publisher) {
      result.publisher = new Publisher({
        name: dto.publisher.name,
        address: dto.publisher.address,
      });
    }

    return result;
  };
}
