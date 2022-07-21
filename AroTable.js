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

    #returnParts (el) {
        const dp = this.#trimNum(el % 1);
        return dp == 1 ? [this.#trimNum((el - (el % 1)) + (el > 0 ? dp : dp * -1)), 0] : [this.#trimNum(this.#trimNum(el) - dp), dp];
    }

    #returnInputParts (number) {
        return [number - (number % 1), number % 1 != 0 ? Number(`${number < 0 ? '-0' : '0'}.` + String(number).split('.')[1]) : (number % 1)];
    }

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
                    let x = keys.length - 1;

                    for (x; x >= 0; x--) {
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
                        for (const x in this.#neg[numValue][1])
                            if (this.#neg[numValue][1][x][1] == 1)
                                return Number(x);
                    })();

                    this.#neg[numValue][1][String(key)][0] = index,
                        this.#array[index] = this.#trimNum(num + key),
                        index++;
                }
                else continue;
            }
        }



        const pos = Object.keys(this.#pos), len = pos.length;
        if (len) {
            let p = 0;
            for (p; p < len; p++) {
                const numValue = pos[p];
                if (isNaN(numValue)) continue;
                const num = Number(numValue);
                this.#pos[numValue][0] = index;

                if (this.#pos[numValue][2] > 1) {
                    const keys = this.#mergeSort(Object.keys(this.#pos[numValue][1]));
                    let x = 0;

                    for (x; x < keys.length; x++) {
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
                        for (const x in this.#pos[numValue][1])
                            if (this.#pos[numValue][1][x][1] == 1)
                                return Number(x);
                    })();

                    this.#pos[numValue][1][String(key)][0] = index,
                        this.#array[index] = this.#trimNum(num + key),
                        index++;
                }
                else continue;
            }
        }
    };

    #insert (number) {
        if (!number && number !== 0 ||
            isNaN(number) ||
            number === '') return false;
        number = Number(number);
        const [whole, dp] = this.#returnParts(number);
        if (number < 0) {
            const nWhole = whole * -1;
            console.log(nWhole);
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

    #insertArray (numbers) {
        if (numbers == null ||
            numbers == undefined ||
            !numbers.length ||
            !Array.isArray(numbers)) return false;
        let index = 0;
        for (index; index < numbers.length; index++) {
            let element = numbers[index];
            Array.isArray(element) ?
                this.#insertArray(element) :
                this.#insert(element);
        }
        return;
    }

    #enforceRemove (number = null, ...numbers) {
        if (numbers) {
            let i = 0;
            for (i; i < numbers.length; i++)
                this.#enforceRemove(numbers[i]);
        }
        if (Array.isArray(number)) {
            let i = 0;
            for (i; i < number.length; i++)
                this.#enforceRemove(number[i]);
        }
        else if (this.search(number)) {
            const [whole, dp] = this.#returnParts(number);
            console.log(whole, dp);
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

    #enforceRemoveAll (number = null, ...numbers) {
        if (numbers) {
            let i = 0;
            for (i; i < numbers.length; i++)
                this.#enforceRemoveAll(numbers[i]);
        }
        if (Array.isArray(number)) {
            let i = 0;
            for (i; i < number.length; i++)
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
        const previousLength = this.#array.length;
        numbers &&
            this.#insertArray(numbers);
        Array.isArray(number) ?
            this.#insertArray(number) : number && this.#insert(number);
        this.#arrange();
        return previousLength != this.#array.length;
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
        if (Number(number) < 0) {
            const nWhole = whole * -1;
            if (this.#neg[nWhole]?.[2])
                if (this.#neg[nWhole][1]?.[dp])
                    if (this.#neg[nWhole][1][dp][1])
                        return this.#neg[nWhole][1][dp];
        }
        else
            if (this.#pos[whole]?.[2])
                if (this.#pos[whole][1]?.[dp])
                    if (this.#pos[whole][1][dp][1])
                        return this.#pos[whole][1][dp];
        return false;
    }

    /**
     * Deletes the an occurrence of the given argument(s) from the AroTable.
     * @param number A value that can be converted to a valid number
     * @param numbers Values that can be converted to valid numbers. They could be in an array, nested arrays, or a combination of both.
     * @returns True if successful, returns false if not.
     */
    remove (number = null, ...numbers) {
        const previousLength = this.#array.length;
        this.#enforceRemove(number, ...numbers);
        this.#shouldArrange && (this.#arrange(), this.#shouldArrange = false);
        return previousLength != this.#array.length;
    }

    /**
     * Deletes all occurrences of the given argument(s) from the AroTable.
     * @param number A value that can be converted to a valid number
     * @param numbers Values that can be converted to valid numbers. They could be in an array, nested arrays, or a combination of both.
     * @returns True if successful, returns false if not.
     */
    removeAll (number = null, ...numbers) {
        const previousLength = this.#array.length;
        this.#enforceRemoveAll(number, ...numbers);
        this.#shouldArrange && (this.#arrange(), this.#shouldArrange = true);
        return previousLength != this.#array.length;
    }

    /**
     * Removes all occurrences of any value in the AroTable that meets the condition specified in a callback function.
     * @param {Function} qualifier A function that takes the desired value to be evaluated. The dropAny method calls the qualifier function once for each number in the AroTable. 
     * @returns True if successful, returns false if not.
     */
    dropAny (qualifier) {
        const previousLength = this.#array.length;
        for (const numValue in this.#neg)
            if (this.#neg[numValue][2])
                for (const dp in this.#neg[numValue][1]) {
                    const num = this.#trimNum((Number(numValue) - Number(dp))) * -1;
                    if (qualifier(num))
                        this.#enforceRemoveAll(num);
                }

        for (const numValue in this.#pos)
            if (this.#pos[numValue][2])
                for (const dp in this.#pos[numValue][1]) {
                    const num = this.#trimNum(Number(numValue) + Number(dp));
                    if (qualifier(num))
                        this.#enforceRemoveAll(num);
                }
        this.#shouldArrange && (this.#arrange(), this.#shouldArrange = true);
        return previousLength != this.#array.length;
    }

    /**
     * Returns any value in the AroTable that meets the condition specified in a callback function.
     * @param {Function} qualifier A function that takes the desired value to be evaluated. The returnAny method calls the qualifier function once for each number in the AroTable. 
     * @returns True if at least one matching value is found, returns false if not.
     */
    returnAny (qualifier) {
        const returnArray = [];
        let index = 0;
        for (const numValue in this.#neg)
            if (this.#neg[numValue][2])
                for (const dp in this.#neg[numValue][1]) {
                    const num = this.#trimNum((Number(numValue) - Number(dp))) * -1;
                    if (this.#neg[numValue][1][dp][1] && qualifier(num))
                        returnArray[index] = num, index++;
                }

        for (const numValue in this.#pos)
            if (this.#pos[numValue][2])
                for (const dp in this.#pos[numValue][1]) {
                    const num = this.#trimNum(Number(numValue) + Number(dp));
                    if (this.#pos[numValue][1][dp][1] && qualifier(num))
                        returnArray[index] = num, index++;
                }
        return index != 0 ? this.#mergeSort(returnArray) : false;
    }

    /**
     * @returns True if the AroTable is empty, returns false if not.
     */
    isEmpty () {
        return !this.#array.length;
    }


    /**
     * Wipes the AroTable clean.
     */
    empty () {
        this.#pos = {},
            this.#neg = {},
            this.#negLength = 0,
            this.#array = [];
    }

    /**
     * Removes all positive numbers from the AroTable.
     * @returns True if successful, returns false if not.
     */
    dropPositives () {
        const previousLength = this.#array.length;
        this.#pos = {},
            this.#posLength = 0,
            this.#arrange();
        return previousLength != this.#array.length;
    }

    /**
     * Removes all negative numbers from the AroTable. 
     * @returns True if successful, returns false if not.
     */
    dropNegatives () {
        const previousLength = this.#array.length;
        this.#neg = {},
            this.#negLength = 0,
            this.#arrange();
        return previousLength != this.#array.length;
    }

    /**
     * Removes all numbers with a single occurrence from the AroTable. 
     * @returns True if successful, returns false if not.
     */
    dropUnits () {
        const previousLength = this.#array.length;
        for (const intCount in this.#neg)
            if (this.#neg[intCount][2])
                for (const dp in this.#neg[intCount][1])
                    if (this.#neg[intCount][1][dp][1] == 1)
                        this.#neg[intCount][1][dp][1] = 0,
                            this.#neg[intCount][2]--,
                            this.#negLength--;

        for (const intCount in this.#pos)
            if (this.#pos[intCount][2])
                for (const dp in this.#pos[intCount][1])
                    if (this.#pos[intCount][1][dp][1] == 1)
                        this.#pos[intCount][1][dp][1] = 0,
                            this.#pos[intCount][2]--,
                            this.#posLength--;
        this.#arrange();
        return previousLength != this.#array.length;
    }

    /**
     * Removes all numbers with multiple occurrences from the AroTable. 
     * @returns True if successful, returns false if not.
     */
    dropDuplicates () {
        const previousLength = this.#array.length;
        for (const intCount in this.#neg)
            if (this.#neg[intCount][2] > 1)
                for (const dp in this.#neg[intCount][1])
                    if (this.#neg[intCount][1][dp][1] > 1)
                        this.#neg[intCount][2] -= this.#neg[intCount][1][dp][1],
                            this.#negLength -= this.#neg[intCount][1][dp][1],
                            this.#neg[intCount][1][dp][1] = 0;

        for (const intCount in this.#pos)
            if (this.#pos[intCount][2] > 1)
                for (const dp in this.#pos[intCount][1])
                    if (this.#pos[intCount][1][dp][1] > 1)
                        this.#pos[intCount][2] -= this.#pos[intCount][1][dp][1],
                            this.#posLength -= this.#pos[intCount][1][dp][1],
                            this.#pos[intCount][1][dp][1] = 0;
        this.#arrange();
        return previousLength != this.#array.length;
    }

    /**
     * Removes all duplicated occurrences from the AroTable, leaving a single occurrence. 
     * @returns True if successful, returns false if not.
     */
    clearDuplicates () {
        const previousLength = this.#array.length;
        for (const intCount in this.#neg)
            if (this.#neg[intCount][2] > 1)
                for (const dp in this.#neg[intCount][1])
                    if (this.#neg[intCount][1][dp][1] > 0)
                        this.#neg[intCount][2] -= (this.#neg[intCount][1][dp][1] - 1),
                            this.#negLength -= (this.#neg[intCount][1][dp][1] - 1),
                            this.#neg[intCount][1][dp][1] = 1;

        for (const intCount in this.#pos)
            if (this.#pos[intCount][2] > 1)
                for (const dp in this.#pos[intCount][1])
                    if (this.#pos[intCount][1][dp][1] > 1)
                        this.#pos[intCount][2] -= (this.#pos[intCount][1][dp][1] - 1),
                            this.#posLength -= (this.#pos[intCount][1][dp][1] - 1),
                            this.#pos[intCount][1][dp][1] = 1;
        this.#arrange();
        return previousLength != this.#array.length;
    }


    /**
     * @returns {Array<Number>} A sorted array of all numbers with duplicated occurrences in the AroTable, if none exists, returns false.
     */
    returnDuplicates () {
        const duplicates = [];
        let index = 0;
        for (const int in this.#neg)
            if (this.#neg[int][2] > 1)
                for (const dp in this.#neg[int][1])
                    if (this.#neg[int][1][dp][1] > 1)
                        duplicates[index] = this.#trimNum((Number(int) * -1) + Number(dp)),
                            index++;

        for (const int in this.#pos)
            if (this.#pos[int][2] > 1)
                for (const dp in this.#pos[int][1])
                    if (this.#pos[int][1][dp][1] > 1)
                        duplicates[index] = this.#trimNum(Number(int) + Number(dp)),
                            index++;
        return duplicates.length > 0 ? this.#mergeSort(duplicates) : false;
    }

    /**
     * @returns {Array<Number>} A sorted array of all numbers with a single occurrence in the AroTable, if none exists, returns false.
     */
    returnUnits () {
        const units = [];
        let index = 0;
        for (const int in this.#neg)
            if (this.#neg[int][2])
                for (const dp in this.#neg[int][1])
                    if (this.#neg[int][1][dp][1] == 1)
                        units[index] = this.#trimNum((Number(int) * -1) + Number(dp)),
                            index++;

        for (const int in this.#pos)
            if (this.#pos[int][2])
                for (const dp in this.#pos[int][1])
                    if (this.#pos[int][1][dp][1] == 1)
                        units[index] = this.#trimNum(Number(int) + Number(dp)),
                            index++;
        return units.length > 0 ? this.#mergeSort(units) : false;
    }

    /**
     * @returns {Array<Number>} A sorted array of all negative numbers in the AroTable, if none exists, returns false.
     */
    returnNegatives () {
        const negatives = [];
        let index = 0;
        for (const neg in this.#neg)
            if (this.#neg[neg][2])
                for (const dp in this.#neg[neg][1])
                    if (this.#neg[neg][1][dp][1] != 0)
                        negatives[index] = this.#trimNum((Number(neg) * -1) + Number(dp)),
                            index++;
        return negatives.length > 0 ? this.#mergeSort(negatives) : false;
    }

    /**
     * @returns {Array<Number>} A sorted array of all positive numbers in the AroTable, if none exists returns false.
     */
    returnPositives () {
        const positives = [];
        let index = 0;
        for (const pos in this.#pos)
            if (this.#pos[pos][2])
                for (const dp in this.#pos[pos][1])
                    if (this.#pos[pos][1][dp][1] != 0)
                        positives[index] = this.#trimNum(Number(pos) + Number(dp)),
                            index++;
        return positives.length > 0 ? this.#mergeSort(positives) : false;
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
        return this.#array.length;
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
