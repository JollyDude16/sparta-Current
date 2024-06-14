import { getgameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보
  let currentStages = getStage(userId);
  console.log("thisis Payload",payload)
  console.log("This is Stage Array",currentStages)
  console.log("THIS! IS! USERID!",userId)
  //다음 스테이지가 없으면 
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }
  //오름차순 정렬
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];
  console.log("THIS! IS! CURRENTSTAGES!", currentStages);
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage Mismatch' };
  }



  //점수 검증 로직
  const serverTime = Date.now(); //현재의 타임스탬프

  //스테이지의 배율 만큼 곱하고여기에 지난 회차 초과분 더해야함
  const elapsedTime = ((serverTime - currentStage.timestamp) / 1000)
  console.log("경과 시간: ",elapsedTime);
  // 100 은 넥스트 스테이지 - 커렌트 스테이지 점수
  //커렌트 스테이지의 score를 가져오는 법?
  
  const {stages} = getgameAssets();
  const currentStageData=stages.data.find((stages)=>stages.id ===currentStage.id)
  const nextStageData=stages.data.find((stages)=>stages.id ===currentStage.id+1)

  let itemCountAdd = 0;
  for (let i = 0; i < payload.itemCount.length; i++) {
    let temp = payload.itemCount[i];
    itemCountAdd += (temp.score * temp.itemCount);
  }
  console.log("아이템 점수 :", itemCountAdd);
  console.log("지난 스테이지 초과 점수 :", payload.surpassedScore);
  //최종 검수 하는 점수는 소요된 시간 곱하기 현재 스테이지의 초당 점수 더하기 획득한 아이템 + 지난 스테이지의 초과 점수
  const surpassedScore = payload.surpassedScore;

  const totalScore=Math.floor((elapsedTime * currentStageData.scorePerSecond) + itemCountAdd + surpassedScore);
  console.log("NAN 테스트",elapsedTime,currentStageData.scorePerSecond,itemCountAdd+surpassedScore )


  const itemCount = !payload.itemCount[payload.itemCount.length-1] ? 0 : payload.itemCount[payload.itemCount.length-1].score;

  const leastTotalScore = nextStageData.score - currentStageData.score;
  const maximumTotalScore = leastTotalScore + itemCount; //item 리스트에서 가장 마지막에 있는
  console.log("최대값 확인: ", maximumTotalScore, totalScore);
  if(totalScore < leastTotalScore || totalScore > maximumTotalScore){
    return {status: 'fail', message : "invalid Total Score"}; 
  }


  //targetStage 대한 검증 <- 게임에셋에 존재하는가?
  if(!stages.data.some((stages)=> stages.id === payload.targetStage)){
    return {status:'fail', message:"Target stage not found"}
  }
  //모든 조건 통과시, 서버의 currentStage.length-1이 갱신
  setStage(userId, payload.targetStage, serverTime);

  return { status: 'success' };
};
