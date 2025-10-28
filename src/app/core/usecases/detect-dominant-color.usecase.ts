import { Injectable } from '@angular/core';
import { FastAverageColor } from 'fast-average-color';
import { DetectDominantColorUseCase } from './interfaces/detect-dominant-color.usecase.interface';

@Injectable()
export class DetectDominantColorUseCaseImpl implements DetectDominantColorUseCase {
  private readonly fac = new FastAverageColor();

  async execute(imageUrl: string): Promise<string> {
    try {
      const color = await this.fac.getColorAsync(imageUrl);
      if (color.error) {
        throw color.error;
      }
      return color.hex;
    } catch (error) {
      console.error('FastAverageColor failed:', error);
      throw new Error('Could not determine a valid dominant color.');
    }
  }
}