const MOVE_UP_KEY_CODES = ["ArrowUp", "KeyW"];
const MOVE_DOWN_KEY_CODES = ["ArrowDown", "KeyS"];
const MOVE_LEFT_KEY_CODES = ["ArrowLeft", "KeyA"];
const MOVE_RIGHT_KEY_CODES = ["ArrowRight", "KeyD"];

export class Player {
    constructor(x, y, context) {
        this.velocity = 3;
        this.x = x;
        this.y = y;
        this.context = context;
        this.cursorPosition = {
            x: 0,
            y: 0
        };

        document.addEventListener('mousemove', e => {
            this.cursorPosition.x = e.clientX;
            this.cursorPosition.y = e.clientY;
        })


        this.keyMap = new Map();
        document.addEventListener("keydown", event => this.keyMap.set(event.code, true));
        document.addEventListener("keyup", event => this.keyMap.delete(event.code));

        this.image = new Image();
        this.image.src = "./img/player.png";
        this.imageWidth = 50;
        this.imageHeight = 60;

    }
    drawImg() {
        this.context.drawImage(
            this.image,
            0,
            0,
            this.imageWidth,
            this.imageHeight,
            this.x - this.imageWidth / 2,
            this.y - this.imageHeight / 2,
            this.imageWidth,
            this.imageHeight,
        );
    }

    update() {
        this.draw();
        this.updatePosition();
    }

    updatePosition() {
        if (this.shouldMove(MOVE_UP_KEY_CODES)) this.y -= this.velocity;
        if (this.shouldMove(MOVE_DOWN_KEY_CODES)) this.y += this.velocity;
        if (this.shouldMove(MOVE_LEFT_KEY_CODES)) this.x -= this.velocity;
        if (this.shouldMove(MOVE_RIGHT_KEY_CODES)) this.x += this.velocity;
    }


    shouldMove(keys) {
        return keys.some(key => this.keyMap.get(key));
    }

    draw() {
        this.context.save();
        let angle = Math.atan2(this.cursorPosition.y - this.y, this.cursorPosition.x - this.x);
        this.context.translate(this.x, this.y);
        this.context.rotate(angle + Math.PI / 2);
        this.context.translate(-this.x, -this.y);
        // this.context.rotate( 45*Math.PI/180);
        // this.context.scale(2,2);
        // this.context.rotate();
        // this.context.translate(-30,100);
        this.drawImg();
        this.context.restore();
    }
}