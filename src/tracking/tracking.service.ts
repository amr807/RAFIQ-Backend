import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackingDto, GetTrackingDto } from './dto/create-tracking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee_db } from 'src/modules/employee';
import { Repository } from 'typeorm';
import { MemcachedService } from '@andreafspeziale/nestjs-memcached';
import { MyGateway } from 'src/websocket/websocket';
import { getConnections, DbConnections } from 'src/helper_connection.helper';
 
@Injectable()
export class TrackingService {
  constructor(      @InjectRepository(Employee_db,getConnections(DbConnections.AUTH)) private EmployeeReposirty: Repository<Employee_db>,
        @Inject(MemcachedService) private readonly memcachedReoo:MemcachedService,
        private readonly myGateway: MyGateway 

  ) {}
  async create(createTrackingDto: CreateTrackingDto) {
try{
    console.log('createTrackingDto', createTrackingDto);
    const user=await  this.findId(createTrackingDto.email,this.EmployeeReposirty)
    const manager_id=user.manager
    const user_id=user.user_id
    console.log(user_id)
    const key = `manager_${manager_id}`;
    const newLocation = { id: user_id, lat: createTrackingDto.latitude, lng: createTrackingDto.longitude ,battry:createTrackingDto.battery,  lastSeen: Date.now(),  status:createTrackingDto.status,task_id:createTrackingDto?.task_id,progress:createTrackingDto.progress,speed:createTrackingDto.speed,accuracy:createTrackingDto.accuracy
    };
    let existingEmployees:any= await this.memcachedReoo.get(key);
    if (!existingEmployees) { 
      existingEmployees = [];
    }
    existingEmployees = existingEmployees.filter(emp => emp.id !== user_id);
    
    existingEmployees.push(newLocation);
    console.log(`location_update_${manager_id}`)
    this.myGateway.server.emit(`location_update_${manager_id}`, {
      ...existingEmployees
    });
    this.myGateway.server.emit("hello",{
      msg:"hello"
    })

    await this.memcachedReoo.set(key, existingEmployees)

    console.log(`Updated location for manager ${manager_id}:`, existingEmployees);
    return 'This action adds a new tracking';}
   catch(e){
         throw new NotFoundException("manager not found")
   
       }
  }
async get(create: GetTrackingDto ){
  const user=await  this.findId(create.email,this.EmployeeReposirty)

this.myGateway.server.on(user.user_id, (data) => {
console.log(`Received location update for manager:`, data);

})
  
  
  return {id:user.user_id}
}
  findAll() {
    return `This action returns all tracking`;
  }

  async findId(email: string,Repository) {
    if(email!==undefined){
      const user_id=  await Repository.findOneBy({email:email})
     return user_id;}
     throw new Error("email not found")
    
  }


}
