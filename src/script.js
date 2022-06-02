//Basic Canvas Setup
class Vector {
    constructor(...components) {
        this.components = components;
    }
    length() {
        return Math.hypot(...this.components)
    }
    scaleBy(number) {
        return new Vector(...this.components.map(components => components * number));
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 650;
canvas.height = 650;

let gameframe = 0;
let canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition.left);
//Add the fish object

class Fish {
    constructor() {
        // this.x = 50 + 550;
        this.x = 50 + Math.floor(Math.random() * (canvasPosition.width - 100));
        this.y = Math.floor(Math.random() * 550) + 50;
        this.radius = 15;
        this.targetX = 50 + Math.floor(Math.random() * (canvasPosition.width - (2 * this.radius)));
        this.targetY = 50 + Math.floor(Math.random() * (canvasPosition.height - (2 * this.radius)));
        this.frameX = 0;
        this.frameY = 0; //frames of sprite sheet
        this.frame = 0;
        // this.spriteHeight = 327;
        // this.spriteWidth = 498;
    }
    update() {
        // console.log("Function updated");
        const dx = this.x - this.targetX;
        const dy = this.y - this.targetY;
        const apporxX = 5;
        const apporxY = 5;
        if (dx >= apporxX || dx <= -apporxX) {
            this.x -= dx / 60;
            console.log(dx);
        }
        if (dy >= apporxY || dy <= -apporxY) {
            this.y -= dy / 60;
        }
        if (dx < apporxX && dy < apporxY) {
            this.targetX = 50 + Math.floor(Math.random() * (canvasPosition.width - (2 * this.radius)));
            // this.targetX = 400;
            this.targetY = 50 + Math.floor(Math.random() * (canvasPosition.height - (2 * this.radius)));
            // this.targetY = 400;
            // console.log("ran");
            console.log("This is target" + this.targetX);
            console.log("Current position: " + this.x);
        }
    }
    draw() {
        // console.log("Function drew");
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radius, 10);
    }
}
const fish1 = new Fish();
const fish2 = new Fish();
const fish3 = new Fish();
const fish4 = new Fish();

let fishyArray = [fish1, fish2, fish3, fish4];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let c of fishyArray) {
        c.update();
        c.draw();
    }
    requestAnimationFrame(animate);
}
animate();
// setTimeout(animate(), 10000);

//Make 4 of them at random points
//Design the algo such that they cover every inch of area
//Mention the coords of other fish's locations to a given fish


// console.log(Math.cos(3.14));