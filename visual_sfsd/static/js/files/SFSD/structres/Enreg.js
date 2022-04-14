export default class Enreg {
    constructor(key, field1, field2, removed = false) {
       this.key = key;
       this.field1 = field1;
       this.field2 = field2;
       this.removed = removed;
    }
}