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

    #arrange () {
        let counter = 1;
        this.#array = [];
        if (this.#negLength) {
            let tempNegLength = this.#negLength;

            for (const numValue in this.#neg) {
                if (isNaN(numValue)) continue;
                const num = Number(numValue) * -1, negOc = this.#neg[numValue][2];
                tempNegLength -= negOc;
                this.#neg[numValue][0] = tempNegLength;
                if (this.#neg[numValue][2] > 1) {
                    const keys = this.#mergeSort(Object.keys(this.#neg[numValue][1]));
                    let x = keys.length - 1;
                    for (x; x >= 0; x--) {
                        const oc = this.#neg[numValue][1][String(keys[x])][1];
                        this.#neg[numValue][1][String(keys[x])][0] = this.#negLength - counter;
                        let i = oc;
                        for (i; i > 0; i--)
                            this.#array[this.#negLength - counter] = num + Number(keys[x]),
                                counter++;
                    }
                }
                else if (this.#neg[numValue][2] == 1) {
                    const key = (() => {
                        for (const x in this.#neg[numValue][1])
                            if (this.#neg[numValue][1][x][1] == 1)
                                return Number(x);
                    })();
                    this.#neg[numValue][1][String(key)][0] = tempNegLength;
                    this.#array[this.#negLength - counter] = num + key;
                    counter++;
                }
                else continue;
            }

        }

        if (Object.keys(this.#pos).length) {
            let posPosition = this.#negLength;

            for (const numValue in this.#pos) {
                if (isNaN(numValue)) continue;
                const num = Number(numValue);
                this.#pos[numValue][0] = posPosition;
                if (this.#pos[numValue][2] > 1) {
                    const keys = this.#mergeSort(Object.keys(this.#pos[numValue][1]));
                    let x = 0;
                    for (x; x < keys.length; x++) {
                        const oc = this.#pos[numValue][1][String(keys[x])][1];
                        this.#pos[numValue][1][String(keys[x])][0] = posPosition;
                        let i = 0;
                        for (i; i < oc; i++)
                            this.#array[posPosition] = num + Number(keys[x]),
                                posPosition++;
                    }
                }
                else if (this.#pos[numValue][2] == 1) {
                    const key = (() => {
                        for (const x in this.#pos[numValue][1])
                            if (this.#pos[numValue][1][x][1] == 1)
                                return Number(x);
                    })();
                    this.#pos[numValue][1][String(key)][0] = posPosition;
                    this.#array[posPosition] = num + key,
                        posPosition++;
                }
                else continue;
            }

        }
    };

    #insert (number) {
        if (!number && number !== 0 ||
            isNaN(number) ||
            number === '') return false;

        const dp = +(Math.round(number % 1 + 'e+3') + 'e-3');
        const whole = number - (number % 1);
        if (number < 0) {
            const nWhole = whole * -1;
            if (!this.#neg[nWhole]) {
                this.#neg[nWhole] = [null, {}, 1];
                this.#neg[nWhole][1][dp] = [null, 1];
            } else {
                this.#neg[nWhole][1][dp] ? this.#neg[nWhole][1][dp][1]++ : this.#neg[nWhole][1][dp] = [null, 1];
                this.#neg[nWhole][2]++;
            }
            this.#negLength++;
        } else {
            if (!this.#pos[whole]) {
                this.#pos[whole] = [null, {}, 1];
                this.#pos[whole][1][dp] = [null, 1];
            } else {
                this.#pos[whole][1][dp] ? this.#pos[whole][1][dp][1]++ : this.#pos[whole][1][dp] = [null, 1];
                this.#pos[whole][2]++;
            }
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
        else if (this.search(number)[1]) {
            const dp = +(Math.round(number % 1 + 'e+3') + 'e-3'), whole = number - (number % 1);
            if (Number(number) < 0)
                this.#neg[Number(whole * -1)][2]--,
                    this.#neg[Number(whole * -1)][1][dp][1]--,
                    this.#negLength--;
            else
                this.#pos[Number(whole)][2]--,
                    this.#pos[Number(whole)][1][dp][1]--;
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
        else if (this.search(number)[1]) {
            if (Number(number) < 0)
                this.#negLength -= this.#neg[Number(number * -1)][1],
                    this.#neg[Number(number * -1)][1] = 0;
            else
                this.#pos[Number(number)][1] = 0;
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
        const dp = +(Math.round(number % 1 + 'e+3') + 'e-3'), whole = number - (number % 1);
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
        for (const numValue in this.#neg) {
            const num = numValue * -1;
            if (qualifier(num))
                this.#enforceRemoveAll(num);
        }
        for (const numValue in this.#pos)
            if (qualifier(numValue))
                this.#enforceRemoveAll(numValue);
        this.#shouldArrange && (this.#arrange(), this.#shouldArrange = true);
        return previousLength != this.#array.length;
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
            if (this.#neg[intCount][1] == 1)
                this.#negLength -= this.#neg[intCount][1],
                    this.#neg[intCount][1] = 0;
        for (const intCount in this.#pos)
            if (this.#pos[intCount][1] == 1)
                this.#pos[intCount][1] = 0;
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
            if (this.#neg[intCount][1] > 1)
                this.#negLength -= this.#neg[intCount][1],
                    this.#neg[intCount][1] = 0;
        for (const intCount in this.#pos)
            if (this.#pos[intCount][1] > 1)
                this.#pos[intCount][1] = 0;
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
            if (this.#neg[intCount][1] > 0)
                this.#negLength -= (this.#neg[intCount][1] - 1),
                    this.#neg[intCount][1] = 1;
        for (const intCount in this.#pos)
            if (this.#pos[intCount][1] > 0)
                this.#pos[intCount][1] = 1;
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
            if (this.#neg[int][1] > 1)
                duplicates[index][1] = Number(int * -1),
                    index++;
        for (const int in this.#pos)
            if (this.#pos[int][1] > 1)
                duplicates[index][1] = Number(int),
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
            if (this.#neg[int][1] == 1)
                units[index][1] = Number(int * -1),
                    index++;
        for (const int in this.#pos)
            if (this.#pos[int][1] == 1)
                units[index][1] = Number(int),
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
            if (this.#neg[neg][1] != 0)
                negatives[index][1] = Number(neg * -1),
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
            if (this.#pos[pos][1] != 0)
                positives[index][1] = Number(pos),
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
            'Positive Integers': Number(this.#array.length - this.#negLength),
            'Negative Integers': Number(this.#negLength)
        };
    }
}