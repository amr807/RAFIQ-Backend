import { Task_DB } from "src/modules/task_db";
import { Repository } from "typeorm"

export async function findTaskById(id: string,Repository: Repository<Task_DB>) {
    const task = await Repository.findOneBy( { id: id });
    if (task == null) {
        throw new Error("credentials not correct")
    }
    return task;



    

}
