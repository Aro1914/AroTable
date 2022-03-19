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

class AroTable {
    #pos = {};
    #neg = {};
    #negLength = 0;
    #array = [];
    #indices = {};
    /**
     * Creates an AroTable from an array.
     * @param {Array<>}  data
     */
    constructor(data) {
        this.insertArray(data);
    }

    #aroSort (array) {
        if (array === null || array === undefined) {
            return [];
        } else if (array.length <= 1) {
            return array;
        } else {
            const pos = {}, neg = {}, sorted = [];
            let negLength = 0, counter = 1;

            for (let index = 0; index < array.length; index++) (() => {
                let element = Number(array[index]);
                element < 0 ?
                    (() => {
                        element *= -1;
                        neg[element] ?
                            neg[element]++ :
                            neg[element] = 1;
                        negLength++;
                    })() :
                    pos[element] ?
                        pos[element]++ :
                        pos[element] = 1;
            })();
            if (negLength) (() => {
                for (const numValue in neg) (() => {
                    neg[numValue] > 1 ?
                        (() => {
                            for (let i = 0; i < neg[numValue]; i++)
                                (() => {
                                    sorted[negLength - counter] = Number(numValue) * -1;
                                    counter++;
                                })();
                        })() :
                        (() => {
                            sorted[negLength - counter] = Number(numValue) * -1;
                            counter++;
                        })();
                })();
            })();

            if (Object.keys(pos).length) (() => {
                for (const numValue in pos) (() => {
                    pos[numValue] > 1 ?
                        (() => {
                            for (let i = 0; i < pos[numValue]; i++) (() => {
                                sorted[negLength] = Number(numValue);
                                negLength++;
                            })();
                        })() :
                        (() => {
                            sorted[negLength] = Number(numValue);
                            negLength++;
                        })();
                })();
            })();
            return sorted;
        }
    };

    #arrange () {
        let counter = 1;
        (() => {
            this.#indices = {};
            this.#array = [];
            (this.#negLength > 0) &&
                (() => {
                    for (const numValue in this.#neg) {
                        if (isNaN(numValue))
                            return;

                        if (this.#neg[numValue] > 1) (() => {
                            for (let i = 0; i < this.#neg[numValue]; i++) (() => {
                                this.#array[this.#negLength - counter] = Number(numValue) * -1;

                                this.#indices[numValue * -1] ?
                                    this.#indices[numValue * -1] = [Number(this.#negLength - counter), ...this.#indices[numValue * -1]] :
                                    this.#indices[numValue * -1] = [Number(this.#negLength - counter)];

                                counter++;
                            })();
                        })();
                        else if (this.#neg[numValue] > 0) (() => {
                            this.#array[this.#negLength - counter] = Number(numValue) * -1;

                            this.#indices[numValue * -1] ?
                                this.#indices[numValue * -1] = [Number(this.#negLength - counter), ...this.#indices[numValue * -1]] :
                                this.#indices[numValue * -1] = [Number(this.#negLength - counter)];

                            counter++;
                        })();
                        else continue;
                    }
                })();
        })();


        (Object.keys(this.#pos).length) &&
            (() => {
                const negLength = this.#negLength;
                for (const numValue in this.#pos) {
                    if (isNaN(numValue))
                        return;
                    if (this.#pos[numValue] > 1) (() => {
                        for (let i = 0; i < this.#pos[numValue]; i++) (() => {
                            this.#array[this.#negLength] = Number(numValue);

                            this.#indices[numValue] ?
                                this.#indices[numValue][this.#indices[numValue].length] = (Number(this.#negLength)) :
                                this.#indices[numValue] = [Number(this.#negLength)];

                            this.#negLength++;
                        })();
                    })();
                    else if (this.#pos[numValue] > 0) (() => {
                        this.#array[this.#negLength] = Number(numValue);

                        this.#indices[numValue] ?
                            this.#indices[numValue][this.#indices[numValue].length] = (Number(this.#negLength)) :
                            this.#indices[numValue] = [Number(this.#negLength)];

                        this.#negLength++;
                    })();
                    else continue;
                }
                this.#negLength = negLength;
            })();
    };

    /**
     * Inserts a single integer into the AroTable. Returns true if successful, but returns false if not.
     * @param {Number}  integer
     */
    insert (integer) {
        if (!integer || integer == null || integer == undefined || isNaN(integer)) return false;
        const previousLength = this.#array.length;
        integer < 0 ?
            (() => {
                integer *= -1;
                this.#neg[integer] ?
                    this.#neg[integer]++ :
                    this.#neg[integer] = 1;

                this.#negLength++;
            })() :
            this.#pos[integer] ?
                this.#pos[integer]++ :
                this.#pos[integer] = 1;
        this.#arrange();
        if (previousLength == this.#array.length) {
            return false;
        }
        return true;
    }

    /**
     * Inserts an array of integers into the AroTable. Returns true if successful, but returns false if not.
     * @param {Array<>}  integers
     */
    insertArray (integers) {
        if (integers == null || integers == undefined || integers.length == 0 || !Array.isArray(integers)) return false;
        const previousLength = this.#array.length;
        for (let index = 0; index < integers.length; index++) {
            let element = Number(integers[index]);

            if (integers[index] == null) continue;
            if (isNaN(element)) continue;
            element < 0 ?
                (() => {
                    element *= -1;
                    this.#neg[element] ?
                        this.#neg[element]++ :
                        this.#neg[element] = 1;

                    this.#negLength++;
                })() :
                this.#pos[element] ?
                    this.#pos[element]++ :
                    this.#pos[element] = 1;
        };
        this.#arrange();
        if (previousLength == this.#array.length) {
            return false;
        }
        return true;
    }

    /**
     * Searches for an occurrence of the given value in the AroTable. Returns the indices of each occurrence if found, if not returns false.
     * @param {Number} value
     * @returns {Array<Number>} array
     */
    search (value) {
        if (value == null || value == undefined || isNaN(value)) return false;
        return this.#indices[Number(value)] ? this.#indices[Number(value)] : false;
    }

    /**
     * Deletes the first occurrence of the integer from the AroTable. Returns true if successful, returns false if not.
     * @param {Number} integer
     */
    delete (integer) {
        if (this.search(integer) !== false) {
            Number(integer) < 0 ?
                (() => {
                    this.#neg[Number(integer * -1)]--;
                    this.#negLength--;
                })() :
                this.#pos[Number(integer)]--;
            this.#arrange();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Deletes all occurrences of the integer from the AroTable. Returns true if successful, returns false if not.
     * @param {Number} integer
     */
    deleteAll (integer) {
        if (this.search(integer) !== false) {
            Number(integer) < 0 ?
                (() => {
                    const reducer = this.#neg[Number(integer * -1)];
                    this.#neg[Number(integer * -1)] = 0;
                    this.#negLength -= reducer;
                })() :
                this.#pos[Number(integer)] = 0;
            this.#arrange();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Deletes all negative integers from the AroTable.
     */
    dropPositives () {
        this.#pos = {};
        this.#arrange();
    }

    /**
     * Deletes all positive integers from the AroTable.
     */
    dropNegatives () {
        this.#neg = {};
        this.#negLength = 0;
        this.#arrange();
    }

    /**
     * Deletes all integers with a single occurrence from the AroTable.
     */
    dropUnits () {
        for (const intCount in this.#neg) (() => {
            this.#neg[intCount] == 1 ?
                (() => {
                    this.#negLength -= this.#neg[intCount];
                    this.#neg[intCount] = 0;
                })()
                :
                false;
        })();

        for (const intCount in this.#pos) (() => {
            this.#pos[intCount] == 1 ?
                this.#pos[intCount] = 0 :
                false;
        })();

        this.#arrange();
    }

    /**
     * Deletes all duplicated occurrences from the AroTable, leaving a single occurrence.
     */
    clearDuplicates () {
        for (const intCount in this.#neg) (() => {
            this.#neg[intCount] > 0 ?
                (() => {
                    this.#negLength -= (this.#neg[intCount] - 1);
                    this.#neg[intCount] = 1;
                })()
                :
                false;
        })();

        for (const intCount in this.#pos) (() => {
            this.#pos[intCount] > 0 ?
                this.#pos[intCount] = 1
                : false;
        })();

        this.#arrange();
    }


    /**
     * Returns a sorted array of all integers with duplicated occurrences in the AroTable, if none exists, returns false.
     * @returns {Array<Number>} array
     */
    returnDuplicates () {
        let duplicates = [];
        let index = 0;
        for (const int in this.#neg) (() => {
            this.#neg[int] > 1 ?
                (() => {
                    duplicates[index] = Number(int * -1);
                    index++;
                })() :
                false;
        })();

        for (const int in this.#pos) (() => {
            this.#pos[int] > 1 ?
                (() => {
                    duplicates[index] = Number(int);
                    index++;
                })() :
                false;
        })();
        return duplicates.length > 0 ? this.#aroSort(duplicates) : false;
    }

    /**
     * Returns a sorted array of all integers with a single occurrence in the AroTable, if none exists, returns false.
     * @returns {Array<Number>} array
     */
    returnUnits () {
        let units = [];
        let index = 0;
        for (const int in this.#neg) (() => {
            this.#neg[int] == 1 ?
                (() => {
                    units[index] = Number(int * -1);
                    index++;
                })() :
                false;
        })();

        for (const int in this.#pos) (() => {
            this.#pos[int] == 1 ?
                (() => {
                    units[index] = Number(int);
                    index++;
                })() :
                false;
        })();

        return units.length > 0 ? this.#aroSort(units) : false;
    }

    /**
     * Returns a sorted array of all negative integers in the AroTable.
     * @returns {Array<Number>} array
     */
    returnNegatives () {
        const negatives = [];
        let index = 0;
        for (const neg in this.#neg) {
            if (this.#neg[neg] != 0) {
                negatives[index] = Number(neg * -1);
                index++;
            } else {
                continue;
            }
        }

        return negatives.length > 0 ? this.#aroSort(negatives) : false;
    }

    /**
     * Returns a sorted array of all positive integers in the AroTable.
     * @returns {Array<Number>} array
     */
    returnPositives () {
        const positives = [];
        let index = 0;
        for (const pos in this.#pos) {
            if (this.#pos[pos] != 0) {
                positives[index] = Number(pos);
                index++;
            } else {
                continue;
            }
        }

        return positives.length > 0 ? this.#aroSort(positives) : false;
    }

    /**
     * Returns an object showing the distribution of numbers in the AroTable.
     * @returns object
     */
    getDistribution () {
        return {
            'Positive Numbers':
                Number(this.#array.length - this.#negLength),
            'Negative Numbers': Number(this.#negLength)
        };
    }

    /**
     * Returns an array representation of the AroTable.
     * @returns {Array<Number>} array
     */
    returnArray () {
        return this.#array;
    }
}

export default AroTable;