import { Author } from './../models/author.model';
import { AuthorsRepository } from './../repositories/authors.repository';
import { inject, injectable } from 'inversify';
import { AuthorResponseDto, AuthorRequestDto } from './../dtos/author/author.dto';

@injectable()
export class AuthorsService {
  @inject(AuthorsRepository) private repo: AuthorsRepository;

  public async getAll(): Promise<AuthorResponseDto[]> {
    const authors = await this.repo.getAll();
    const result = authors.map((item) => this.modelToDto(item));
    return result;
  }

  public async findById(id: string): Promise<AuthorResponseDto> {
    const author = await this.repo.findById(id);
    if (author) {
      return this.modelToDto(author);
    }
    return null;
  }

  public async create(dto: AuthorRequestDto, createdBy: string): Promise<AuthorResponseDto> {
    let model = this.dtoToModel(dto);
    model.createdBy = createdBy;
    model = await this.repo.create(model);
    const result = this.modelToDto(model);
    return result;
  }

  public async update(id: string, dto: AuthorRequestDto): Promise<AuthorResponseDto> {
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

  private modelToDto(model: Author): AuthorResponseDto {
    return new AuthorResponseDto({
      id: model._id,
      fullName: model.fullName,
      createdBy: model.createdBy,
    });
  }

  private dtoToModel(dto: AuthorRequestDto): Author {
    return new Author({
      fullName: dto.fullName,
    });
  };
}
