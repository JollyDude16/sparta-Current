import { getgameAssets } from "../init/assets";
import { getStage, setStage } from "../models/stage.model";

export const gameStart =(uuid, payload) =>{
    
    const { stages } = getgameAssets();
    //stages 배열에서 첫번째 스테이지

    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log('stage: ', getStage(uuid))

    return {status: 'success'};
}

export const gameEnd= ()=>{

    //클라이언트는 게임 종료 시 타음 스탬프와 총 점수를 전달
    const {timestamp:gameEndTime, score} = payload;
    const stages = getStage(uuid);

    if(!stages.length){

        return{status:'fail',message:"No stages found for user"};
    }

    let totalScore = 0;
    stages.forEach((stage, index)=>{
        if(index ===stages.length -1){
            stageEndTime = gameEndTIme
        }
        else{
            stageEndTime=stages[index + 1].timestamp;
        }
        const stageDuration = (stageEndTime - stage.timestamp)/1000;
        totalScore += stageDuration; // 1초당 1점;
    })

    // 점수와 타임 스탬프 검증
    if (Math.abs(score - totalScore) > 5){
        return {status:'fail', message:'Score verification failed'};
    }
    
    return {status: 'success', message:'Game ended', score};
};