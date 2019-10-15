import { BooksRepository } from './../repositories/books.repository';
import { injectable, inject } from "inversify";
import { BaseController } from "./base.controller";

@injectable()
export class BooksController extends BaseController {
  @inject(BooksRepository) private repo: BooksRepository;

  constructor(){
    super('/books');
  }

  protected initializeRoutes(): void {
    this.router.get(this.path, (request, response) => {
      response.send(this.repo.getAll());
    });

    this.router.get(`${this.path}/:id`, (request, response) => {
      const id = parseInt(request.params.id);
      response.send(this.repo.single(x => x.id === id));
    });
  }
}
