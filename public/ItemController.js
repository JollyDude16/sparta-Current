import Item from "./Item.js";
//현재 시스템에서 굴러가는 Item생성을 관리하는 
class ItemController {

    INTERVAL_MIN = 0;
    INTERVAL_MAX = 12000;

    nextInterval = null;
    items = [];


    constructor(itemUnlock ,scoreInstance, ctx, itemImages, scaleRatio, speed) {
        //스코어 정보를 콘스트럭터에 전달
        this.scoreInstance = scoreInstance;
        this.itemUnlock = itemUnlock;
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.itemImages = itemImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;
        this.setNextItemTime();
    }

    setNextItemTime() {
        this.nextInterval = this.getRandomNumber(
            this.INTERVAL_MIN,
            this.INTERVAL_MAX
        );
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createItem() {
        //index의 random 범위가 곧 생성되는 아이템
        //dataBase를 통한 접근..
        const currentStage = this.scoreInstance.currentStage;
        const currentUnlock = this.itemUnlock.find(unlock => unlock.stage_id === currentStage);
        console.log(currentUnlock, currentStage)
        const index = currentUnlock.item_id;
        const randomIndex = Math.floor(Math.random() * index);
        const itemInfo = this.itemImages[randomIndex];
        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(
            10,
            this.canvas.height - itemInfo.height
        );
        const item = new Item(
            this.ctx,
            itemInfo.id,
            x,
            y,
            itemInfo.width,
            itemInfo.height,
            itemInfo.image
        );

        this.items.push(item);
    }


    update(gameSpeed, deltaTime) {
        if(this.nextInterval <= 0) {
            this.createItem();
            this.setNextItemTime();
        }

        this.nextInterval -= deltaTime;

        this.items.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        this.items = this.items.filter(item => item.x > -item.width);
    }

    draw() {
        this.items.forEach((item) => item.draw());
    }

    collideWith(sprite) {
        const collidedItem = this.items.find(item => item.collideWith(sprite))
        if (collidedItem) {
            this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height)
            return {
                itemId: collidedItem.id
            }
        }
    }

    reset() {
        //this.items는 생성된 아이템?
        this.items = [];
    }
}

export default ItemController;