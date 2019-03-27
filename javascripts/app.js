const rl = require('readline-sync');

const roverMap = []
for (let i = 0; i < 10; i++) roverMap.push([...Array(10)].fill("_"))

let numOfRovers = null
let selectedRover = null
const totalObstacles = []
const roverLocations = []
const roversOnMap = []
const errors = {
  badInputMessage: "A command was not recongnized. Try Again",
  outOfBoundsMessage: "The rover will fall off the map if these commands are accepted. Please try again.",
  collisionMessage: "The next command will result in the rover hitting an obstacle. Please try again.",
  roverCollisionMessage: "You are about to crash into another rover. Try again.",
}

const getRandomNum = _ => Math.floor(Math.random() * 10)

const createObstacles = (num) => {
  while (num > 0) {
    const col = getRandomNum();
    const row = getRandomNum();
    roverMap[row][col] = "X";
    totalObstacles.push(`(${col}, ${row})`);
    num--;
  }
}

class Rover {
  constructor(name, direction, x, y, travelLog) {
    this.name = name;
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.travelLog = travelLog;
    this.error = null;
  }

  turnLeft() {
    switch (this.direction) {
      case 'N':
        this.direction = 'W';
        break;
      case 'E':
        this.direction = 'N';
        break;
      case 'S':
        this.direction = 'E';
        break;
      case 'W':
        this.direction = 'S';
        break;
    }
    console.log("turnLeft was called!")
    console.log(`Rover ${this.name} is now facing ${this.direction}`)
  }

  turnRight() {
    switch (this.direction) {
      case 'N':
        this.direction = 'E';
        break;
      case 'E':
        this.direction = 'S';
        break;
      case 'S':
        this.direction = 'W';
        break;
      case 'W':
        this.direction = 'N';
        break;
    }
    console.log("turnRight was called!");
    console.log(`Rover ${this.name} is now facing ${this.direction}`)
  }

  moveForward() {
    const prevX = this.x
    const prevY = this.y

    switch (this.direction) {
      case 'N':
        this.y--;
        break;
      case 'E':
        this.x++;
        break;
      case 'S':
        this.y++;
        break;
      case 'W':
        this.x--;
        break;
    }

    const currentCoords = `(${this.x}, ${this.y})`
    this.outOfBounds() || 
      this.hitObstacle(currentCoords) || 
      this.hitOtherRover(currentCoords) || 
      this.resetMap(prevX, prevY);
    if (this.error) {
      this.resetMovement(prevX, prevY);
      console.log(errors[this.error])
      this.error = null
    } else this.travelLog.push(currentCoords)
  }

  moveBackward() {
    const prevX = this.x;
    const prevY = this.y;

    switch (this.direction) {
      case 'N':
        this.y++;
        break;
      case 'E':
        this.x--;
        break;
      case 'S':
        this.y--;
        break;
      case 'W':
        this.x++;
        break;
    }

    const currentCoords = `(${this.x}, ${this.y})`
    this.outOfBounds() || 
      this.hitObstacle(currentCoords) || 
      this.hitOtherRover(currentCoords) || 
      this.resetMap(prevX, prevY);
    if (this.error) {
      this.resetMovement(prevX, prevY)
      console.log(errors[this.error])
      this.error = null
    } else this.travelLog.push(currentCoords)
  }

  resetMovement(prevX, prevY) {
    //this.travelLog.pop()
    this.x = prevX
    this.y = prevY
  }

  resetMap(prevX, prevY) {
    roverMap[prevY][prevX] = "_"
  }

  outOfBounds() {
    if (this.x < 0 || this.x > 9 || this.y < 0 || this.y > 9)
      this.error = "outOfBoundsMessage"
  }

  hitObstacle(coords) {
    if (totalObstacles.includes(coords)) this.error = "collisionMessage"
  }

  hitOtherRover(coords) {
    if (roverLocations.includes(coords)) this.error = "roverCollisionMessage"
  }

  commands(str) {
    str.split("").forEach(command => {
      if (command === 'f') this.moveForward()
      else if (command === 'b') this.moveBackward()
      else if (command === 'r') this.turnRight()
      else if (command === 'l') this.turnLeft()
      else console.log(badInputMessage)
    })
    console.log(`Rover ${this.name} has travelled over the following coordinates: ${this.travelLog}`);
    roverLocations.push(this.travelLog[this.travelLog.length - 1])
    roverMap[this.y][this.x] = `${this.name.substr(0,1)}`
  }
}

// //Hard coded rovers
// let rover1 = new Rover('R1', 'N', 0, 0, ["(0,0)"])
// let rover2 = new Rover('R2', 'N', 9, 0, ["(9,0)"])
// let rover3 = new Rover('R3', 'N', 5, 5, ["(5,5"])
// roversOnMap.push(rover1, rover2, rover3)

console.log("NASA is sending a rover to Mars and it's our job to ensure the success of the mission.")
console.log("We will be sending rovers on test missions using a 10x10 grid. Obstacles will be placed at random.")
createObstacles(getRandomNum())
console.log(`\nThe obstacles are located at the following coordinates: ${totalObstacles}`)
console.log('These obstacles will be represended as "X" on the map.\n')
console.log("Let's create some rover objects to send on missions.")

do {
  numOfRovers = rl.question("Enter the number of rovers you would like to create (1-5): ")
} while (numOfRovers < 1 || numOfRovers > 5);

let x = null
let y = null
let initialCoords = null
let direction = null

const directionInput = _ => {
  const allDirections = ['N', 'E', 'S', 'W']
  direction = rl.question("Direction (N, E, S, W): ")
  if (!allDirections.includes(direction)) {
    console.log("That is not a valid direction. Try again.")
    directionInput()
  }
}

const coordsInput = _ => {
  do {
    x = rl.question("Initial x-coordinate (0 to 9): ")
  } while (x < 0 || x > 9)
  do {
    y = rl.question("Initial y-coordinate (0 to 9): ")
  } while (y < 0 || y > 9)
  initialCoords = `(${x}, ${y})`
  if (totalObstacles.includes(initialCoords)) {
    console.log("You can't place a rover on an obstacle. Try again.")
    coordsInput()
  }
}

for (let i = 0; i < numOfRovers; i++) {
  console.log(`Please enter the information for Rover ${i + 1}.`)
  const name = rl.question("Name: ")
  const initial = name.substr(0,1)
  directionInput()
  coordsInput()
  roversOnMap.push(new Rover(name, direction, x, y))
  roversOnMap[i].travelLog = [initialCoords]
  roverMap[y][x] = `${initial}`
}

const roverInput = _ => {
  console.log("Which rover would you like to control?")
  roversOnMap.forEach(rover => console.log(rover.name))
  const selection = rl.question("Selection: ")
  selectedRover = roversOnMap.find(rover => rover.name === selection)
  if (!roversOnMap.includes(selectedRover)) {
    console.log("That is not a valid selection. Please try again.")
    roverInput()
  }
}

console.log("Rover creation is a success.")
console.log("Here is the map created for the test mission: \n")
console.log(roverMap)

const controlRovers = _ => {
  selectedRover = roversOnMap[0]
  if (numOfRovers > 1) {
    roverInput()
  } 
  const commands = rl.question("Enter commands (r,l,f,b): ")
  selectedRover.commands(commands)
  if (rl.keyInYN("Would you like to continue the test mission?")) {
    console.log(roverMap)
    controlRovers()
  }
  else {
    console.log(`Here is the final map:`)
    console.log(roverMap)
    return;
  }
}

controlRovers();


