import { getgameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js"

export const handleDisconnect = (socket,uuid)=>{
    removeUser(socket.id);
    console.log(`User disconnected ${socket.id}`);
    console.log('Current User', getUser());
}

export const handleConnection = (socket,uuid) => {
    console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`)
    console.log('Current users: ',getUser());

    const { stages } = getgameAssets();

    setStage(uuid, stages.data[0].id);
    console.log('stage: ', getStage)
}

export const handlerEvent = (io, socket, data) =>{
    if(!CLIENT_VERSION.includes(data.client)){
        socket.emit('response', {status: 'fail', message:"Client version 틀려먹었어"});
        return;
    }
    const handler = handlerMapping[data.handlerId];
    if(!handler){
        socket.emit('response', {status: 'fail', message: "Handler not found"})
        return;
    }
    const response = handler(data.userId, data.payload);

    if(response.broadcast){
        io.emit('response','broadcast');
        return;
    }

    socket.emit('reponse',response);
}