export abstract class DetectDominantColorUseCase {
  abstract execute(imageUrl: string): Promise<string>;
}