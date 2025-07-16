export class CreateTrackingDto {
    latitude: number;
    longitude: number;
    email: string;
    battery: number;
    status: string|null;
    task_id: string|null;
    progress: number|null;
    speed?: number|null;
    accuracy?: number|null;
    lastSeen: string;
}
export class GetTrackingDto {
    email:string
}