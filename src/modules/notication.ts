import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  
  export enum NotificationType {
    ASSIGNMENT = "assignment",
    STATUS_CHANGE = "status_change",
    REJECTION = "rejection",
    DELAY_ALERT = "delay_alert",
    SYSTEM = "system",
    REMINDER = "reminder",
    FEEDBACK_REQUEST = "feedback_request",
  }
  
  export enum NotificationChannel {
    IN_APP = "in_app",
    SMS = "sms",
    PUSH = "push",
  }
  
  export enum NotificationPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    CRITICAL = "critical",
  }
  
  @Entity("base_notifications")
export class BaseNotification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: true })
  recipient_id: string | null;

  @Column({ type: "uuid", nullable: true })
  task_id: string | null;

  @Column({ type: "enum", enum: NotificationType })
  type: NotificationType;

  @Column({ type: "enum", enum: NotificationChannel })
  channel: NotificationChannel;

  @Column({ type: "enum", enum: NotificationPriority, default: NotificationPriority.NORMAL })
  priority: NotificationPriority;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  content: string;



  @Column({ type: "boolean", default: false })
  is_read: boolean;

  @Column({ type: "boolean", default: false })
  is_general: boolean;

  @Column({ type: "timestamp", nullable: true })
  delivered_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
