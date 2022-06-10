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
let intruderArray = [];
let shrimpArray = [];
const generateFishButton = document.getElementById("generateFish");
const clearFishButton = document.getElementById("clearFish");
const generateIntruderButton = document.getElementById("generateIntruder");
const clearIntruderButton = document.getElementById("clearIntruder");
const generateShrimpButton = document.getElementById("generateShrimp");
const clearShrimpButton = document.getElementById("clearShrimp");
console.log(canvasPosition.left);

function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

//Add the fish object

class Fish {
    static count() {
        Fish.counter = (Fish.counter || 0) + 1;
        return;
    }
    constructor(number) {
        // this.x = 50 + 550;
        Fish.count();
        this.isPaused = false;
        this.radius = 15;
        this.x = this.radius;
        this.y = canvasPosition.height / 2;
        this.section = number;
        this.frameX = 0;
        this.frameY = 0; //frames of sprite sheet
        this.frame = 0;
        this.gap = 10;
        this.targetX_start = this.radius;
        this.targetX_end = canvasPosition.width - this.radius;
        this.targetY_start = canvasPosition.height / 2;
        this.targetY_end = canvasPosition.height / 2;
        this.approxX = 1.5;
        this.approxY = 1.5;
        this.lastPath = false;
        this.reached = false;
        // this.spriteHeight = 327;
        // this.spriteWidth = 498;
    }

    update() {
        console.log("Function updated");
        let slot_end = this.section;
        let slot_start = this.section - 1;
        const apporxX = 3;
        const apporxY = 3;
        this.targetY_start = slot_start * (canvasPosition.height / count) + this.radius;
        this.targetY_end = slot_end * (canvasPosition.height / count) - this.radius;

        if (this.reached == false) {
            const dx = this.x - this.targetX_start;
            const dy = this.y - this.targetY_start;
            if (dx > apporxX || dx < -apporxX) {
                this.x -= dx / 60;
                console.log("dx = " + dx);
            }
            if (dy > apporxY || dy < -apporxY) {
                this.y -= dy / 60;
                console.log("dy = " + dy);
            }
            if ((Math.abs(dx) <= apporxX) && (Math.abs(dy) <= apporxY)) {
                this.reached = true;
                console.log("Third IF ran");
                console.log("This is target" + this.targetY_end);
                console.log("slot start " + slot_start + " and slot end: " + slot_end + " and count is " + count);
            }
        }
        else {
            let dx = this.x - this.targetX_end;
            console.log(dx);
            // dy = this.y - this.targetY_end;
            if (dx != 0) {
                if (dx < 0) {
                    this.x += 2;
                }
                else {
                    this.x -= 2;
                }
            }
            else {

                this.targetX_end = this.targetX_start + this.targetX_end;
                this.targetX_start = this.targetX_end - this.targetX_start;
                this.targetX_end = this.targetX_end - this.targetX_start;
                if (this.y + (2 * (this.radius + this.gap)) > this.targetY_end) {
                    if (this.lastPath == false) {
                        this.lastPath = true;
                        this.y = this.targetY_end;
                    }
                    else {
                        this.lastPath = false;
                        this.reached = false;
                        console.log("Change of Y ran");
                    }
                }
                else {
                    this.y = this.y + (this.radius + this.gap);
                    console.log("Change of X ran");
                }

            }
        }
    }
    draw() {
        // console.log("Function drew");
        ctx.fillStyle = '#073a0b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radius, 10);
    }
    checkIntruder() {
        intruderArray.forEach(intruder => {
            let dx = intruder.x - this.x;
            let dy = intruder.y - this.y;
            let distance = Math.sqrt((dx * dx) + (dy * dy));
            if (
                distance <= (intruder.radius + this.radius)
            ) {
                console.log("intruder started");
                alert("Intruder Detected at location, (" + this.x + ", " + this.y + ")");
                intruderArray = arrayRemove(intruderArray, intruder);
                console.log(intruderArray);
            }
        })
    }
}

class Intruder {
    constructor(locationX, locationY) {
        this.x = locationX;
        this.y = locationY;
        this.radius = 15;
    }
    update() {

    }
    draw() {
        // console.log("Function drew");
        ctx.fillStyle = '#7d20ed';
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radius, 10);
    }
}

class Shrimp {
    constructor(locationX, locationY) {
        this.x = locationX;
        this.y = locationY;
        this.radius = 10;
    }
    draw() {
        // console.log("Function drew");
        ctx.fillStyle = '#7d9900';
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radius, 10);
    }
}

console.log(Fish.counter);
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let c of fishyArray) {
        c.update();
        c.draw();
        c.checkIntruder();
    }
    for (let i of intruderArray) {
        i.draw();
    }
    for (let j of shrimpArray) {
        j.draw();
    }
    requestAnimationFrame(animate);
}
animate();

generateFishButton.onclick = () => {
    fishyArray.push(new Fish(count + 1));
    console.log("ran");
    count++;
}

clearFishButton.onclick = () => {
    fishyArray.pop();
    count--;
}

generateIntruderButton.onclick = () => {
    intruderArray.push(new Intruder((Math.random() * (canvasPosition.width - (2 * 15))) + 15, (Math.random() * (canvasPosition.height - (2 * 15))) + 15))
    console.log("Intruder created");
}

clearIntruderButton.onclick = () => {
    intruderArray.pop();
}

generateShrimpButton.onclick = () => {
    shrimpArray.push(new Shrimp((Math.random() * (canvasPosition.width - (2 * 15))) + 15, (Math.random() * (canvasPosition.height - (2 * 15))) + 15))
    console.log("Shrimp created");
}

clearShrimpButton.onclick = () => {
    shrimpArray.pop();
}