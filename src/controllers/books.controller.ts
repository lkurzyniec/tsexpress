import { Book } from './../models/book.model';
import { BooksRepository } from './../repositories/books.repository';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response } from "express";
import { StatusHelper } from './../helpers/status.helper';

@injectable()
export class BooksController extends BaseController {
  @inject(BooksRepository) private repo: BooksRepository;

  constructor(){
    super('/books');
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
    const data = request.body as Book;
    const book = await this.repo.create(data);
    response
      .location(`${this.path}/${book._id}`)
      .status(StatusHelper.status201Created)
      .send(book);
  }

  private update = async (request: Request, response: Response) => {
    const id = request.params.id;
    const data: Book = request.body;
    const book = await this.repo.update(id, data);
    if (book) {
      response.send(book);
    } else {
      response.sendStatus(StatusHelper.status404NotFound);
    }
  }

  private delete = async (request: Request, response: Response) => {
    const id = request.params.id;
    const book = await this.repo.delete(id);
    if (book) {
      response.sendStatus(StatusHelper.status204NoContent);
    } else {
      response.sendStatus(StatusHelper.status404NotFound);
    }
  }
}
