import { PartialType } from '@nestjs/mapped-types';
import { CreateManagernotificationDto } from './create-managernotification.dto';

export class UpdateManagernotificationDto extends PartialType(CreateManagernotificationDto) {
    id: string;
}

export class UpdateManagerAllnotificationDto extends PartialType(CreateManagernotificationDto) {
id:string[]
}
