import { UserRole } from "src/types/role";
import { Entity, Column } from "typeorm";
import { BaseNotification } from "./notication";

@Entity("manager_notifications")
export class ManagerNotification extends BaseNotification {
  @Column({ type: "enum", enum: UserRole, default: UserRole.MANAGER })
  role: UserRole; // Fixed as 'manager' for this table
}
