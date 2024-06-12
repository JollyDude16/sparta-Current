import { getgameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }
  //오름차순 정렬
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage Mismatch' };
  }

  //1stage -> 2stage로 넘어가는 과정
  //5는 임의로 정한 오차범위 (과제)
  if(elapsedTime < 100 || elapsedTime > 105){
    return {status: 'fail', message : "invalid elapsed time"}; 
  }


  //점수 검증 로직
  const serverTime = Date.now(); //현재의 타임스탬프
  elapsedTime = (serverTime - currentStage.timestamp) / 1000;


  //targetStage 대한 검증 <- 게임에셋에 존재하는가?
  const {stages} = getgameAssets();
  if(!stages.data.some((stages)=> stages.id === payload.targetStage)){
    return {status:'fail', message:"Target stage not found"}
  }
  setStage(userId, payload.targetStage, serverTime);

  return { status: 'success' };
};
