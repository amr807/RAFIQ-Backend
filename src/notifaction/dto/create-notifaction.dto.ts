import { EmployeeNotification } from "src/modules/employee_notication";
import { ManagerNotification } from "src/modules/manager_notication";
import { Repository } from "typeorm";

export class CreateNotifactionDto {
id: string;
notification: (ManagerNotification & { name: string }) | EmployeeNotification;
}
