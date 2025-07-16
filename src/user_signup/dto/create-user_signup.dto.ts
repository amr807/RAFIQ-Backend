import { IsNotEmpty, IsString, IsEmail, MinLength, Matches } from "class-validator";

export class CreateUserSignupDto {
      @IsNotEmpty({ message: 'First name is required' })
      @IsString({ message: 'First name must be a string' })
      firstname: string;
    
      @IsNotEmpty({ message: 'Last name is required' })
      @IsString({ message: 'Last name must be a string' })
      lastname: string;
    
      @IsNotEmpty({ message: 'Email is required' })
      @IsEmail({}, { message: 'Invalid email format' })
      email: string;
    
      @IsNotEmpty({ message: 'Email is required' })
      @MinLength(8, { message: 'Invalid email format' })
      pin: number;
    
      @IsNotEmpty({ message: 'Password is required' })
      @MinLength(8, { message: 'Password must be at least 8 characters long' })
      @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      })
      password: string;
    }

