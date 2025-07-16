import { UserRole } from "src/types/role";
import { Entity, Column } from "typeorm";
import { BaseNotification } from "./notication";

@Entity("employee_notifications")
export class EmployeeNotification extends BaseNotification {
  @Column({ type: "enum", enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole; // Fixed as 'employee' for this table
}
