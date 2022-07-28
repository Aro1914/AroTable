/**
 *   Description: A self-sorting number data structure.
 * 
 *   Copyright 2022 Emmanuel Agbavwe to Present.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/**
 * A self-sorting number data structure
 */
export default class AroTable {
    #pos = {};
    #neg = {};
    #negLength = 0;
    #posLength = 0;
    #array = [];
    #shouldArrange = false;
    /**
     * Creates an AroTable. Works like an overloaded constructor, it could take no arguments, or it could take a single number or multiple numbers could be passed, or an array, or better still a combination of both.
     * @param number A value that can be converted to a valid number
     * @param numbers Values that can be converted to valid numbers. They could be multiple numbers, an array, nested arrays, or a combination of both.
     */
    constructor (number = null, ...numbers) {
        this.add(number, ...numbers);
    }

    // A utility method that implements the MergeSort sorting algorithm
    #mergeSort (array) {
        if (array.length <= 1) return array;

        const middle_index = Math.floor(array.length / 2),
            left_values = this.#mergeSort(array.slice(0, middle_index)),
            right_values = this.#mergeSort(array.slice(middle_index)),
            left_length = left_values.length,
            right_length = right_values.length;

        let left_index = 0,
            right_index = 0,
            sorted_values = [];

        while (left_index < left_length && right_index < right_length)
            Number(left_values[left_index]) < Number(right_values[right_index]) ?
                (sorted_values.push(Number(left_values[left_index])),
                    left_index++)
                :
                (sorted_values.push(Number(right_values[right_index])),
                    right_index++);

        sorted_values = sorted_values.concat(left_values.slice(left_index)),
            sorted_values = sorted_values.concat(right_values.slice(right_index));

