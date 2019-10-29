import { Mapper } from './../helpers/mapper.helper';
import { AuthorDto } from './../dtos/author.dto';
import { ValidationHandler } from './../handlers/validation.handler';
import { Author } from './../models/author.model';
import { AuthorsRepository } from './../repositories/authors.repository';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from "express";
import { StatusHelper } from './../helpers/status.helper';

@injectable()
export class AuthorsController extends BaseController {
  @inject(AuthorsRepository) private repo: AuthorsRepository;
  @inject(ValidationHandler) private validator: ValidationHandler;
  @inject(Mapper) private mapper: Mapper;

  constructor() {
    super('/authors');
  }

  public initializeRoutes(): void {
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/:id`, this.validator.checkId(), this.getById);
    this.router.post(this.path, this.validator.checkBody(AuthorDto), this.create);
    this.router.put(`${this.path}/:id`, this.validator.checkIdAndBody(AuthorDto), this.update);
    this.router.delete(`${this.path}/:id`, this.validator.checkId(), this.delete);
  }

  private getAll = async (_request: Request, response: Response, next: NextFunction) => {
    this.repo.getAll()
      .then((authors) => {
        response.send(authors);
        next();
      })
      .catch(next);
  }

  private getById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.repo.findById(id)
      .then((author) => {
        if (author) {
          response.send(author);
        } else {
          response.sendStatus(StatusHelper.status404NotFound);
        }
        next();
      })
      .catch(next);
  }

  private create = async (request: Request, response: Response, next: NextFunction) => {
    const dto = request.body as AuthorDto;
    const data = this.mapper.map(dto, Author);
    this.repo.create(data)
      .then((author) => {
        response
          .location(`${this.path}/${author._id}`)
          .status(StatusHelper.status201Created)
          .send(author);
        next();
      })
      .catch(next);
  }

  private update = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const dto = request.body as AuthorDto;
    const data = this.mapper.map(dto, Author);
    this.repo.update(id, data)
      .then((author) => {
        if (author) {
          response.send(author);
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
