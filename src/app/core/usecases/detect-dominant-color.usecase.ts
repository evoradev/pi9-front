import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DetectDominantColorUseCase } from './interfaces/detect-dominant-color.usecase.interface';
import { environment } from 'src/environments/environment';

const COLOR_MAP: { [key: string]: string } = {
  vermelho: '#e61919',
  amarelo: '#f5dc32',
  azul: '#2864e6',
  laranja: '#fa8c1e',
  verde: '#3cb44b',
  roxo: '#963ca8',
};

function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

@Injectable()
export class DetectDominantColorUseCaseImpl implements DetectDominantColorUseCase {
  constructor(private http: HttpClient) {}

  async execute(imageUrl: string): Promise<string> {
    try {
      // If imageUrl is a data URL (from Capacitor Camera), convert to Blob
      let fileBlob: Blob;
      if (imageUrl.startsWith('data:')) {
        fileBlob = dataURLtoBlob(imageUrl);
      } else {
        // For remote urls, fetch the resource
        const resp = await fetch(imageUrl);
        const arrayBuffer = await resp.arrayBuffer();
        fileBlob = new Blob([arrayBuffer]);
      }

      const form = new FormData();
      form.append('file', fileBlob, 'photo.jpg');

      const url = `${environment.apiUrl}/predict-color/`;
      const response = await firstValueFrom(
        this.http.post<{ color?: string; rgb?: number[]; hex?: string }>(url, form)
      );

      if (response.hex) return response.hex;
      if (response.rgb && response.rgb.length === 3) {
        const [r, g, b] = response.rgb;
        return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
      }
      if (response.color && COLOR_MAP[response.color]) return COLOR_MAP[response.color];

      throw new Error('Invalid response from color prediction API');
    } catch (error) {
      console.error('DetectDominantColorUseCaseImpl failed:', error);
      throw new Error('Could not determine a valid dominant color.');
    }
  }
}