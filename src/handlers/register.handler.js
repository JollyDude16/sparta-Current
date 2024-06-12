import { addUser } from "../models/user.model.js";
import {v4 as uuidv4} from 'uuid';
import { handleConnection, handleDisconnet, handlerEvent } from "./helper.js";

//등록한다
//io.on 'connection'은 서버에 접속하는 모든 대상으로 일어나는 이벤트
const registerHandler = (io) => {
    io.on('connection',(socket)=>{

        //접속시 이벤트
        const userUUID = uuidv4();
        addUser({userUUID, socketId:socket.id})

        handleConnection(socket, userUUID)

        socket.on('event', () => handlerEvent(io, socket, data))
        // 접속해제시 이벤트(대기하는 함수)
        socket.on('disconnect', (socket)=>handleDisconnet(socket,userUUID));
    })
}

export default registerHandler;