        return sorted_values;
    };

    // A utility method that implements aggressive approximation to 3 decimal places
    #trimNum (el) {
        let strDp = String(+(Math.round(el % 1 + 'e+3') + 'e-3'));
        el > 0 ?
            (strDp.length > 5) &&
            ((strDp[4] === strDp[5]) ?
                strDp = strDp.substring(0, 5)
                :
                (strDp[5] > 4) &&
                (strDp[4] = strDp[4] + 1),
                strDp = strDp.substring(0, 5)) :
            (strDp.length > 6) &&
            ((strDp[5] === strDp[6]) ?
                strDp = strDp.substring(0, 6)
                :
                (strDp[6] > 4) &&
                (strDp[5] = strDp[5] + 1),
                strDp = strDp.substring(0, 6));
        let str = String((el - (el % 1)) + Number(strDp.substring(0, el < 0 ? 2 : 1)));
        str += el > 0 ? strDp.substring(1, 5) : strDp.substring(2, 6);
        return el < 0 && (el - (el % 1)) == 0 ? Number(str) * -1 : Number(str);
    }

    // A utility method that splits the number argument into the whole number part and its decimal part rounded up to 3 decimal places
    #returnParts (el) {
        const dp = this.#trimNum(el % 1);
        return dp == 1 ? [this.#trimNum((el - (el % 1)) + (el > 0 ? dp : dp * -1)), 0] : [this.#trimNum((el) - (el % 1)), dp];
    }

    // A utility method used to split the user's number input into its whole number part and its exact decimal part untouched, with no approximation applied
    #returnInputParts (number) {
        return [number - (number % 1), number % 1 != 0 ? Number(`${number < 0 ? '-0' : '0'}.` + String(number).split('.')[1]) : (number % 1)];
    }

    // A utility method that arranges numbers into the array representation with the values in the AroTable that have a valid occurrence. At the same it manages the logging of the initial occurrence and occurrence count of individual numbers in the AroTable in the array to be returned upon a search for a number with a valid occurrence
    #arrange () {
        let index = 0;
        this.#array = [];
        if (this.#negLength) {
            const neg = Object.keys(this.#neg), len = neg.length;
            let n = len - 1;
            for (n; n >= 0; n--) {
                const numValue = neg[n];
                if (isNaN(numValue)) continue;
                const num = Number(numValue) * -1;
                this.#neg[numValue][0] = index;

                if (this.#neg[numValue][2] > 1) {
                    const keys = this.#mergeSort(Object.keys(this.#neg[numValue][1]));
                    let x = 0, l = keys.length;

                    for (x; x < l; x++) {
                        const oc = this.#neg[numValue][1][String(keys[x])][1];
                        this.#neg[numValue][1][String(keys[x])][0] = index;
                        let i = oc;

                        for (i; i > 0; i--)
                            this.#array[index] = this.#trimNum(num + Number(keys[x])),
                                index++;
                    }
                }
                else if (this.#neg[numValue][2] == 1) {
                    const key = (() => {
                        const neg = Object.keys(this.#neg[numValue][1]), len = neg.length;
                        let n = len - 1;
                        for (n; n >= 0; n--)
                            if (this.#neg[numValue][1][neg[n]][1] == 1)
                                return Number(neg[n]);
                    })();

                    this.#neg[numValue][1][String(key)][0] = index,
                        this.#array[index] = this.#trimNum(num + key),
                        index++;
                }
                else continue;
            }
        }


        if (this.#posLength) {
            const pos = Object.keys(this.#pos), len = pos.length;
            let p = 0;
            for (p; p < len; p++) {
                const numValue = pos[p];
                if (isNaN(numValue)) continue;
                const num = Number(numValue);
                this.#pos[numValue][0] = index;

                if (this.#pos[numValue][2] > 1) {
                    const keys = this.#mergeSort(Object.keys(this.#pos[numValue][1])), keysLength = keys.length;
                    let x = 0;

                    for (x; x < keysLength; x++) {
                        const oc = this.#pos[numValue][1][String(keys[x])][1];
                        this.#pos[numValue][1][String(keys[x])][0] = index;
                        let i = 0;

                        for (i; i < oc; i++)
                            this.#array[index] = this.#trimNum(num + Number(keys[x])),
                                index++;
                    }
                }
                else if (this.#pos[numValue][2] == 1) {
                    const key = (() => {
                        const pos = Object.keys(this.#pos[numValue][1]), len = pos.length;
                        let p = len - 1;
                        for (p; p >= 0; p--)
                            if (this.#pos[numValue][1][pos[p]][1] == 1)
                                return Number(pos[p]);
                    })();

                    this.#pos[numValue][1][String(key)][0] = index,
                        this.#array[index] = this.#trimNum(num + key),
                        index++;
                }
                else continue;
            }
        }
    };

    // A utility method that inserts a single number into the AroTable
    #insert (number) {
        if (!number && number !== 0 ||
            isNaN(number) ||
            number === '') return false;
        number = Number(number);
        const [whole, dp] = this.#returnParts(number);
        if (number < 0) {
            const nWhole = whole * -1;
            if (!this.#neg[nWhole])
                this.#neg[nWhole] = [null, {}, 1],
                    this.#neg[nWhole][1][dp] = [null, 1];
            else
                this.#neg[nWhole][1][dp] ? this.#neg[nWhole][1][dp][1]++ : this.#neg[nWhole][1][dp] = [null, 1],
                    this.#neg[nWhole][2]++;
            this.#negLength++;
        } else {
            if (!this.#pos[whole])
                this.#pos[whole] = [null, {}, 1],
                    this.#pos[whole][1][dp] = [null, 1];
            else
                this.#pos[whole][1][dp] ? this.#pos[whole][1][dp][1]++ : this.#pos[whole][1][dp] = [null, 1],
                    this.#pos[whole][2]++;
            this.#posLength++;
        }
        return;
    }

    // A utility method that inserts numbers from an array into the AroTable
    #insertArray (numbers) {
        if (numbers == null ||
            numbers == undefined ||
            !numbers.length ||
            !Array.isArray(numbers)) return false;
        const numLength = numbers.length;
        let index = 0;
        for (index; index < numLength; index++) {
            let element = numbers[index];
            Array.isArray(element) ?
                this.#insertArray(element) :
                this.#insert(element);
        }
        return;
    }

    // A utility method that implements the removal of a single occurrence of a number from the AroTable
    #enforceRemove (number = null, ...numbers) {
        if (numbers) {
            const numLength = numbers.length;
            let i = 0;
            for (i; i < numLength; i++)
                this.#enforceRemove(numbers[i]);
        }
        if (Array.isArray(number)) {
            const numLength = numbers.length;
            let i = 0;
            for (i; i < numLength; i++)
                this.#enforceRemove(number[i]);
        }
        else if (this.search(number)) {
            const [whole, dp] = this.#returnParts(number);
            if (Number(number) < 0)
                this.#neg[Number(whole * -1)][2]--,
                    this.#neg[Number(whole * -1)][1][dp][1]--,
                    this.#negLength--;
            else
                this.#pos[Number(whole)][2]--,
                    this.#pos[Number(whole)][1][dp][1]--,
                    this.#posLength--;
            this.#shouldArrange = true;
        }
        return;
    }

    // A utility method that implements the complete removal of all occurrences of a number from the AroTable
    #enforceRemoveAll (number = null, ...numbers) {
        if (numbers) {
            const numLength = numbers.length;
            let i = 0;
            for (i; i < numLength; i++)
                this.#enforceRemoveAll(numbers[i]);
        }
        if (Array.isArray(number)) {
            const numLength = numbers.length;
            let i = 0;
            for (i; i < numLength; i++)
                this.#enforceRemoveAll(number[i]);
        }
        else if (this.search(number)) {
            number = Number(number);
            const [whole, dp] = this.#returnParts(number);
            if (number < 0) {
                const oc = this.#neg[Number(whole * -1)][1][dp][1];
                this.#neg[Number(whole * -1)][1][dp][1] = 0,
                    this.#neg[Number(whole * -1)][2] -= oc,
                    this.#negLength -= oc;
            }
            else {
                const oc = this.#pos[Number(whole)][1][dp][1];
                this.#pos[Number(whole)][1][dp][1] = 0,
                    this.#pos[Number(whole)][2] -= oc,
                    this.#posLength -= oc;
            }
            this.#shouldArrange = true;
        }
        return;
    }

    /**
     * Adds the given arguments to the AroTable.
     * @param number A value that can be converted to a valid number
     * @param numbers Values that can be converted to valid numbers. They could be in an array, nested arrays, or a combination of both.
     * @returns True if successful, returns false if not.
     */
    add (number = null, ...numbers) {
        const previousLength = this.#negLength + this.#posLength;
        numbers &&
            this.#insertArray(numbers);
        Array.isArray(number) ?
            this.#insertArray(number) : number && this.#insert(number);
        this.#arrange();
        return previousLength != this.#negLength + this.#posLength;
    }

    /**
     * Searches for an occurrence of the given value in the AroTable.
     * @param number A value that can be converted to a valid number
     * @returns {Array<Number>} An array with two values, the first is the first index the number occurred in the AroTable, and the second shows how many times it occurred. If no occurrence is found, returns false.
     */
    search (number) {
        if (number == null ||
            number == undefined ||
            isNaN(number)) return false;
        const [whole, dp] = this.#returnInputParts(number);

        const searchOut = (obj, whole, dp, isNegative) => {
            if (isNegative) whole = whole * -1;
            if (obj[whole]?.[2]) {
                if (obj[whole][1]?.[dp])
                    if (obj[whole][1][dp][1])
                        return obj[whole][1][dp];
            }
            return false;
        };
        return Number(number) < 0 ? searchOut(this.#neg, whole, dp, Number(number) < 0) : searchOut(this.#pos, whole, dp, Number(number) < 0);
    }

    /**
     * Deletes the an occurrence of the given argument(s) from the AroTable.
     * @param number A value that can be converted to a valid number
     * @param numbers Values that can be converted to valid numbers. They could be in an array, nested arrays, or a combination of both.
     * @returns True if successful, returns false if not.
     */
    remove (number = null, ...numbers) {
        const previousLength = this.#negLength + this.#posLength;
        this.#enforceRemove(number, ...numbers);
        this.#shouldArrange && (this.#arrange(), this.#shouldArrange = false);
        return previousLength != this.#negLength + this.#posLength;
    }

    /**
     * Deletes all occurrences of the given argument(s) from the AroTable.
     * @param number A value that can be converted to a valid number
     * @param numbers Values that can be converted to valid numbers. They could be in an array, nested arrays, or a combination of both.
     * @returns True if successful, returns false if not.
     */
    removeAll (number = null, ...numbers) {
        const previousLength = this.#negLength + this.#posLength;
        this.#enforceRemoveAll(number, ...numbers);
        this.#shouldArrange && (this.#arrange(), this.#shouldArrange = true);
        return previousLength != this.#negLength + this.#posLength;
    }

    /**
     * Removes all occurrences of any value in the AroTable that meets the condition specified in a callback function.
     * @param {Function} qualifier A function that takes the desired value to be evaluated. The dropAny method calls the qualifier function once for each number in the AroTable. 
     * @returns True if successful, returns false if not.
     */
    dropAny (qualifier) {
        const previousLength = this.#negLength + this.#posLength;

        const neg = Object.keys(this.#neg), nLen = neg.length;
        let n = nLen - 1;
        for (n; n >= 0; n--) {
            const numValue = neg[n];
            if (this.#neg[numValue][2]) {
                const negObj = this.#mergeSort(Object.keys(this.#neg[numValue][1])), lenObj = negObj.length;
                let nObj = lenObj - 1;
                for (nObj; nObj >= 0; nObj--) {
                    const dp = negObj[nObj];
                    const num = this.#trimNum((Number(numValue) - Number(dp))) * -1;
                    if (this.#neg[numValue][1][dp][1] && qualifier(num))
                        this.#enforceRemoveAll(num);
                }
            }
        }

        const pos = Object.keys(this.#pos), pLen = pos.length;
        let p = 0;
        for (p; p < pLen; p++) {
            const numValue = pos[p];
            if (this.#pos[numValue][2]) {
                const posObj = this.#mergeSort(Object.keys(this.#pos[numValue][1])), lenObj = posObj.length;
                let pObj = 0;
                for (pObj; pObj < lenObj; pObj++) {
                    const dp = posObj[pObj];
                    const num = this.#trimNum((Number(numValue) + Number(dp)));
                    if (this.#pos[numValue][1][dp][1] && qualifier(num))
                        this.#enforceRemoveAll(num);
                }
            }
        }

        this.#shouldArrange && (this.#arrange(), this.#shouldArrange = true);
        return previousLength != this.#negLength + this.#posLength;
    }

    /**
     * Returns any value in the AroTable that meets the condition specified in a callback function.
     * @param {Function} qualifier A function that takes the desired value to be evaluated. The returnAny method calls the qualifier function once for each number in the AroTable. 
     * @returns An array containing the number(s) that meet the condition, returns false if none could be found that fulfills the condition.
     */
    returnAny (qualifier) {
        const returnArray = [];
        let index = 0;
        const neg = Object.keys(this.#neg), nLen = neg.length;
        let n = nLen - 1;
        for (n; n >= 0; n--) {
            const numValue = neg[n];
            if (this.#neg[numValue][2]) {
                const negObj = this.#mergeSort(Object.keys(this.#neg[numValue][1])), lenObj = negObj.length;
                let nObj = lenObj - 1;
                for (nObj; nObj >= 0; nObj--) {
                    const dp = negObj[nObj];
                    const num = this.#trimNum((Number(numValue) - Number(dp))) * -1;
                    if (this.#neg[numValue][1][dp][1] && qualifier(num))
                        returnArray[index] = num, index++;
                }
            }
        }


        const pos = Object.keys(this.#pos), pLen = pos.length;
        let p = 0;
        for (p; p < pLen; p++) {
            const numValue = pos[p];
            if (this.#pos[numValue][2]) {
                const posObj = this.#mergeSort(Object.keys(this.#pos[numValue][1])), lenObj = posObj.length;
                let pObj = 0;
                for (pObj; pObj < lenObj; pObj++) {
                    const dp = posObj[pObj];
                    const num = this.#trimNum((Number(numValue) + Number(dp)));
                    if (this.#pos[numValue][1][dp][1] && qualifier(num))
                        returnArray[index] = num, index++;
                }
            }
        }
        return index != 0 ? returnArray : false;
    }

    /**
     * @returns True if the AroTable is empty, returns false if not.
     */
    isEmpty () {
        return this.#negLength == 0 && this.#posLength == 0;
    }


    /**
     * Wipes the AroTable clean.
     */
    empty () {
        this.#array = [],
            this.#pos = {},
            this.#neg = {},
            this.#negLength = 0,
            this.#posLength = 0;
    }

    /**
     * Removes all positive numbers from the AroTable.
     * @returns True if successful, returns false if not.
     */
    dropPositives () {
        const previousLength = this.#negLength + this.#posLength;
        this.#pos = {},
            this.#posLength = 0,
            this.#arrange();
        return previousLength != this.#negLength + this.#posLength;
    }

    /**
     * Removes all negative numbers from the AroTable. 
     * @returns True if successful, returns false if not.
     */
    dropNegatives () {
        const previousLength = this.#negLength + this.#posLength;
        this.#neg = {},
            this.#negLength = 0,
            this.#arrange();
        return previousLength != this.#negLength + this.#posLength;
    }

    /**
     * Removes all numbers with a single occurrence from the AroTable. 
     * @returns True if successful, returns false if not.
     */
    dropUnits () {
        const previousLength = this.#negLength + this.#posLength;

        const dropIn = (obj, forNegatives = true) => {
            const keys = Object.keys(obj), len = keys.length;
            let i = len - 1;
            for (i; i >= 0; i--) {
                const intCount = keys[i];
                if (obj[intCount][2]) {
                    const dpKeys = Object.keys(obj[intCount][1]), dpKeysLength = dpKeys.length;
                    let x = dpKeysLength - 1;
                    for (x; x >= 0; x--) {
                        const dp = dpKeys[x];
                        if (obj[intCount][1][dp][1] == 1)
                            obj[intCount][1][dp][1] = 0,
                                obj[intCount][2]--,
                                forNegatives ? this.#negLength-- : this.#posLength--;
                    }
                }
            }
        };

        dropIn(this.#neg);
        dropIn(this.#pos, false);

        this.#arrange();
        return previousLength != this.#negLength + this.#posLength;
    }

    /**
     * Removes all numbers with multiple occurrences from the AroTable. 
     * @returns True if successful, returns false if not.
     */
    dropDuplicates () {
        const previousLength = this.#negLength + this.#posLength;

        const dropIn = (obj, forNegatives = true) => {
            const keys = Object.keys(obj), len = keys.length;
            let i = len - 1;
            for (i; i >= 0; i--) {
                const intCount = keys[i];
                if (obj[intCount][2] > 1) {
                    const dpKeys = Object.keys(obj[intCount][1]), dpKeysLength = dpKeys.length;
                    let x = dpKeysLength - 1;
                    for (x; x >= 0; x--) {
                        const dp = dpKeys[x];
                        if (obj[intCount][1][dp][1] > 1)
                            obj[intCount][2] -= obj[intCount][1][dp][1],
                                forNegatives ? this.#negLength -= obj[intCount][1][dp][1] : this.#posLength -= obj[intCount][1][dp][1],
                                obj[intCount][1][dp][1] = 0;
                    }
                }
            }
        };

        dropIn(this.#neg);
        dropIn(this.#pos, false);

        this.#arrange();
        return previousLength != this.#negLength + this.#posLength;
    }

    /**
     * Removes all duplicated occurrences from the AroTable, leaving a single occurrence. 
     * @returns True if successful, returns false if not.
     */
    clearDuplicates () {
        const previousLength = this.#negLength + this.#posLength;

        const clearIn = (obj, forNegatives = true) => {
            const keys = Object.keys(obj), len = keys.length;
            let i = len - 1;
            for (i; i >= 0; i--) {
                const intCount = keys[i];
                if (obj[intCount][2] > 1) {
                    const dpKeys = Object.keys(obj[intCount][1]), dpKeysLength = dpKeys.length;
                    let x = dpKeysLength - 1;
                    for (x; x >= 0; x--) {
                        const dp = dpKeys[x];
                        if (obj[intCount][1][dp][1] > 0)
                            obj[intCount][2] -= (obj[intCount][1][dp][1] - 1),
                                forNegatives ? this.#negLength -= (obj[intCount][1][dp][1] - 1) : this.#posLength -= (obj[intCount][1][dp][1] - 1),
                                obj[intCount][1][dp][1] = 1;
                    }
                }
            }
        };

        clearIn(this.#neg);
        clearIn(this.#pos, false);

        this.#arrange();
        return previousLength != this.#negLength + this.#posLength;
    }


    /**
     * @returns {Array<Number>} A sorted array of all numbers with duplicated occurrences in the AroTable, if none exists, returns false.
     */
    returnDuplicates () {
        const duplicates = [];
        let index = 0;

        const neg = Object.keys(this.#neg), nLen = neg.length;
        let n = nLen - 1;
        for (n; n >= 0; n--) {
            const intCount = neg[n];
            if (this.#neg[intCount][2] > 1) {
                const negObj = this.#mergeSort(Object.keys(this.#neg[intCount][1])), lenObj = negObj.length;
                let nObj = 0;
                for (nObj; nObj < lenObj; nObj++) {
                    const dp = negObj[nObj];
                    if (this.#neg[intCount][1][dp][1] > 1)
                        duplicates[index] = this.#trimNum((Number(intCount) * -1) + Number(dp)),
                            index++;
                }
            }
        }

        const pos = Object.keys(this.#pos), pLen = pos.length;
        let p = 0;
        for (p; p < pLen; p++) {
            const intCount = pos[p];
            if (this.#pos[intCount][2] > 1) {
                const posObj = this.#mergeSort(Object.keys(this.#pos[intCount][1])), lenObj = posObj.length;
                let pObj = 0;
                for (pObj; pObj < lenObj; pObj++) {
                    const dp = posObj[pObj];
                    if (this.#pos[intCount][1][dp][1] > 1)
                        duplicates[index] = this.#trimNum(Number(intCount) + Number(dp)),
                            index++;
                }
            }
        }

        return duplicates.length > 0 ? duplicates : false;
    }

    /**
     * @returns {Array<Number>} A sorted array of all numbers with a single occurrence in the AroTable, if none exists, returns false.
     */
    returnUnits () {
        const units = [];
        let index = 0;

        const neg = Object.keys(this.#neg), nLen = neg.length;
        let n = nLen - 1;
        for (n; n >= 0; n--) {
            const intCount = neg[n];
            if (this.#neg[intCount][2]) {
                const negObj = this.#mergeSort(Object.keys(this.#neg[intCount][1])), lenObj = negObj.length;
                let nObj = 0;
                for (nObj; nObj < lenObj; nObj++) {
                    const dp = negObj[nObj];
                    if (this.#neg[intCount][1][dp][1] == 1)
                        units[index] = this.#trimNum((Number(intCount) * -1) + Number(dp)),
                            index++;
                }
            }
        }

        const pos = Object.keys(this.#pos), pLen = pos.length;
        let p = 0;
        for (p; p < pLen; p++) {
            const intCount = pos[p];
            if (this.#pos[intCount][2]) {
                const posObj = this.#mergeSort(Object.keys(this.#pos[intCount][1])), lenObj = posObj.length;
                let pObj = 0;
                for (pObj; pObj < lenObj; pObj++) {
                    const dp = posObj[pObj];
                    if (this.#pos[intCount][1][dp][1] == 1)
                        units[index] = this.#trimNum(Number(intCount) + Number(dp)),
                            index++;
                }
            }
        }

        return units.length > 0 ? units : false;
    }

    /**
     * @returns {Array<Number>} A sorted array of all negative numbers in the AroTable, if none exists, returns false.
     */
    returnNegatives () {
        const negatives = [];
        let index = 0;

        const neg = Object.keys(this.#neg), nLen = neg.length;
        let n = nLen - 1;
        for (n; n >= 0; n--) {
            const intCount = neg[n];
            if (this.#neg[intCount][2]) {
                const negObj = this.#mergeSort(Object.keys(this.#neg[intCount][1])), lenObj = negObj.length;
                let nObj = 0;
                for (nObj; nObj < lenObj; nObj++) {
                    const dp = negObj[nObj];
                    if (this.#neg[intCount][1][dp][1] != 0)
                        negatives[index] = this.#trimNum((Number(intCount) * -1) + Number(dp)),
                            index++;
                }
            }
        }

        return negatives.length > 0 ? negatives : false;
    }

    /**
     * @returns {Array<Number>} A sorted array of all positive numbers in the AroTable, if none exists returns false.
     */
    returnPositives () {
        const positives = [];
        let index = 0;

        const pos = Object.keys(this.#pos), pLen = pos.length;
        let p = 0;
        for (p; p < pLen; p++) {
            const intCount = pos[p];
            if (this.#pos[intCount][2]) {
                const posObj = this.#mergeSort(Object.keys(this.#pos[intCount][1])), lenObj = posObj.length;
                let pObj = 0;
                for (pObj; pObj < lenObj; pObj++) {
                    const dp = posObj[pObj];
                    if (this.#pos[intCount][1][dp][1] != 0)
                        positives[index] = this.#trimNum(Number(intCount) + Number(dp)),
                            index++;
                }
            }
        }

        return positives.length > 0 ? positives : false;
    }

    /**
     * @returns {Array<Number>} An array representation of the AroTable.
     */
    returnArray () {
        return this.#array;
    }

    /**
     * @returns {Number} The amount of numbers held in the AroTable.
     */
    size () {
        return this.#negLength + this.#posLength;
    }

    /**
     * @returns An object showing the distribution of numbers in the AroTable.
     */
    getDistribution () {
        return {
            'Positive Numbers': Number(this.#posLength),
            'Negative Numbers': Number(this.#negLength)
        };
    }
}
