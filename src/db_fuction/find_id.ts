import { BadRequestException, UnauthorizedException } from "@nestjs/common"
import { Auth } from "src/modules/manager"
import { Repository } from "typeorm"

export async function findIdByEmail (email: string ,Repository:Repository<Auth>) {
    console.log("email",email)
  const auth=await Repository.findOne({ where: { email:email } })
  if(auth==null){
  throw new UnauthorizedException("cerdentials not correct")
  }
    if (auth instanceof Auth) {
        return auth.id;
    } else if (auth && typeof auth === 'object' && 'user_id' in auth) {
        return (auth as { user_id: string }).user_id;
    } else {
        throw new BadRequestException("Unexpected auth type");
    }
  }
 