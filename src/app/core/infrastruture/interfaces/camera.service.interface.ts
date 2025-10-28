import { Photo } from '../../domain/photo.model';

export abstract class CameraService {
  abstract takePicture(): Promise<Photo>;
}