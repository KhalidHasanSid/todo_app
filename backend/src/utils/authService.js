const userMap  =new Map();

function setUser(id,user){
    userMap.set(id,user)
}

function getUser(id){
   return  userMap.get(id)
}

function deleteUser(id){
   return userMap.delete(id)
}

export{setUser,getUser,deleteUser}