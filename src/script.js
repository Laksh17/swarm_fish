//Basic Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 650;
canvas.height = 650;

let gameframe = 0;

let canvasPosition = canvas.getBoundingClientRect();
//Add the fish object

class Fish {
    constructor() {
        this.x = Math.floor(Math.random() * 550) + 50;
        this.y = Math.floor(Math.random() * 550) + 50;
        this.radius = 50;
        // this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteHeight = 327;
        this.spriteWidth = 498;
    }
    update() {
        console.log("Function updated");
    }
    draw() {
        console.log("Function drew");
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);
    }
}
const fish1 = new Fish();


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fish1.update();
    fish1.draw();
    requestAnimationFrame(animate);
}
animate();

//Make 4 of them at random points
//Design the algo such that they cover every inch of area
//Mention the coords of other fish's locations to a given fish
