import { Author } from './../models/author.model';
import { AuthorsRepository } from './../repositories/authors.repository';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response } from "express";
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

  private getAll = async (_request: Request, response: Response) => {
    response.send(await this.repo.getAll());
  }

  private getById = async (request: Request, response: Response) => {
    const id = request.params.id;
    response.send(await this.repo.findById(id));
  }

  private create = async (request: Request, response: Response) => {
    const data = request.body as Author;
    const author = await this.repo.create(data);
    response
      .location(`${this.path}/${author._id}`)
      .status(StatusHelper.status201Created)
      .send(author);
  }

  private update = async (request: Request, response: Response) => {
    const id = request.params.id;
    const data: Author = request.body;
    const author = await this.repo.update(id, data);
    if (author) {
      response.send(author);
    } else {
      response.sendStatus(StatusHelper.status404NotFound);
    }
  }

  private delete = async (request: Request, response: Response) => {
    const id = request.params.id;
    const author = await this.repo.delete(id);
    if (author) {
      response.sendStatus(StatusHelper.status204NoContent);
    } else {
      response.sendStatus(StatusHelper.status404NotFound);
    }
  }
}
