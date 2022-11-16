import { UnAuthenticatedError } from "../errors/index.js";

const checkPermissions = (requestUser,resourceUserId) => {
    console.log(requestUser.id,' ',resourceUserId.toString())
    if(requestUser.id === resourceUserId.toString()) return
    throw new UnAuthenticatedError('Not Authorized to access this route')
    
}


export default checkPermissions