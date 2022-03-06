import Enreg from './structres/Enreg.js';
import Block from './structres/Block.js';

import Simple from './types/simple/Simple.js';


class SFSD {
    get simple() {
        return new Simple();
    }
}


export { Enreg, Block, SFSD };
