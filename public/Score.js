import { sendEvent } from "./Socket.js";

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  stageChangeTimer = 5;
  stageTimer = 0;
  scoreMultiflier = 1;
  scoreGiver;
  currentItemData=[];
  surpassedScore = 0;
  constructor(ctx, scaleRatio, stageData, itemData) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;

    this.currentStage = 1000;
    
    this.itemData = itemData;

    this.stageData= stageData;

    this.currentStageData = this.stageData.find(data =>data.id === this.currentStage);
    this.nextStageData = this.stageData.find(data =>data.id === this.currentStage+1);
  }
  
  update(deltaTime) {
    this.score += deltaTime * (0.001*this.scoreMultiflier);
    
    //스테이지Change 활성화
    this.stageTimer += deltaTime * (0.001*this.scoreMultiflier);
    if(this.stageTimer > this.stageChangeTimer && this.stageChange === false){
      this.stageChange = true;
    }


    //다음 스테이지 점수 도달 시
    if(this.nextStageData){
    if (Math.floor(this.score) >= this.nextStageData.score  && this.stageChange === true) {
      this.stageChange = false;
      this.stageTimer = 0;
      //아래에 스테이지에서 획득한 아이템 갯수
      //다음 회차에 surpassedScore를 더해야함 선언은 
      sendEvent(11, { currentStage: this.currentStage, targetStage: (this.currentStage+1), itemCount:this.currentItemData, surpassedScore : this.surpassedScore});
      this.scoreMultiflier = this.nextStageData.scorePerSecond;
      this.currentStage++;
      this.surpassedScore = this.score - this.nextStageData.score;
      this.currentItemData = [];
      //다음 스테이지로 이동하며 currentStageData 와 nextStageData를 업데이트
      this.currentStageData = this.stageData.find(data =>data.id === this.currentStage);
      this.nextStageData = this.stageData.find(data =>data.id === this.currentStage+1);

      //다음 스테이지로 이동하며 stageChangeTimer도 변경
      if(this.nextStageData){
      this.stageChangeTimer = (this.nextStageData.score-this.currentStageData.score) / 2
      }
    }
    }
  }
  //아이템 획득
  getItem(itemId) {
    // item 테이블 호출, 일치하는 테이블 아이디 + 점수
    const scoreGiver = this.itemData.find(data => data.id === itemId);

    if (scoreGiver) {
      // 획득 시 카운트
      const existingItem = this.currentItemData.find(data => data.id === itemId);

      if (existingItem) {
        // 이미 존재하면 카운트 증가
        existingItem.itemCount++;
      } else {
        // 존재하지 않으면 새로 추가
        this.currentItemData.push({ ...scoreGiver, itemCount: 1 });
      }
      this.currentItemData.sort((a,b)=>a.id - b.id);
      // 획득 시 점수
      this.score += scoreGiver.score;
      this.stageTimer += scoreGiver.score;
    } else {
      console.warn(`Item with id ${itemId} not found in itemData`);
    }
    console.log(this.currentItemData);
  }


  reset() {
    this.score = 0;
    this.stageTimer = 0;

    this.currentStage = 1000;
    this.stageChange = true;
    this.scoreMultiflier=1;

    //획득한 아이템 리셋
    this.currentItemData = [];

    //data 배열도 리셋
    this.currentStageData = this.stageData.find(data =>data.id === this.currentStage);
    this.nextStageData = this.stageData.find(data =>data.id === this.currentStage+1);

  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
