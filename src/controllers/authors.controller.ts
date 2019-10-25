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
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.delete);
  }

  private getAll = async (_request: Request, response: Response, next: NextFunction) => {
    this.repo.getAll()
      .then((authors) => {
        response.send(authors);
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
      })
      .catch(next)
  }

  private create = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body as Author;
    this.repo.create(data)
      .then((author) => {
        response
          .location(`${this.path}/${author._id}`)
          .status(StatusHelper.status201Created)
          .send(author);
      })
      .catch(next);
  }

  private update = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const data: Author = request.body;
    this.repo.update(id, data)
      .then((author) => {
        if (author) {
          response.send(author);
        } else {
          response.sendStatus(StatusHelper.status404NotFound);
        }
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
      })
      .catch(next);
  }
}
