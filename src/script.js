
const canvas = document.getElementById('canvas'); //Pool area
const ctx = canvas.getContext('2d');
canvas.width = 850;
canvas.height = 700;
const fishRadius = 38; //Hit-Box radius of the fish
const maxDeadFish = 1; //Highest possible number of dead fish (for simulation purposes)
let currentDeadFish = 0;

let deployedState = false; //Check whether initial deployment of the fish is done or not
let count = 0; //Current number of fishes present
let idNum = 1; //Assigns ID number to every deployed fish by incrementing after every fish is deployed

//Function removes a value from an array
function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

let canvasPosition = canvas.getBoundingClientRect(); //Fetches details about the position of an object in the canvas
let fishyArray = []; //Array of fishes
let contaminationArray = []; //Array of contaminated zones (higher TDS)
const deployFishButton = document.getElementById("deployFish");
const clearFishButtons = document.getElementsByClassName("remove-buttons");
const errorMessage = document.getElementById("error");

//Sprites
const fishLeft = new Image();
fishLeft.src = 'fish_left.png';
const fishRight = new Image();
fishRight.src = 'fish_right.png';

//Extra Sprites
const intruderLeft = new Image();
intruderLeft.src = 'intruder_fish_left.png';
const intruderRight = new Image();
intruderRight.src = 'intruder_fish_right.png';
const shrimpLeft = new Image();
shrimpLeft.src = 'Prawn_Sprite.png';
const shrimpRight = new Image();
shrimpRight.src = 'Prawn_Sprite_Flip.png';

class Contamination {
    constructor(width, height, tds) {
        this.width = width;
        this.height = height;
        this.xStart = Math.random() * (canvas.width - width);
        this.yStart = Math.random() * (canvas.height - height);
        this.Xcenter = this.xStart + (width / 2);
        this.Ycenter = this.yStart + (height / 2);
        this.TDS = tds;
        this.hitBoxRadius = width > height ? height : width;
    }
    draw() {
        ctx.fillStyle = '#2023eb';
        ctx.beginPath();
        ctx.rect(this.xStart, this.yStart, this.width, this.height);
        ctx.fill();
        ctx.closePath();
        ctx.save();
    }
}

class Quadrant {
    constructor(xStart, yStart, xEnd, yEnd) {
        //Quadrant is defined by 4 points
        this.xStart = xStart;
        this.yStart = yStart;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.occupied = false; //Status of the quadrant
        this.center_x = xStart + ((this.xEnd - this.xStart) / 2);
        this.center_y = yStart + ((this.yEnd - this.yStart) / 2);
        this.coords = [this.xStart, this.yStart, this.xEnd, this.yEnd]; //Array of coordinates
    }
}

class Fish {
    constructor(radius_num, quad, idNum) {
        this.parts = {
            WifiModule: 0.02,
            DepthSensor: 0.03,
            ShortCircuit: 0.04,
            UltrasonicSensor: 0.05,
            IRSensor: 0.06,
            pHSensor: 0.08,
            TDSSensor: 0.09,
            Camera: 0.1,
        };
        this.id = idNum;
        this.radius = radius_num; //Radius of the hit-box of the fish
        this.x = this.radius; //Initial x and y coordinates
        this.y = canvas.height / 2;
        this.frameX = 0;
        this.frameY = 0; //frames of sprite sheet
        this.frame = 0;
        this.angle = 0; //Denotes how the sprite is oriented
        this.gap = 10; //minimum gap to be maintained for moving onto the next row in a quadrant

        //Starting and ending x and y coords
        this.targetX_start = quad.xStart;
        this.targetX_end = quad.xEnd;
        this.targetY_start = quad.yStart;
        this.targetY_end = quad.yEnd;

        this.positions = [this.targetX_start, this.targetY_start, this.targetX_end, this.targetY_end]; //Array to access them sequentially
        this.approxX = 1.5; // Minimum difference in the destination calculated vs actual destination
        this.approxY = 1.5;
        this.lastPath = false;
        this.reached = false;
        this.spriteHeight = 327;
        this.spriteWidth = 498;
        this.batteryLevel = 100;
        this.distance = 0;
        this.priority = 0;
        this.quadrants = [quad];
        this.bufferQuad = quad;
        this.accomodate = false
    }

