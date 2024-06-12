
//스테이지 따라 더 높은 점수
//1스테이지 0->1점씩
//2스테이지, 1000점 -> 2점씩
const stages ={};
//key: uuid, value:array -> stage 


//초기화 해주는 함수
export const createStage = (uuid => {
    stages[uuid]=[];
})


export const getStage=(uuid)=>{
    return stages[uuid]
}

export const setStage = (uuid, id, timestamp)=>{
    return stages[uuid].push({id, timestamp});
}