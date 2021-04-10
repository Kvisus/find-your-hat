const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
/* field view
[
    [],
    [],
    []
] */
let currentlyPlaying = true;
class Field {
    constructor(field) {
        this._field = field;
        this.y = 0;
        this.x = 0;
    }
    get field() {
        return this._field;
    }
    print() {
        return this.field.map(row =>
            row.join('')
        ).join('\n');
    }
    turn() {
        let move = prompt('Where do you wanna move? Use WSAD \n');
        switch (move.toLowerCase()) {
            case 'w':
                this.y -= 1;
                break;
            case 's':
                this.y += 1;
                break;
            case 'a':
                this.x -= 1;
                break;
            case 'd':
                this.x += 1;
                break;
            default:
                break;
        }
    }
    //Detect the game status if player wins or loses
    checkWin() {
        //The game will crash if trying to read an out of range array. For example: this.field[-1][0], so this if condition is trying to capture the error.
        //However, this.field[0][-1] will return 'undefined' which will be capture in below switch/case
        if (this.field[this.y] == undefined) {
            console.log('You lose - Out of boundary');
            return currentlyPlaying = false;
        }
        //
        switch (this.field[this.y][this.x]) {
            case hole:
                console.log('You lose - You fell in a hole!');
                currentlyPlaying = false;
                break;
            case undefined:
                console.log('You lose - Out of boundary');
                currentlyPlaying = false;
                break;
            case hat:
                console.log('You win - You found the hat!');
                currentlyPlaying = false;
                break;
            case fieldCharacter:
                console.log('Keep looking for the hat...');
                this.field[this.y][this.x] = pathCharacter;
                break;
            case pathCharacter:
                console.log('You are stepping on *');
                break;
        }
    }

    static generateField(height, width, percentage) {

        //Helper function to return hole or fieldCharacter depening on percentage.
        const fieldOrHole = (percentage) => {
            if (percentage >= 0 && percentage <= 100) {
                const ranNum = Math.random() * 100;
                if (ranNum < percentage) {
                    return hole;
                } else {
                    return fieldCharacter;
                }
            } else {
                console.log('Please enter a number between 0 - 100');
            }
        }

        ////Helper function to return a plain field with no hat and pathCharacter
        const plainField = () => {
            function makeWidthArray() {
                let widthArray = [];
                for (let i = 0; i < width; i++) {
                    widthArray.push(fieldOrHole(percentage));
                }
                return widthArray;
            }
            let plainField = [];
            for (let i = 0; i < height; i++) {
                plainField.push(makeWidthArray());
            }
            return plainField;
        }

        const gameReadyField = plainField();

        //Adding hat on gameReadyField, while loop will check if hat sits on * and will reposition if so
        do {
            gameReadyField[Math.floor(Math.random() * height)][Math.floor(Math.random() * width)] = hat;
        } while (gameReadyField[0][0] == hat);

        //Adding pathCharacter to left-upper corner
        gameReadyField[0][0] = pathCharacter;

        return gameReadyField;
    }

}

//Generating a new randomized field into "newField" and will insert to "myField" below:
//generateField() takes 3 parameters. First is the y-axis, second is x-axis and third id the percentage of holes in the field(Please enter between 0 - 100).

const myField = new Field(Field.generateField(10, 10, 30));

function game() {
    while (currentlyPlaying) {
        console.log(myField.print());
        myField.turn();
        myField.checkWin();
    }
    console.log('Game Over!');
}

game();

/* const hatIsFound = false;
const errorFlag = false;
const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);
let a=myField.field;
console.log(a[2][1]);

*/
  //while (!hatIsFound && !errorFlag) {


