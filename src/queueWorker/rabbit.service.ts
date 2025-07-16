import { MemcachedService } from "@andreafspeziale/nestjs-memcached";
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getConnections, DbConnections } from "src/helper_connection.helper";
import { Employee_db } from "src/modules/employee";
import { CreateTrackingDto } from "src/tracking/dto/create-tracking.dto";
import { MyGateway } from "src/websocket/websocket";
import { Repository } from "typeorm";


@Injectable()
export class RabbitMQService  {
      private readonly logger = new Logger(RabbitMQService .name);
    
constructor(
    @InjectRepository(Employee_db,getConnections(DbConnections.AUTH))
    private employeeRepository: Repository<Employee_db>,
    @Inject(MemcachedService) private readonly memcachedRepo: MemcachedService,
    private readonly myGateway: MyGateway,
  ) {}
async processTrackingUpdate(
    progress: any,
    createTrackingDto: CreateTrackingDto,
  ) {
    try {
      const user = await this.employeeRepository.findOneBy({
        email: createTrackingDto.email,
      });

      const manager_id=user.manager
      const user_id=user.user_id
      console.log(user_id)
      const key = `manager_${manager_id}`;
      const newLocation = { id: user_id, lat: createTrackingDto.latitude, lng: createTrackingDto.longitude ,battry:createTrackingDto.battery,  lastSeen: Date.now(),  status:createTrackingDto.status,task_id:createTrackingDto?.task_id,progress:createTrackingDto.progress,speed:createTrackingDto.speed,accuracy:createTrackingDto.accuracy
      };
      let existingEmployees:any= await this.memcachedRepo.get(key);
      if (!existingEmployees) { 
        existingEmployees = [];
      }
      existingEmployees = existingEmployees.filter(emp => emp.id !== user_id);
      
      existingEmployees.push(newLocation);
      console.log(`location_update_${manager_id}`)
      this.myGateway.server.emit(`location_update_${manager_id}`, {
        ...existingEmployees
      });
     
  
      await this.memcachedRepo.set(key, existingEmployees)
  
      this.logger.log(`Updated location for manager ${manager_id}: ${JSON.stringify(existingEmployees)}`);
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException('Manager not found');
    }
  }}