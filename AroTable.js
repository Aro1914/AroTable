/**
 *   Description: A sorted integer data structure.
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
 * A self sorting integer data structure
 */
export default class AroTable {
    #pos = {};
    #neg = {};
    #negLength = 0;
    #array = [];
    /**
     * Creates an AroTable. Works like an overloaded constructor, it could take no arguments, or it could take a single integer or multiple integers could be passed, or an array, or better still a combination of both.
     * @param data
     * @param values
     */
    constructor(data = null, ...values) {
        this.add(data, ...values);
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
            left_values[left_index] < right_values[right_index] ?
                (sorted_values.push(left_values[left_index]),
                    left_index++)
                :
                (sorted_values.push(right_values[right_index]),
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
                const num = Number(numValue) * -1, negOc = this.#neg[numValue];
                tempNegLength -= negOc;
                this.#neg[numValue][0] = tempNegLength;
                if (this.#neg[numValue][1] > 1) {
                    let i = 0;
                    for (i; i < this.#neg[numValue][1]; i++)
                        this.#array[this.#negLength - counter] = num,
                            counter++;
                }
                else if (this.#neg[numValue][1] == 1)
                    this.#array[this.#negLength - counter] = num,
                        counter++;
                else continue;
            }
        }

        if (Object.keys(this.#pos).length) {
            let posPosition = this.#negLength;
            let a = 0;
            for (const numValue in this.#pos) {
                a++;
                if (isNaN(numValue)) continue;
                const num = Number(numValue);
                this.#pos[numValue][0] = posPosition;
                if (this.#pos[numValue][1] > 1) {
                    let i = 0;
                    for (i; i < this.#pos[numValue][1]; i++)
                        this.#array[posPosition] = num,
                            posPosition++;
                }
                else if (this.#pos[numValue][1] == 1) {
                    this.#array[posPosition] = num,
                        posPosition++;
                }
                else continue;
            }
        }
    };

    #insert (integer) {
        if (!integer ||
            integer == null ||
            integer == undefined ||
            isNaN(integer) ||
            integer === '') return false;
        if (integer < 0)
            integer *= -1,
                this.#neg[integer]?.[1] ?
                    this.#neg[integer][1]++ :
                    this.#neg[integer] = [null, 1],
                this.#negLength++;
        else
            this.#pos[integer]?.[1] ?
                this.#pos[integer][1]++ :
                this.#pos[integer] = [null, 1];

        return;
    }

    #insertArray (integers) {
        if (integers == null ||
            integers == undefined ||
            !integers.length ||
            !Array.isArray(integers)) return false;

        let index = 0;
        for (index; index < integers.length; index++) {
            let element = integers[index];
            Array.isArray(element) ?
                this.#insertArray(element) :
                this.#insert(element);
        }

        return;
    }

    #enforceRemove (integer = null, ...integers) {
        if (integers) {
            let i = 0;
            for (i; i < integers.length; i++)
                this.#enforceRemove(integers[i]);
        }
        if (Array.isArray(integer)) {
            let i = 0;
            for (i; i < integer.length; i++)
                this.#enforceRemove(integer[i]);
        }
        else if (this.search(integer)[1]) {
            if (Number(integer) < 0)
                this.#neg[Number(integer * -1)][1]--,
                    this.#negLength--;
            else
                this.#pos[Number(integer)][1]--;
            this.#arrange();
        }
        return;
    }

