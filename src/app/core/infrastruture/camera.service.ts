import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Photo } from '../domain/photo.model';
import { CameraService } from './interfaces/camera.service.interface';

@Injectable({
  providedIn: 'root',
})
export class CameraServiceImpl implements CameraService {
  async takePicture(): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
    });

    if (!capturedPhoto.dataUrl) {
      throw new Error('Could not get photo data.');
    }

    return {
      webviewPath: capturedPhoto.webPath || capturedPhoto.dataUrl,
      dataUrl: capturedPhoto.dataUrl,
      format: capturedPhoto.format,
    };
  }
}