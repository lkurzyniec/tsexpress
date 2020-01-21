import { injectable } from 'inversify';
import { BaseRepository } from './../repositories/base.repository';
import { BaseModel } from './../models/base.model';

@injectable()
export abstract class BaseService<TResponseDto, TRequestDto, TModel extends BaseModel> {
  protected abstract modelToDto(model: TModel): TResponseDto;
  protected abstract dtoToModel(dto: TRequestDto): TModel;

  protected abstract readonly repo: BaseRepository<TModel>;

  public async isUnique(propsToCheck: string[], dto: TRequestDto, user: string, id?: string): Promise<string> {
    let filter = {
      user,
    };

    for (const item of propsToCheck) {
      filter[item] = dto[item];
      const obj = await this.repo.findOne(filter as any);
      if (
        (obj && !id)
        ||
        (obj && id && obj._id != id)) {
        return `${item} already taken`;
      }
      delete filter[item];
    }

    return '';
  }
}