    #enforceRemoveAll (integer = null, ...integers) {
        if (integers) {
            let i = 0;
            for (i; i < integers.length; i++)
                this.#enforceRemoveAll(integers[i]);
        }
        if (Array.isArray(integer)) {
            let i = 0;
            for (i; i < integer.length; i++)
                this.#enforceRemoveAll(integer[i]);
        }
        else if (this.search(integer)[1]) {
            if (Number(integer) < 0)
                this.#negLength -= this.#neg[Number(integer * -1)][1],
                    this.#neg[Number(integer * -1)][1] = 0;
            else
                this.#pos[Number(integer)][1] = 0;
            this.#arrange();
        }
        return;
    }

    /**
     * Adds the given arguments to the AroTable. Its arguments could be an integer or multiple integers could be passed, or an array, or better still a combination of both. Returns true if successful, returns false if not.
     * @param data
     * @param values
     */
    add (data = null, ...values) {
        const previousLength = this.#array.length;

        values &&
            this.#insertArray(values);
        Array.isArray(data) ?
            this.#insertArray(data) : data && this.#insert(data);

        this.#arrange();

        return previousLength != this.#array.length;
    }

    /**
     * Searches for an occurrence of the given integer in the AroTable. Returns an array with two values, the first is the first index the integer occurred in the AroTable, and the second shows how many times it occurred. If no occurrence is found, returns false.
     * @param integer
     * @returns {Array<Number>} array
     */
    search (integer) {
        if (integer == null ||
            integer == undefined ||
            isNaN(integer)) return false;
        return integer < 1 ? this.#neg[integer * -1]?.[0] == null ||
            this.#neg[integer * -1]?.[0] == undefined ? false : this.#neg[integer * -1] : this.#pos[integer]?.[0] == null ||
                this.#pos[integer]?.[0] == undefined ? false : this.#pos[integer];
    }

    /**
     * Deletes the first occurrence of the given argument(s) from the AroTable. Its arguments could be an integer or multiple integers could be passed, or an array, or better still a combination of both. Returns true if successful, returns false if not.
     * @param integer
     * @param integers
     */
    remove (integer = null, ...integers) {
        const previousLength = this.#array.length;
        this.#enforceRemove(integer, ...integers);
        return previousLength != this.#array.length;
    }

    /**
     * Deletes all occurrences of the given argument(s) from the AroTable. Its arguments could be an integer or multiple integers could be passed, or an array, or better still a combination of both. Returns true if successful, returns false if not.
     * @param integer
     * @param integers
     */
    removeAll (integer = null, ...integers) {
        const previousLength = this.#array.length;
        this.#enforceRemoveAll(integer, ...integers);
        return previousLength != this.#array.length;
    }

    /**
     * Returns true if the AroTable is empty, returns false if not.
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
     * Removes all positive integers from the AroTable. Returns true if successful, returns false if not.
     */
    dropPositives () {
        const previousLength = this.#array.length;
        this.#pos = {},
            this.#arrange();
        return previousLength != this.#array.length;
    }

    /**
     * Removes all negative integers from the AroTable. Returns true if successful, returns false if not.
     */
    dropNegatives () {
        const previousLength = this.#array.length;
        this.#neg = {},
            this.#negLength = 0,
            this.#arrange();
        return previousLength != this.#array.length;
    }

    /**
     * Removes all integers with a single occurrence from the AroTable. Returns true if successful, returns false if not.
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
     * Removes all integers with multiple occurrences from the AroTable. Returns true if successful, returns false if not.
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
     * Removes all duplicated occurrences from the AroTable, leaving a single occurrence. Returns true if successful, returns false if not.
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
     * Returns a sorted array of all integers with duplicated occurrences in the AroTable, if none exists, returns false.
     * @returns {Array<Number>} array
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
     * Returns a sorted array of all integers with a single occurrence in the AroTable, if none exists, returns false.
     * @returns {Array<Number>} array
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
     * Returns a sorted array of all negative integers in the AroTable.
     * @returns {Array<Number>} array
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
     * Returns a sorted array of all positive integers in the AroTable, if none exists returns false.
     * @returns {Array<Number>} array
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
     * Returns an array representation of the AroTable.
     * @returns {Array<Number>} array
     */
    returnArray () {
        return this.#array;
    }

    /**
     * Returns the size of the AroTable.
     * @returns {Number} size
     */
    size () {
        return this.#array.length;
    }

    /**
     * Returns an object showing the distribution of integers in the AroTable.
     * @returns object
     */
    getDistribution () {
        return {
            'Positive Integers': Number(this.#array.length - this.#negLength),
            'Negative Integers': Number(this.#negLength)
        };
    }
}