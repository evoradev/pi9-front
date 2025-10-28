import { Injectable } from '@angular/core';
import { Photo } from '../domain/photo.model';
import { TakePictureUseCase } from './interfaces/take-picture.usecase.interface';
import { CameraService } from '../infrastruture/interfaces/camera.service.interface';

@Injectable({
  providedIn: 'root',
})
export class TakePictureUseCaseImpl implements TakePictureUseCase {
  constructor(private readonly cameraService: CameraService) {}

  execute(): Promise<Photo> {
    return this.cameraService.takePicture();
  }
}