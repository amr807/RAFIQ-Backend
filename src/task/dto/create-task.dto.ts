export class CreateTaskDto {
    email: string;
    image: any
    packageItems: { type: string; customType?: string; quantity: number }[]
    priority: string
    location: string
    id: string
    title: string
    description: string
    address: string
    amount: number
    completed: boolean
    status: "Not Started" | "In Progress" | "Almost Done" | "Completed"
    employeeName: string
    employee_id: string
    lon:number
    lat:number
}
