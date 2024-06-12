const users=[];
//db에서 유저 저장
export const addUser = (user)=>{
    users.push(user)
};
export const removeUser = (socketId)=>{
    const index = users.findIndex((user)=>user.socketId === socketId);
    if(index !== -1){
        return users.splice(index, deleteCount)[0];
    }
}
//전체 유저 조회 
export const getUser = ()=>{
    return users;
};