//To consider for the movement algorithm
//1) Number of fish present and increase/decrease to that number
//2) Interaction between fishes
//Extras:
//3) Tracking battery level and making the fish move to the shore when running low on battery

//To consider for the detection algorithm
//1) Color of the object should be different
//2) Store the coordinates at the time of object detection
//3) Alert user of dead/damaged robo fishes

//Algo Laksh is choosing - line path algo;



//Basic Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 650;
canvas.height = 650;

let count = 0;
let gameframe = 0;
let canvasPosition = canvas.getBoundingClientRect();
let fishyArray = [];
const generateButton = document.getElementById("generateFish");
console.log(canvasPosition.left);
//Add the fish object

class Fish {
    static count() {
        Fish.counter = (Fish.counter || 0) + 1;
        return;
    }
    constructor(number) {
        // this.x = 50 + 550;
        Fish.count();
        this.radius = 15;
        this.x = 15;
        this.y = 325;
        this.section = number;
        this.frameX = 0;
        this.frameY = 0; //frames of sprite sheet
        this.frame = 0;
        this.targetX = 15;
        this.targetY = 325;
        // this.spriteHeight = 327;
        // this.spriteWidth = 498;
    }
    deploy() {

    }
    pathSetup() {

    }
    update() {
        // console.log("Function updated");
        let rad = this.radius;
        let slot_end = this.section;
        let slot_start = this.section - 1;
        const dx = this.x - this.targetX;
        const dy = this.y - this.targetY;
        const apporxX = 6;
        const apporxY = 6;
        console.log("dy at first = " + dy);
        if (dx >= apporxX || dx <= -apporxX) {
            this.x -= dx / 60;
            console.log("dx = " + dx);
        }
        if (dy >= apporxY || dy <= -apporxY) {
            this.y -= dy / 60;
            console.log("dy = " + dy);

        }
        if (dx < apporxX && dy < apporxY) {
            this.targetX = rad + Math.floor(Math.random() * (canvasPosition.width - 2 * rad));
            // this.targetX = 400;
            this.targetY = (slot_start * canvasPosition.height / count) + Math.floor(Math.random() * ((canvasPosition.height / count) - rad)) + rad;
            // this.targetY = 400;
            // console.log("ran");
            console.log("This is target" + this.targetY);
            console.log("slot start " + slot_start + " and slot end: " + slot_end + " and count is " + count);
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
// const fish1 = new Fish();
// const fish2 = new Fish();
// const fish3 = new Fish();
// const fish4 = new Fish();


console.log(Fish.counter);
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let c of fishyArray) {
        c.update();
        c.draw();
    }
    requestAnimationFrame(animate);
}
animate();

// function handleFish() {
//     for (let i = 0; i < fishyArray.length; i++) {
//         fishyArray[i].update();
//         fishyArray[i].draw();
//         // console.log(fishyArray[i].section);
//     }
// }
generateButton.onclick = () => {

    fishyArray.push(new Fish(count + 1));
    console.log("ran");
    count++;
}
// setTimeout(animate(), 10000);

//Make 4 of them at random points
//Design the algo such that they cover every inch of area
//Mention the coords of other fish's locations to a given fish


// console.log(Math.cos(3.14));