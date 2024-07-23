import SingletonMixin from '@infrastructure/singleton.mixin';

export const MIN_LENGTH_TITLE = 20;
export const MAX_LENGTH_TITLE = 60;
export const MIN_LENGTH_DESCRIPTION = 10;
export const MAX_LENGTH_DESCRIPTION = 500;

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