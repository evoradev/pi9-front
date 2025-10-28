import { Photo } from '../../domain/photo.model';

export abstract class TakePictureUseCase {
  abstract execute(): Promise<Photo>;
}