import { BookResponseDto, BookRequestDto } from './../dtos/book/book.dto';
import { Book } from './../models/book.model';
import { BooksRepository } from './../repositories/books.repository';
import { injectable, inject } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response, NextFunction } from "express";
import { StatusHelper } from './../helpers/status.helper';
import { Author } from './../models/author.model';

@injectable()
export class BooksController extends BaseController {
  @inject(BooksRepository) private repo: BooksRepository;

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
    this.repo.getAll()
      .then((books) => {
        const result = books.map((item) => BookResponseDto.fromModel(item));
        response.send(result);
        next();
      })
      .catch(next);
  }

  private getById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    this.repo.findById(id)
      .then((book) => {
        if (book) {
          const result = BookResponseDto.fromModel(book);
          response.send(result);
        } else {
          response.sendStatus(StatusHelper.status404NotFound);
        }
        next();
      })
      .catch(next);
  }

  private create = async (request: Request, response: Response, next: NextFunction) => {
    const dto = request.body as BookRequestDto;
    const data = dto.toModel();
    this.repo.create(data)
      .then((book) => {
        const result = BookResponseDto.fromModel(book);
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
    const dto = request.body as BookRequestDto;
    const data = dto.toModel();
    this.repo.update(id, data)
      .then((book) => {
        if (book) {
          const result = BookResponseDto.fromModel(book);
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
