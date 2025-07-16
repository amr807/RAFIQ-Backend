import { IsDateString, IsOptional } from "class-validator";

export class CompleteTask{
  taskId: string;
 email:string
  
  @IsDateString()
  completedAt: string;

@IsDateString()
  @IsOptional()
  startedAt?: string;
 @IsOptional()
  actualDistance?: number; 

  @IsOptional()
  plannedDistance?: number;
  @IsOptional()
  Idletime?: number;

}
