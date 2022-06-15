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
const fishLeft = new Image();
fishLeft.src = 'fish_left.png';
const fishRight = new Image();
fishRight.src = 'fish_right.png';
const intruderLeft = new Image();
intruderLeft.src = 'intruder_fish_left.png';
const intruderRight = new Image();
intruderRight.src = 'intruder_fish_right.png';
const shrimpLeft = new Image();
shrimpLeft.src = 'Prawn_Sprite.png';
const shrimpRight = new Image();
shrimpRight.src = 'Prawn_Sprite_Flip.png';
class Fish {
    static count() {
        Fish.counter = (Fish.counter || 0) + 1;
        return;
    }
    constructor(number) {
        // this.x = 50 + 550;
        Fish.count();
        this.isPaused = false;
        this.radius = 38;
        this.x = this.radius;
        this.y = canvasPosition.height / 2;
        this.section = number;
        this.frameX = 0;
        this.frameY = 0; //frames of sprite sheet
        this.frame = 0;
        this.angle = 0;
        this.gap = 10;
        this.targetX_start = this.radius;
        this.targetX_end = canvasPosition.width - this.radius;
        this.targetY_start = canvasPosition.height / 2;
        this.targetY_end = canvasPosition.height / 2;
        this.approxX = 1.5;
        this.approxY = 1.5;
        this.lastPath = false;
        this.reached = false;
        this.spriteHeight = 327;
        this.spriteWidth = 498;
        this.batteryLevel = 100;
    }

    update() {
        console.log("Function updated");
        let slot_end = this.section;
        let slot_start = this.section - 1;
        const apporxX = 3;
        const apporxY = 3;
        this.targetY_start = slot_start * (canvasPosition.height / count) + this.radius;
        this.targetY_end = slot_end * (canvasPosition.height / count) - this.radius;

        if (this.reached == false && this.batteryLevel > 15) {
            const dx = this.x - this.targetX_start;
            const dy = this.y - this.targetY_start;
            let theta = Math.atan2(dy, dx);
            this.angle = theta;
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
        else if (this.reached == true && this.batteryLevel > 15) {
            let dx = this.x - this.targetX_end;

            console.log(dx);
            // dy = this.y - this.targetY_end;
            if (dx != 0) {
                if (dx < 0) {
                    this.x += 2;
                    let theta = Math.atan2(0, dx);
                    this.angle = theta;
                }
                else {
                    this.x -= 2;
                    let theta = Math.atan2(0, dx);
                    this.angle = theta;
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
                        let theta = Math.atan2(this.y, 0);
                        this.angle = theta;
                    }
                    else {
                        this.lastPath = false;
                        this.reached = false;
                        console.log("Change of Y ran");
                    }
                }
                else {
                    this.y = this.y + (this.radius + this.gap);
                    let theta = Math.atan2(this.y, 0);
                    this.angle = theta;
                    console.log("Change of X ran");
                }

            }
        }
    }
    draw() {
        // console.log("Function drew");
        if (this.batteryLevel > 0) {
            if (this.batteryLevel >= 60) {
                ctx.fillStyle = "#145214";
            }
            else if (this.batteryLevel < 60 && this.batteryLevel >= 30) {
                ctx.fillStyle = "#e6e600";
            }
            else if (this.batteryLevel < 30 && this.batteryLevel >= 10) {
                ctx.fillStyle = "#ff6600";
            }
            else {
                ctx.fillStyle = "#ff1a1a";
            }

            ctx.strokeStyle = "black";
            ctx.font = "20px Verdana";
            ctx.fillText(this.batteryLevel + "%", this.x - 16, this.y + 53);
        }
        // let dx = this.x - this.targetX_end;
        // let dy = this.y - this.targetY_end;
        // let theta = Math.atan2(dy, dx);
        // this.angle = theta;
        // ctx.fillRect(this.x, this.y, this.radius, 10);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let dx = this.x - this.targetX_end;
        if (dx <= 0) {
            ctx.drawImage(fishRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 35, 0 - 25, this.spriteWidth / 7, this.spriteHeight / 6);
        }
        else {
            ctx.drawImage(fishLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 35, 0 - 25, this.spriteWidth / 7, this.spriteHeight / 6);
        }
        ctx.restore();
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
        this.radius = 27;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteHeight = 397;
        this.spriteWidth = 418;
        this.targetX_end = locationX;
        this.targetY_end = locationY;
    }
    update() {
        let dx = this.x - this.targetX_end;
        let dy = this.y - this.targetY_end;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        console.log(dx, dy);
        if (dx > 0) {
            this.x--;
        }
        else if (dx < 0) {
            this.x++;
        }
        if (dy > 0) {
            this.y--;
        }
        else if (dy < 0) {
            this.y++;
        }
        if (dx == 0 && dy == 0) {

            this.targetX_end = Math.floor((Math.random() * (canvas.width - (2 * this.radius))) + this.radius);
            this.targetY_end = Math.floor((Math.random() * (canvas.height - (2 * this.radius))) + this.radius);
        }
    }
    draw() {
        // console.log("Function drew");
        ctx.fillStyle = 'rgba(255,255,255,0.0)';
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let dx = this.x - this.targetX_end;

        if (dx <= 0) {
            ctx.drawImage(intruderRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 25, 0 - 25, this.spriteWidth / 8, this.spriteHeight / 8);
        }
        else {
            ctx.drawImage(intruderLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 25, 0 - 25, this.spriteWidth / 8, this.spriteHeight / 8);
        }
        ctx.restore();
        // ctx.fillRect(this.x, this.y, this.radius, 10);
    }
}

