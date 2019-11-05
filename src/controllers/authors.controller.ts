import { AuthorsService } from './../services/authors.service';
import { AuthorRequestDto } from '../dtos/author/author.dto';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from "express";
import { StatusHelper } from './../helpers/status.helper';

@injectable()
export class AuthorsController extends BaseController {
  @inject(AuthorsService) private service: AuthorsService;

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
    this.service.getAll()
      .then((authors) => {
        response.send(authors);
        next();
      })
      .catch(next);
  }

  private getById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.service.findById(id)
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
    const dto = request.body as AuthorRequestDto;
    this.service.create(dto)
      .then((author) => {
        response
          .location(`${this.path}/${author.id}`)
          .status(StatusHelper.status201Created)
          .send(author);
        next();
      })
      .catch(next);
  }

  private update = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const dto = request.body as AuthorRequestDto;
    this.service.update(id, dto)
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
    this.service.delete(id)
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
