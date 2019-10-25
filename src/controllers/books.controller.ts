import { Book } from './../models/book.model';
import { BooksRepository } from './../repositories/books.repository';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from "express";
import { StatusHelper } from './../helpers/status.helper';

@injectable()
export class BooksController extends BaseController {
  @inject(BooksRepository) private repo: BooksRepository;

  constructor() {
    super('/books');
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
      .then((books) => {
        response.send(books);
        next();
      })
      .catch(next);
  }

  private getById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.repo.findById(id)
      .then((book) => {
        if (book) {
          response.send(book);
        } else {
          response.sendStatus(StatusHelper.status404NotFound);
        }
      })
      .catch(next)
  }

  private create = async (request: Request, response: Response, next: NextFunction) => {
    const data = request.body as Book;
    this.repo.create(data)
      .then((book) => {
        response
          .location(`${this.path}/${book._id}`)
          .status(StatusHelper.status201Created)
          .send(book);
      })
      .catch(next);
  }

  private update = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const data: Book = request.body;
    this.repo.update(id, data)
      .then((book) => {
        if (book) {
          response.send(book);
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