class Shrimp {
    constructor(locationX, locationY) {
        this.x = locationX;
        this.y = locationY;
        this.radius = 10;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 205;
        this.spriteHeight = 189;
        this.targetX_end = locationX;
        this.targetY_end = locationY;
    }
    update() {
        let dx = this.x - this.targetX_end;
        let dy = this.y - this.targetY_end;
        console.log(dx, dy);
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        console.log(dx, dy);
        if (dx > 0) {
            this.x -= 0.25;
        }
        else if (dx < 0) {
            this.x += 0.25;
        }
        if (dy > 0) {
            this.y -= 0.25;
        }
        else if (dy < 0) {
            this.y += 0.25;
        }
        if (dx == 0 && dy == 0) {

            this.targetX_end = Math.floor((Math.random() * (canvas.width - (2 * this.radius))) + this.radius);
            this.targetY_end = Math.floor((Math.random() * (canvas.height - (2 * this.radius))) + this.radius);
        }
    }
    draw() {
        // console.log("Function drew");
        ctx.fillStyle = 'rgba(255,255,255,0.0)';
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let dx = this.x - this.targetX_end;

        if (dx <= 0) {
            ctx.drawImage(shrimpRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 30, 0 - 20, this.spriteWidth / 4, this.spriteHeight / 4);
        }
        else {
            ctx.drawImage(shrimpLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 30, 0 - 20, this.spriteWidth / 4, this.spriteHeight / 4);
        }
        ctx.restore();

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
        i.update();
        i.draw();
    }
    for (let j of shrimpArray) {
        j.update();
        j.draw();
    }
    requestAnimationFrame(animate);
}
animate();

setInterval(() => {
    for (let i of fishyArray) {
        i.batteryLevel -= 2;
    }
}, 1000);


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
    intruderArray.push(new Intruder(Math.floor((Math.random() * (canvasPosition.width - (2 * 15))) + 15), (Math.floor(Math.random() * (canvasPosition.height - (2 * 15))) + 15)))
    console.log("Intruder created");
}

clearIntruderButton.onclick = () => {
    intruderArray.pop();
}

generateShrimpButton.onclick = () => {
    shrimpArray.push(new Shrimp(Math.floor((Math.random() * (canvasPosition.width - (2 * 15))) + 15), Math.floor((Math.random() * (canvasPosition.height - (2 * 15))) + 15)))
    console.log("Shrimp created");
}

clearShrimpButton.onclick = () => {
    shrimpArray.pop();
}