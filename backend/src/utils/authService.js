const userMap  =new Map();

function setUser(id,user){
    userMap.set(id,user)
}

function getUser(id,user){
   return  userMap.get(id)
}

export{setUser,getUser}