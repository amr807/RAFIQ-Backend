import { PartialType } from '@nestjs/mapped-types';
import { CreateTasksforemployeeDto } from './create-tasksforemployee.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateTasksforemployeeDto extends PartialType(CreateTasksforemployeeDto) {
      @IsNotEmpty({ message: 'paylaod require' })
    task_id: string;
         @IsNotEmpty({ message: 'payload require' })
   
    status: string;
}
