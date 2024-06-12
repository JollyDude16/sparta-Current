import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import {loadGameAssets} from './init/assets.js';

const app = express();
const server = createServer(app);
const PORT = 3000;
//json 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

app.get('/',(req, res)=>{
    res.send("hello world")
})

server.listen(PORT, async () => {
  console.log(`포트 ${PORT} 서버가 실행되었습니다`);

  //파일 읽자
  const assets = await loadGameAssets();
  console.log(assets);
  
});
