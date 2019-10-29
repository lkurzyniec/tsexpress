import { injectable } from 'inversify';
import { plainToClass, classToPlain } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

@injectable()
export class Mapper {
  public map<TSource, TDestination>(source: TSource, destinationType: ClassType<TDestination>, afterMapFunc?: (source: TSource, destination: TDestination) => void): TDestination {
    const plain = classToPlain(source);
    const result = plainToClass(destinationType, plain);
    afterMapFunc && afterMapFunc(source, result);
    return result;
  }
}
