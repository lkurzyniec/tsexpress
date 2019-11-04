import { AuthorRequestDto, AuthorResponseDto } from '../dtos/author/author.dto';
import { Author } from './../models/author.model';
import { AuthorsRepository } from './../repositories/authors.repository';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from "express";
import { StatusHelper } from './../helpers/status.helper';

@injectable()
export class AuthorsController extends BaseController {
  @inject(AuthorsRepository) private repo: AuthorsRepository;

  constructor() {
    super('/authors');
  }

  public initializeRoutes(): void {
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/:id`, this.validator.checkId(), this.getById);
    this.router.post(this.path, this.validator.checkBody(AuthorRequestDto), this.create);
    this.router.put(`${this.path}/:id`, this.validator.checkIdAndBody(AuthorRequestDto), this.update);
    this.router.delete(`${this.path}/:id`, this.validator.checkId(), this.delete);
  }

  private getAll = async (request: Request, response: Response, next: NextFunction) => {
    this.repo.getAll()
      .then((authors) => {
        const result = authors.map((item) => AuthorResponseDto.fromModel(item));
        response.send(result);
        next();
      })
      .catch(next);
  }

  private getById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.repo.findById(id)
      .then((author) => {
        if (author) {
          const result = AuthorResponseDto.fromModel(author);
          response.send(result);
        } else {
          response.sendStatus(StatusHelper.status404NotFound);
        }
        next();
      })
      .catch(next);
  }

  private create = async (request: Request, response: Response, next: NextFunction) => {
    const dto = request.body as AuthorRequestDto;
    const data = dto.toModel();
    this.repo.create(data)
      .then((author) => {
        const result = AuthorResponseDto.fromModel(author);
        response
          .location(`${this.path}/${result.id}`)
          .status(StatusHelper.status201Created)
          .send(result);
        next();
      })
      .catch(next);
  }

  private update = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const dto = request.body as AuthorRequestDto;
    const data = dto.toModel();
    this.repo.update(id, data)
      .then((author) => {
        if (author) {
          const result = AuthorResponseDto.fromModel(author);
          response.send(result);
        } else {
          response.sendStatus(StatusHelper.status404NotFound);
        }
        next();
      })
      .catch(next);
  }

  private delete = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.repo.delete(id)
      .then((deleted) => {
        if (deleted) {
          response.sendStatus(StatusHelper.status204NoContent);
        } else {
          response.sendStatus(StatusHelper.status404NotFound);
        }
        next();
      })
      .catch(next);
  }
}
