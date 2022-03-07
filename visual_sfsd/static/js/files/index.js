import { SFSD, Block, Enreg } from './SFSD/SFSD.js';


let Sfsd = new SFSD();

let newFile = Sfsd.simple.tof('file.txt');

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

for (let i = 1; i <= 10; i++) {
    let rn = randInt(0, 100);
    newFile.insert(
        rn,
        {
            name: "Uo",
            age: 13
        },
    )
}

newFile.insert(
    33,
    {
        name: "Uo",
        age: 13
    },
)

newFile.print();
let res = newFile.removeLogically(33);
console.log(res);
newFile.print();