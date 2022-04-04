import File from '../../structres/File.js';
import Enreg from '../../structres/Enreg.js';
import Block from '../../structres/Block.js';
import {ENREG_SIZE} from "../../../constants.js";


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
            j = 0,
            readTimes = 0;
        let found = false;

        while (i < nbBlocks && !found) {
            let currBlock = this.blocks[i];
            readTimes++;
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
            },
            readTimes: readTimes
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

        // if the key does not exist

        let searchResults = this.search(key);
        let found = searchResults.found,
            i = searchResults.pos.i,
            j = searchResults.pos.j;


        if (!found) {
            let newEnreg = new Enreg(key, field1, field2, removed); // create a new enreg.
            this.nbInsertions += 1; // increment the number of insertion in the file

            //handle the case when it's the first time we create a block

            if (this.blocks.length === 0) {
                let address = this.setBlockAddress(0)
                let newBlock = new Block([newEnreg], 1 , address);
                this.blocks.push(newBlock)
            }
            else {
                let lastBlock = this.blocks[this.blocks.length - 1];
                // console.log(lastBlock.nb)
                if (lastBlock.enregs.length < this.maxNbEnregs) {
                    lastBlock.enregs.push(newEnreg);
                    lastBlock.nb++; // increment the number of nb = number of enreg
                } else {
                    // create a new block and append to it the new enreg.
                    let newBlock = new Block();
                    this.blocks.push(newBlock);
                    newBlock.enregs.push(newEnreg);
                    this.nbBlocks += 1;
                    newBlock.nb++; // increment the number of nb = number of enreg
                    newBlock.blockAddress = this.setBlockAddress(this.blocks.length - 1);
                }
            }
            // console.log(this.blocks)
            return true;
        }
        else {
            return false
        }
    }

    removeLogically(key) {
        let {found, pos, readTimes} =  this.search(key);
        let {i, j} = pos;
        let writeTimes;

        if (found) {
            this.blocks[i].enregs[j].removed = true;
            writeTimes = 1;
            return true;
        }
        else {
            return false;
        }
    }

     editEnreg(key, field1, field2, removed) {
        let {found, pos, readTimes} =  this.search(key);
        let {i, j} = pos;
        let writeTimes;

        if (found) {
            let block = this.blocks[i];
            block.enregs[j].field1 = field1;
            block.enregs[j].field2 = field2;
            block.enregs[j].removed = removed;
            writeTimes = 1;

            return true;
        } else {
            return false;
        }

    }

    setBlockAddress(index) {

        if (index === 0) {
            if (this.blocks.length === 0) {
                return Math.floor(Math.random() * 10000000000).toString(16);
            } else {
                return Number((ENREG_SIZE + 1) + parseInt(this.blocks[0].blockAddress, 16)).toString(16)
            }
        } else {
            return Number(index * ENREG_SIZE + parseInt(this.blocks[0].blockAddress, 16)).toString(16)
        }
    }
}
