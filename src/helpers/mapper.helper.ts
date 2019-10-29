import { injectable } from 'inversify';
import { plainToClass, classToPlain } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

@injectable()
export class Mapper {
  public map<TSource, TDestination>(source: TSource, destinationType: ClassType<TDestination>): TDestination {
    const plain = classToPlain(source);
    return plainToClass(destinationType, plain);
  }
}
