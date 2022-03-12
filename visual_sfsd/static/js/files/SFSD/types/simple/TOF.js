import File from '../../structres/File.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {BLOCK_HEIGHT, BLOCK_WIDTH} from "../../../constants.js";


export default class TOF extends File {
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

        let blocks = this.blocks;
        let nbBlocks = this.blocks.length;

        let low = 0,
            high = nbBlocks - 1;

        let i = 0,
            j = 0;

        let found = false,
            stop = false;

        let traversedBlocks = [];
        let traversedEnregs = [];

        // global search for block
        while (low <= high && !found && !stop) {
            i = Math.floor((low + high) / 2);
            let midBlock = blocks[i];
            let midBlockNb = midBlock.enregs.length;

            traversedBlocks.push(i);

            let firstKey = midBlock.enregs[0].key,
                lastKey = midBlock.enregs[midBlockNb - 1].key;

            // local search for enreg. inside block
            if (key >= firstKey && key <= lastKey) {
                let eLow = 0,
                    eHigh = midBlock.enregs.length - 1;

                while (eLow <= eHigh && !found) {
                    j = Math.floor((eLow + eHigh) / 2);
                    let currKey = midBlock.enregs[j].key;

                    traversedEnregs.push(j);

                    if (key === currKey) {
                        found = true;
                    } else if (key < currKey) {
                        eHigh = j - 1;
                    } else {
                        eLow = j + 1;
                    }
                }

                if (eLow > eHigh) {
                    j = eLow;
                }
                stop = true;
            } else if (key < firstKey) {
                high = i - 1;
            } else {  // key > lastKey
                low = i + 1;
            }
        }

        if (low > high) {
            if (high === -1) {
                i = 0;
                j = 0;
            } else {
                i = low - 1;
                j = blocks[i].enregs.length;

                if (j >= this.maxNbEnregs) {
                    i += 1;
                    j = 0;
                }
            }
        }

        return {
            found: found,
            pos: {
                i: i,
                j: j
            },
            traversedBlocks: traversedBlocks,
            traversedEnregs: traversedEnregs
        }
    }

    insert(key, field1, field2, removed = false) {
        /*
            input :
                    key :       [Int]
                    field1 :    [String]
                    field2 :    [String]
                    removed     [Boolean]
            output :
                    [Boolean] ==> if enreg. is inserted return true, else false (if key already exits !)
        */

        // search if key already exists in the file
        let searchResults = this.search(key);

        let found = searchResults.found,
            i = searchResults.pos.i,
            j = searchResults.pos.j;

        if (!found) {
            let newEnreg = new Enreg(key, field1, field2, removed);

            if (this.blocks.length === 0) {

                let enregs = [newEnreg];
                let newBlock = new Block(enregs, 1);
                this.blocks.push(newBlock);
                this.nbBlocks += 1;

            } else {

                let continueShifting = true;
                let currBlock, lastIndex, lastEnreg, k;

                while (continueShifting && i < this.blocks.length) {
                    currBlock = this.blocks[i];  // read current block

                    lastIndex = currBlock.nb - 1;
                    lastEnreg = currBlock.enregs[lastIndex]; // save last enreg.

                    k = lastIndex;

                    while (k > j) {
                        currBlock.enregs[k] = currBlock.enregs[k - 1];
                        k -= 1;
                    }

                    // insert the enreg. at position j
                    currBlock.enregs[j] = newEnreg;

                    if (j === currBlock.nb) {
                        continueShifting = false;
                        currBlock.nb += 1;
                    } else {
                        if (currBlock.nb < this.maxNbEnregs) {
                            // if the current block is not full, then insert the last enreg. at the end
                            currBlock.nb += 1;
                            currBlock.enregs[currBlock.nb - 1] = lastEnreg;
                            this.blocks[i] = currBlock;  // save current block in the blocks array
                            continueShifting = false;
                        } else { // else, insert it in the next block (i + 1)
                            this.blocks[i] = currBlock;  // save current block in the blocks array
                            i += 1;
                            j = 0;
                            newEnreg = lastEnreg;
                        }
                    }

                }

                if (i > this.nbBlocks - 1) {
                    let enregs = [newEnreg];
                    let newBlock = new Block(enregs, 1);
                    this.blocks.push(newBlock);
                    this.nbBlocks += 1;
                }
            }

            this.nbInsertions += 1;

            return true;
        } else {
            return false;
        }
    }

    removeLogically(key) {
        /*
           input :
                    key :    key to remove [Int]
           output :
                    true :   if the process of deletion went correctly 
                    false :  if the key does not exist
       */
        let searchResults = this.search(key);
        let i = searchResults.pos.i;
        let j = searchResults.pos.j;

        if (searchResults.found) {
            this.blocks[i].enregs[j].removed = true;
            return true;
        } else {
            return false;
        }
    }
}
