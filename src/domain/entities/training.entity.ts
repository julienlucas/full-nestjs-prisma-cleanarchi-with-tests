import SingletonMixin from '@infrastructure/singleton.mixin';

export const MIN_LENGTH_TITLE = 10;
export const MAX_LENGTH_TITLE = 50;
export const MIN_LENGTH_DESCRIPTION = 20;
export const MAX_LENGTH_DESCRIPTION = 80;

export class TrainingEntity extends SingletonMixin {
  canBeSubmited(title: string, description: string): boolean {
    return (
      title?.length > MIN_LENGTH_TITLE &&
      title?.length < MAX_LENGTH_TITLE && (
        (
          description?.length > MIN_LENGTH_DESCRIPTION &&
          description?.length < MAX_LENGTH_DESCRIPTION
        ) || description?.length === 0
      )
    )
  }
};