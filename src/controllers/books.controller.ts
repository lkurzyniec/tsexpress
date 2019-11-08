import { BookRequestDto } from './../dtos/book/book.dto';
import { BooksService } from './../services/books.service';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from "express";
import { StatusHelper } from './../helpers/status.helper';

@injectable()
export class BooksController extends BaseController {
  @inject(BooksService) private service: BooksService;

  constructor() {
    super('/books');
  }

  public initializeRoutes(): void {
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/:id`, this.validator.checkId(), this.getById);
    this.router.post(this.path, this.validator.checkBody(BookRequestDto), this.create);
    this.router.patch(`${this.path}/:id`, this.validator.checkIdAndBody(BookRequestDto, true), this.update);
    this.router.delete(`${this.path}/:id`, this.validator.checkId(), this.delete);
  }

  private getAll = async (request: Request, response: Response, next: NextFunction) => {
    this.service.getAll()
      .then((books) => {
        response.send(books);
        next();
      })
      .catch(next);
  }

  private getById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.service.findById(id)
      .then((book) => {
        if (book) {
          response.send(book);
        } else {
          next(StatusHelper.error404NotFound);
          return;
        }
        next();
      })
      .catch(next);
  }

  private create = async (request: Request, response: Response, next: NextFunction) => {
    const dto = request.body as BookRequestDto;
    this.service.create(dto)
      .then((book) => {
        response
          .location(`${this.path}/${book.id}`)
          .status(StatusHelper.status201Created)
          .send(book);
        next();
      })
      .catch(next);
  }

  private update = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const dto = request.body as BookRequestDto;
    this.service.update(id, dto)
      .then((book) => {
        if (book) {
          response.send(book);
        } else {
          next(StatusHelper.error404NotFound);
          return;
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
          next(StatusHelper.error404NotFound);
          return;
        }
        next();
      })
      .catch(next);
  }
}
