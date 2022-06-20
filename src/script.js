//Basic Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 850;
canvas.height = 700;
const fishRadius = 38

let deployedState = false;
let count = 0;
let gameframe = 0;

let canvasPosition = canvas.getBoundingClientRect();
let fishyArray = [];
let intruderArray = [];
let shrimpArray = [];
const deployFishButton = document.getElementById("deployFish");
const clearFishButton = document.getElementById("clearFish");
const generateIntruderButton = document.getElementById("generateIntruder");
const clearIntruderButton = document.getElementById("clearIntruder");
const generateShrimpButton = document.getElementById("generateShrimp");
const clearShrimpButton = document.getElementById("clearShrimp");
console.log(canvas.height);

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

//Create a class for quadrants to be chosen
//Should accept details about all their 4 points which will be given via another function
//Assign them some numbers
//Allot each spawned fish with one of those numbers

//Add the fish object
class Quadrant {
    constructor(xStart, yStart, xEnd, yEnd) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.occupied = false;
    }
}

class Fish {
    constructor(radius_num, x1, y1, x2, y2) {
        // this.x = 50 + 550;
        this.isPaused = false;
        this.radius = radius_num;
        this.x = this.radius;
        this.y = canvas.height / 2;
        this.frameX = 0;
        this.frameY = 0; //frames of sprite sheet
        this.frame = 0;
        this.angle = 0;
        this.gap = 10;
        this.targetX_start = x1;
        this.targetX_end = x2;
        this.targetY_start = y1;
        this.targetY_end = y2;
        this.approxX = 1.5;
        this.approxY = 1.5;
        this.lastPath = false;
        this.reached = false;
        this.spriteHeight = 327;
        this.spriteWidth = 498;
        this.batteryLevel = 100;
    }

    update() {
        // console.log(3);
        const apporxX = 3;
        const apporxY = 3;
        if (this.reached == false && this.batteryLevel > 15) {
            console.log("IN first else");
            const dx = this.x - this.targetX_start;
            const dy = this.y - this.targetY_start;
            let theta = Math.atan2(dy, dx);
            this.angle = theta;
            console.log("dx = " + dx);
            console.log("dy = " + dy);

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
            }

        }
        else if (this.reached == true && this.batteryLevel > 15) {
            let dx = this.x - this.targetX_end;
            console.log("IN second else");
            console.log(dx);
            // dy = this.y - this.targetY_end;
            if (Math.abs(dx) > this.approxX) {
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
        else {
            console.log("IN third else");
            let dx;
            let dy;
            if (this.x > (canvas.width / 2)) {
                dx = this.x - canvas.width + this.radius;
                console.log(dx + ' is dx');
            }
            else {
                dx = this.x - this.radius;
                console.log(dx + ' is dx');
            }
            if (this.y > (canvas.height / 2)) {
                dy = this.y - canvas.height + this.radius;
                console.log(dy + ' is dy');
            }
            else {
                dy = this.y - this.radius;
                console.log(dy + ' is dy');
            }

            if (Math.abs(dx) <= Math.abs(dy)) {
                if (dx > 0) {
                    this.x--;
                }
                else if (dx < 0) {
                    this.x++;
                }
            }
            else {
                if (dy > 0) {
                    this.y--;
                }
                else {
                    this.y++;
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




quadrantTopLeft = new Quadrant(fishRadius, fishRadius, (canvas.width / 2) - fishRadius, (canvas.height / 2) - fishRadius);
quadrantTopRight = new Quadrant((canvas.width / 2) + fishRadius, fishRadius, canvas.width - fishRadius, (canvas.height / 2) - fishRadius);
quadrantBottomLeft = new Quadrant(fishRadius, (canvas.height / 2) + fishRadius, (canvas.width / 2) - fishRadius, canvas.height - fishRadius);
quadrantBottomRight = new Quadrant((canvas.width / 2) + fishRadius, (canvas.height / 2) + fishRadius, canvas.width - fishRadius, canvas.height - fishRadius);

quadrantArray = [quadrantTopLeft, quadrantTopRight, quadrantBottomLeft, quadrantBottomRight];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#233232";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.fillStyle = "#233232";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    for (let c of fishyArray) {
        c.update();
        c.draw();

    }
    console.log(1);
    // for (let i of intruderArray) {
    //     i.update();
    //     i.draw();
    // }
    // for (let j of shrimpArray) {
    //     j.update();
    //     j.draw();
    // }
    requestAnimationFrame(animate);
}
animate();

setInterval(() => {
    for (let i of fishyArray) {
        i.batteryLevel -= 2;
    }
}, 1000);

deployFishButton.onclick = () => {
    if (deployedState != true) {
        for (let i of quadrantArray) {
            fishyArray.push(new Fish(fishRadius, i.xStart, i.yStart, i.xEnd, i.yEnd));
            console.log(i.xStart)
        }
        deployedState = true;
    }
}
