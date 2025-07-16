import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-EmployeeCompleteprofile.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
phone:string 
    country_code: string
    isFirstlogin:boolean


}
