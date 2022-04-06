import File from '../../structres/File.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {ENREG_SIZE, LnOF_INFO, MAX_NB_BLOCKS, MAX_NB_ENREGS_DEFAULT} from "../../../constants.js";


export default class LnOF extends File {

    init() {
        while (this.blocks.length < MAX_NB_BLOCKS) {
            let  newBlock = new Block();
            this.blocks.push(newBlock)
            // console.log()
        }
    }


    randomBlockIndex(blocks) {
        let randomBlockIndex = Math.floor(Math.random() * MAX_NB_BLOCKS);
        // if all block are not available so we reached the max block in the file

        if(blocks.every((block) => block.isAvalaible === false)) return -1;

        while (blocks[randomBlockIndex].isAvalaible === false) {
            randomBlockIndex = Math.floor(Math.random() * MAX_NB_BLOCKS);
        }
        return randomBlockIndex;
    }

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
        let j = 0;
        let readTimes = 0;
        let found = false;
        let currentBlock = LnOF_INFO.head_block;


        while (((currentBlock.nextBlockIndex !== -1) && !found)) {

            readTimes++;
            j = 0;
            // console.log(currentBlock)
            while (j < currentBlock.nb && !found) {
                if (key === currentBlock.enregs[j].key) {
                    found = true;
                    break;
                } else {
                    j++;
                }
            }
            if (!found) {
                currentBlock = this.blocks[currentBlock.nextBlockIndex];
            }
        }
        // console.log(currentBlock)
        let i = this.blocks.indexOf(currentBlock);
        // console.log(`block ${i}`);
        // console.log(`enreg pos ${j}`)
        // console.log(this.blocks)

        return {
            found: found,
            pos:{
                i: i,
                j:j
            },
            readTimes: readTimes
        }
    }

    insert(key, field1, field2, removed = false) {
            console.log(LnOF_INFO.head_block , LnOF_INFO.tail_block)
            if (LnOF_INFO.head_block === -1) {
                console.log('the first insertion ever')
                let randomIndex = this.randomBlockIndex(this.blocks);
                let newEnreg = new Enreg(key , field1 , field2);
                this.nbInsertions++;
                // console.log(this.blocks[randomIndex])
                this.blocks[randomIndex].enregs.push(newEnreg);
                this.blocks[randomIndex].isAvalaible = false;
                this.blocks[randomIndex].theHeadBlock = true;
                this.blocks[randomIndex].nb++;
                LnOF_INFO.head_block = this.blocks[randomIndex];
                console.log(LnOF_INFO.head_block)
                LnOF_INFO.tail_block = this.blocks[randomIndex];
                console.log(LnOF_INFO.tail_block)
                // console.log(this.blocks[randomIndex].nextBlockIndex);
            }
            // if we already have the lnof.head != -1
            else {
                // we check if the key exists or not
                let searchResult = this.search(key);
                let {found , pos} = searchResult;
                let {i , j} = pos
                if (!found) {
                    // we loop till the tail block and ensert there the new Enreg
                    let newEnreg = new Enreg(key , field1 , field2)
                    this.nbInsertions += 1; // increment the number of insertion in the file
                    let tailBlock = this.blocks[i]
                    // if there is still enough space in the tailBlock
                    if (tailBlock.enregs.length < MAX_NB_ENREGS_DEFAULT){
                        tailBlock.enregs.push(newEnreg);
                        tailBlock.nb++;
                        // console.log(tailBlock.nb)
                    }
                    else { // we create a new block that will become the tailBlock
                        let randomIndex = this.randomBlockIndex(this.blocks);
                        if (randomIndex !== -1) {
                            // we update the tailBlock.nextBlockIndex to hold the block we will create
                            tailBlock.nextBlockIndex = randomIndex;
                            LnOF_INFO.tail_block = this.blocks[randomIndex]
                            this.blocks[randomIndex].enregs.push(newEnreg);
                            this.blocks[randomIndex].nb++;

                        }

                    }
                }
            }
    }


    // removeLogically(key) {
    //     let {found, pos, readTimes} =  this.search(key);
    //     let {i, j} = pos;
    //     let writeTimes;
    //
    //     if (found) {
    //         this.blocks[i].enregs[j].removed = true;
    //         writeTimes = 1;
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    // removePhysically(key) {
    //     let {found , pos , readTimes} = this.search(key);
    //     let {i , j} = pos;
    //     let indexOfLastEnreg = this.blocks[this.blocks.length - 1].nb -1;
    //     let lastEnreg = this.blocks[this.blocks.length - 1].enregs[indexOfLastEnreg]
    //     if (found) {
    //         // we replace the enreg to delete physically with the last enreg;
    //         this.blocks[i].enregs[j] = lastEnreg;
    //
    //         // if the last enreg is the only enreg in the block
    //         if (indexOfLastEnreg === 0) {
    //             this.blocks[this.blocks.length - 1].enregs.pop(); // in reality just an extra instruction
    //             this.blocks.pop();
    //             this.nbBlocks--;
    //         } else {
    //             this.blocks[this.blocks.length - 1].enregs.pop();
    //             this.blocks[this.blocks.length - 1].nb--;
    //         }
    //
    //         this.nbInsertions--;
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

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