    update() {
        const apporxX = 3;
        const apporxY = 3;
        if (this.quadrants.length > 1 && this.accomodate == false) {
            if (this.quadrants[0].xStart == this.quadrants[1].xStart) {
                this.targetY_start = this.radius;
                this.targetY_end = canvas.height - this.radius;
                this.accomodate = true;
            }
            else if (this.quadrants[0].yStart == this.quadrants[1].yStart) {
                this.targetX_start = this.radius;
                this.targetX_end = canvas.width - this.radius;
                this.accomodate = true;
            }
        }
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
    checkTDS() {
        contaminationArray.forEach(region => {
            let dx = region.Xcenter - this.x;
            let dy = region.Ycenter - this.y;
            let distance = Math.sqrt((dx * dx) + (dy * dy));
            if (
                distance <= (region.hitBoxRadius + this.radius)
            ) {
                console.log("detection of contamination started");
                alert("Region of higher TDS Detected at location, (" + this.x + ", " + this.y + ")");
                contaminationArray = arrayRemove(contaminationArray, region);
            }
        })
    }
    checkAbsence() {
        let qNumber = quadrantArray.length;
        let fNumber = fishyArray.length;
        if (qNumber != fNumber) {
            for (let i of quadrantArray) {
                if (i.occupied == false) {
                    console.log("Checkabsence is running");
                    console.log("quadrant is ", i);
                    this.distance = Math.sqrt((this.x - i.center_x) ** 2 + (this.y - i.center_y) ** 2);
                    this.bufferQuad = i;
                    console.log("distance of " + this.id.toString() + " is " + this.distance.toString());

                }
            }
        }
    }
    checkOtherDistances() {
        for (let i of fishyArray) {
            if (i.distance > this.distance) {
                this.priority++;
                console.log("priority of " + this.id.toString() + " is " + this.priority.toString());
            }
        }
        if (this.priority == (count - 1)) {
            console.log("Checkdistance is running for fish ", this.id);
            this.quadrants.push(this.bufferQuad);
            // this.bufferQuad.occupied = true;
            this.bufferQuad = 0;
        }
    }
    crash() {
        let randomNum = Math.random();
        for (let key in this.parts) {
            if (randomNum < this.parts[key]) {
                count -= 1;
                console.log("count = ", count)
                currentDeadFish++;

                for (let i of this.quadrants) {
                    i.occupied = false;
                    // console.log("quadrant is ", i);
                }

                errorMessage.textContent = key.toString() + " error: Fish ID-" + this.id.toString() + " has been withdrawn.";
                errorMessage.style.display = "block";
                fishyArray = arrayRemove(fishyArray, this)
                for (let f of fishyArray) {
                    f.checkAbsence();
                }
                for (let g of fishyArray) {
                    g.checkOtherDistances();
                }
                break;
            }
        }

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
        c.checkTDS();
    }
    for (let i of contaminationArray) {
        i.draw();
    }
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
        i.batteryLevel -= 1;
        if (currentDeadFish < maxDeadFish) {
            i.crash();
        }
    }
}, 3000);



deployFishButton.onclick = () => {
    if (deployedState != true && count == 0) {
        for (let i of quadrantArray) {
            fishyArray.push(new Fish(fishRadius, i, idNum));
            // t = document.createElement("button");
            // mainDiv = document.getElementById("button-div");
            // t.className = "remove-buttons";
            // t.textContent = "Remove Fish";
            // mainDiv.append(t);
            console.log(i.xStart);
            i.occupied = true;
            idNum++;
        }
        deployedState = true;
        count += 4;
        console.log(fishyArray[0].parts["Camera"]);
    }
    document.getElementById("deployFish").style.display = "none";
}



setInterval(() => {
    let randomGen = Math.random();
    if (randomGen > 0. && contaminationArray.length < 8) {
        contaminationArray.push(new Contamination((Math.random() + 0.5) * 30, (Math.random() + 0.5) * 30, 200))
    }

}, 1000);
// function runRemoveCheck() {
//     [...clearFishButtons].forEach(button => {
//         button.addEventListener('click', function handleClick(event) {
//             if (currentDeadFish < maxDeadFish) {
//                 button.style.display = "none";
//                 currentDeadFish++;

//                 let current_button_index = [...clearFishButtons].indexOf(button);
//                 for (let q of fishyArray[current_button_index].quadrants) {
//                     q.occupied = false;
//                     console.log(q);
//                 }
//                 fishyArray.splice(current_button_index, 1);
//                 count--;
//                 for (let f of fishyArray) {
//                     f.checkAbsence();
//                 }
//                 for (let g of fishyArray) {
//                     g.checkOtherDistances();
//                 }

//                 runRemoveCheck();
//                 console.log(clearFishButtons);
//                 button.className = "something-else";
//                 console.log(fishyArray);
//             }
//         });

//     });
// }

