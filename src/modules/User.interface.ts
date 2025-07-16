import { Document } from 'mongoose';
export interface IUser extends Document{
     firstname: string;
     lastname: string;
     email: string;
     password: string;
     verified: boolean;
     date: string;
      role:string;


      
      
}