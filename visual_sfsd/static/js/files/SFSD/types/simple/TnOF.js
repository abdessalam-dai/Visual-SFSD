import File from '../../structres/File.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';


export default class TnOF extends File {
    search(key) {
        /*
            input :
                    key : key to search [Int]
            output :
                    {
                        found : [Boolean]
                        pos : {
                            i: [Int],
                            j: [Int]
                        }
                    }
        */

        let nbBlocks = this.blocks.length;

        let i = 0,
            j = 0;
        let found = false;

        while (i < nbBlocks && !found) {
            let currBlock = this.blocks[i];
            j = 0;

            while (j < currBlock.nb && !found) {
                if (key === currBlock.enregs[j].key) {
                    found = true;
                    break;
                } else {
                    j++;
                }
            }
            if (!found) {
                i++;
            }
        }

        return {
            found: found,
            pos: {
                i: i,
                j: j
            }
        }
    }

    insert(key, data, removed = false) {
        /*
            input :
                    key :       [Int]
                    data :      [Object]
                    removed     [Boolean]
            output :
                    [Boolean] ==> if enreg. is inserted return true, else false (if key already exits !)
        */

        // if the key does not exist
        if (!this.search(key).found) {
            let newEnreg = new Enreg(key, data, removed); // create a new enreg.
            let lastBlock = this.blocks[this.blocks.length - 1];

            // check if here is enough space last block
            if (lastBlock.enregs.length < this.maxNbEnregs) {
                this.blocks[lastBlock].enregs.push(newEnreg);
            } else {
                // create a new block and append to it the new enreg.
                let newBlock = new Block();
                this.blocks.push(newBlock);
                newBlock.enregs.push(newEnreg);
                this.nbBlocks += 1;
            }

            return true;
        }
        else {
            return false
        }
    }
}
