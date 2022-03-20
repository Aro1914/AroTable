import AroTable from "./AroTable.js";
import genArray from "./../AroSort/genArray.js";

const array = new AroTable(genArray(1000, 1000));
console.log(array.getDistribution());
console.log(array.returnArray());
console.log(array.insert(5));
console.log(array.returnArray());
console.log(array.empty());
console.log(array.returnArray());
console.log(array.getDistribution());