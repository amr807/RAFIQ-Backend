export class CreateUpdatepasswordDto {
    email: string;
    newPassword: string;
}
export class GetPinDto{
    email:string

}
export class Uptdatepin extends GetPinDto {
    newPassword: string;

}