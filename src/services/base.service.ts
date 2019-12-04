import { injectable } from 'inversify';
import { BaseRepository } from './../repositories/base.repository';

@injectable()
export abstract class BaseService<TResponseDto, TRequestDto, TModel> {
  protected abstract modelToDto(model: TModel): TResponseDto;
  protected abstract dtoToModel(dto: TRequestDto): TModel;

  protected abstract readonly repo: BaseRepository<TModel>;
}
