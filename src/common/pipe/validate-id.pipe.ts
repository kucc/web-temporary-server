import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  public transform(Id: string) {
    if (!this.isNumber(Id)) {
      throw new BadRequestException('아니 숫자를 달라고 숫자를');
    }

    return Number(Id);
  }

  private isNumber(Id: string) {
    return Id.match(/[1-9]\d*$/);
  }
}
