import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Task_DB } from "src/modules/task_db";
import { Repository } from "typeorm"

 export async function findTasksById (manager_id, Repository: Repository<Task_DB>,employee_id?) {
try{
    if(typeof employee_id !== 'undefined') {
    const task = await Repository.find({ where: { employee_id: employee_id ,Manage_id:manager_id} });
    if (task == null) {
        throw new UnauthorizedException("credentials not correct")
    }
    return task;
   
}
else{

    const task = await Repository.find({ where: { Manage_id:manager_id} });
    if (task == null) {
        throw new UnauthorizedException("credentials not correct")
    }
    return task;


}}
catch(error){
    console.log(error)
    throw new BadRequestException("task is invaild")
}}