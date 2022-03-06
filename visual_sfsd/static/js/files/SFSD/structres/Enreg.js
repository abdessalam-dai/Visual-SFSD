export default class Enreg {
    constructor(key, data, removed = false) {
        /*
            key :       [Int]
            data :      [Object]
            removed :   [Boolean]
        */
       this.key = key;
       this.data = data;
       this.removed = removed;
    }
}