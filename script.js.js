import { Player } from "./player.js";

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width =500;
canvas.height = 500;


let player = new Player(canvas.width/2, canvas.height/2, context);

animate();

function animate() {
    requestAnimationFrame(animate);
    player.draw();
}

