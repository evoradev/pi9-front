import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Photo } from 'src/app/core/domain/photo.model';
import { TakePictureUseCaseImpl } from 'src/app/core/usecases/take-picture.usecase';
import { DetectDominantColorUseCaseImpl } from 'src/app/core/usecases/detect-dominant-color.usecase';
import { addIcons } from 'ionicons';
import { camera, imageOutline } from 'ionicons/icons';
import { SafeUrlPipe } from '../shared/pipes/safe-url.pipe';
import { TakePictureUseCase } from 'src/app/core/usecases/interfaces/take-picture.usecase.interface';
import { CameraService } from 'src/app/core/infrastruture/interfaces/camera.service.interface';
import { CameraServiceImpl } from 'src/app/core/infrastruture/camera.service';
import { DetectDominantColorUseCase } from 'src/app/core/usecases/interfaces/detect-dominant-color.usecase.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SafeUrlPipe],
  providers: [
    {
      provide: TakePictureUseCase,
      useClass: TakePictureUseCaseImpl,
    },
    {
      provide: CameraService,
      useClass: CameraServiceImpl,
    },
    {
      provide: DetectDominantColorUseCase,
      useClass: DetectDominantColorUseCaseImpl,
    },
  ],
})
export class HomePage {
  photo?: Photo;
  dominantColor: string | null = null;

  constructor(
    private readonly takePictureUseCase: TakePictureUseCase,
    private readonly detectDominantColorUseCase: DetectDominantColorUseCase,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    addIcons({ camera, imageOutline });
  }

  async takePicture(): Promise<void> {
    try {
      this.dominantColor = null;
      this.photo = await this.takePictureUseCase.execute();
      this.detectDominantColor();
      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error(error);
    }
  }

  private async detectDominantColor(): Promise<void> {
    if (!this.photo?.dataUrl) {
      return;
    }
    try {
      this.dominantColor = await this.detectDominantColorUseCase.execute(
        this.photo.dataUrl
      );
      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('Error detecting dominant color:', error);
    }
  }
}