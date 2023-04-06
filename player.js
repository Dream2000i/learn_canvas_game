export class Player {
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.cursorPosition = {
            x:0,
            y:0
        };

        document.addEventListener('mousemove',e=>{
            this.cursorPosition.x = e.clientX;
            this.cursorPosition.y = e.clientY;
        })

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

    draw() {
        this.context.save();
        // let angle = Math.atan2(this.cursorPosition.y - this.y,this.cursorPosition.x - this.x);
        // this.context.translate(this.x, this.y);
        // this.context.rotate(angle + Math.PI/2);
        // this.context.translate(-this.x, -this.y);
        // this.context.rotate( 45*Math.PI/180);
        // this.context.scale(2,2);
        // this.context.rotate();
        // this.context.translate(-30,100);
        this.drawImg();
        this.context.restore();
    }
}