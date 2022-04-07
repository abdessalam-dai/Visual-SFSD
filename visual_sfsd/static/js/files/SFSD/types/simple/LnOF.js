import ListFile from '../../structres/ListFile.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {ENREG_HIGHLIGHT_GREEN, MAX_NB_BLOCKS, MAX_NB_ENREGS_DEFAULT} from "../../../constants.js";


export default class LnOF extends ListFile {
    search(key, animate=false) {
        let i = this.headIndex;
        let iPrev;
        let j = 0;
        let readTimes = 0;
        let found = false;
        let currBlock;

        if (i === -1) { // when the first element is inserted
            return {
                found: false,
                pos: {
                    i: this.randomBlockIndex(),
                    j: 0
                },
                readTimes: 0
            }
        }

        while (i !== -1 && !found) {
            currBlock = this.blocks[i];
            readTimes++;
            j = 0;

            while (j < currBlock.nb && !found) {
                if (currBlock.enregs[j].key === key) {
                    found = true;
                } else {
                    j++;
                }
            }

            if (!found) {
                iPrev = i;
                i = currBlock.nextBlockIndex;
            }
        }

        if (i === -1) {
            i = iPrev;
        }

        return {
            found: found,
            pos: {
                i: i,
                j: j
            },
            readTimes: readTimes
        }
    }

    insert(key, field1, field2, removed = false, animate) {
        let searchResults = this.search(key, animate);

        let found = searchResults.found,
            i = searchResults.pos.i,
            j = searchResults.pos.j;

        let readTimes = searchResults.readTimes;
        let writeTimes = 0;

        let currBlock;

        if (found) {
            return false;
        } else {
            let newEnreg = new Enreg(key, field1, field2, removed); // create a new enreg.

            if (this.blocks[i] === null) {
                // create new block
                let address = this.setBlockAddress(i);
                this.blocks[i] = new Block([newEnreg], 1, address, -1);
                writeTimes++;
                this.nbBlocks++;

                this.headIndex = i;
                this.tailIndex = i;
                return true;
            }
            currBlock = this.blocks[i];
            readTimes++;

            if (currBlock.nb < MAX_NB_ENREGS_DEFAULT) { // if there is space in the block
                currBlock.nb++;
                currBlock.enregs[j] = newEnreg;
                this.blocks[i] = currBlock;
                writeTimes++;
            } else {
                let newIndex = this.randomBlockIndex();
                currBlock.nextBlockIndex = newIndex;
                this.blocks[i] = currBlock;
                writeTimes++;

                // create new block
                let address = this.setBlockAddress(newIndex);
                this.blocks[newIndex] = new Block([newEnreg], 1, address, -1);
                this.tailIndex = newIndex;
                writeTimes++;
                this.nbBlocks++;
            }

            this.nbInsertions++;
            return true;
        }
    }


    removeLogically(key , animate) {
        let {found , pos , readTimes} = this.search(key);
        let {i , j} = pos;
        console.log(found , pos)
        let writeTimes;
        if (found) {
            this.blocks[i].enregs[j].removed = true;
            writeTimes = 1;
            return true;
        }else {
            return false;
        }
    }

     editEnreg(key, field1, field2, removed = false, animate = false) {
        let {found, pos, readTimes} =  this.search(key, animate);
        let {i, j} = pos
        let writeTimes;
        let block;
        if (found) {
            block = this.blocks[i];
            block.enregs[j].field1 = field1;
            block.enregs[j].field2 = field2;
            block.enregs[j].removed = removed;
            writeTimes = 1;
            return true;
        } else {
            return false;
        }
    }

    removePhysically(key) {
        let {found , pos , readTimes} = this.search(key);
        let {i , j} = pos;

        let indexOfLastEnreg = this.blocks[this.tailIndex].nb - 1;
        let lastEnreg = this.blocks[this.tailIndex].enregs[indexOfLastEnreg];
        let blockBeforeTailBlock = this.blocks
            .filter((block) => block !== null)
            .filter((block) => block.nextBlockIndex === this.tailIndex)[0];


        console.log( blockBeforeTailBlock ,this.tailIndex , indexOfLastEnreg , lastEnreg)

        if (found) {
            // we replace the enreg to delete physically with the last enreg;
            this.blocks[i].enregs[j] = lastEnreg;

            // if we have the only one enreg in the headBlock so we delete it directly and set it to null
             if (indexOfLastEnreg === 0 && this.blocks[this.headIndex].nextBlockIndex === -1) {
                 this.blocks[this.headIndex] = null;
                 this.headIndex = -1;
                 this.tailIndex = -1;
                 return true;
             }

            // if the last enreg is the only enreg in the block
            if (indexOfLastEnreg === 0) {
                this.blocks[this.tailIndex] = null;
                blockBeforeTailBlock.nextBlockIndex  = -1;
                this.tailIndex = this.blocks.indexOf(blockBeforeTailBlock);
                this.nbBlocks--;
            } else {
                this.blocks[this.tailIndex].enregs.pop();
                this.blocks[this.tailIndex].nb--;
            }

            this.nbInsertions--;
            return true;
        }
        else {
            return false;
        }
    }

    // editEnreg(key, field1, field2, removed) {
    //     let {found, pos, readTimes} =  this.search(key);
    //     let {i, j} = pos;
    //     let writeTimes;
    //
    //     if (found) {
    //         let block = this.blocks[i];
    //         block.enregs[j].field1 = field1;
    //         block.enregs[j].field2 = field2;
    //         block.enregs[j].removed = removed;
    //         writeTimes = 1;
    //
    //         return true;
    //     } else {
    //         return false;
    //     }
    //
    // }

    // setBlockAddress(index) {
    //
    //     if (index === 0) {
    //         if (this.blocks.length === 0) {
    //             return Math.floor(Math.random() * 10000000000).toString(16);
    //         } else {
    //             return Number((ENREG_SIZE + 1) + parseInt(this.blocks[0].blockAddress, 16)).toString(16)
    //         }
    //     } else {
    //         return Number(index * ENREG_SIZE + parseInt(this.blocks[0].blockAddress, 16)).toString(16)
    //     }
    // }
}