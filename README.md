# AroTable (For Client Side)

## Contents

- [AroTable (For Client Side)](#arotable-for-client-side)
  - [Contents](#contents)
  - [Description](#description)
  - [Usage](#usage)
    - [Client-side Only](#client-side-only)
  - [Methods](#methods)
    - [The **returnArray()** Method](#the-returnarray-method)
    - [The **size()** Method](#the-size-method)
    - [The **add()** Method](#the-add-method)
    - [The **remove()** Method](#the-remove-method)
    - [The **removeAll()** Method](#the-removeall-method)
    - [The **dropAny()** Method](#the-dropany-method)
    - [The **returnAny()** Method](#the-returnany-method)
    - [The **search()** Method](#the-search-method)
    - [The **clearDuplicates()** Method](#the-clearduplicates-method)
    - [The **returnDuplicates()** Method](#the-returnduplicates-method)
    - [The **dropDuplicates()** method](#the-dropduplicates-method)
    - [The **dropUnits()** Method](#the-dropunits-method)
    - [The **returnUnits()** Method](#the-returnunits-method)
    - [The **dropPositives()** Method](#the-droppositives-method)
    - [The **returnPositives()** Method](#the-returnpositives-method)
    - [The **dropNegatives()** Method](#the-dropnegatives-method)
    - [The **returnNegatives()** Method](#the-returnnegatives-method)
    - [The **getDistribution()** Method](#the-getdistribution-method)
    - [The **empty()** Method](#the-empty-method)
    - [The **isEmpty()** Method](#the-isempty-method)
  - [Acknowledgments](#acknowledgments)
  - [Contributors](#contributors)
  - [Contributing](#contributing)
  - [License](#license)

## Description

AroTable is a number data structure capable of sorting itself on any manipulation that calls for the internal structure to be updated. Running on two powerful sorting algorithms—[AroSort](https://github.com/Sight-Innovation/AroSort) and MergeSort, with [AroSort](https://github.com/Sight-Innovation/AroSort) sorting the integer portions of numbers stored in the AroTable, while MergeSort sorts the decimal portions—AroTable boasts a Big O Notation for time complexity of O(n) in adding and removing, and an amazing O(1) in searching!

Compatible with both client-side and server-side environments.

## Usage

### Client-side Only

For the server-side implementation, see the [AroTable-For-Server-Side Repo](https://github.com/Aro1914/AroTable-For-Server-Side)

Install the **AroTable** package with [NPM](https://www.npmjs.org/):

```sh
npm install arotable
```

In your package.json, set "type" to "module" to enable you import an ES Module.

```json
"type" : "module"
```

Or you can rename the javascript file the module is to be used to have the .mjs extension:

That is from `index.js` to `index.mjs`

Now when that is done, in your application code, import 'arotable' and assign a new instance of the AroTable class to a variable:

```js
import AroTable from 'arotable';

const aroTable = new AroTable();
```

The AroTable constructor works like an overloaded constructor, it could be giving no arguments or it could be given the same kind of arguments as the [add()](#the-add-method) method.

> **_Note_**: The maximum number of decimal places for numbers stored in the AroTable is 3

## Methods

### The **returnArray()** Method

The **returnArray()** method returns an array representation of the AroTable:

```js
const aroTable = new AroTable(1,2,'3',-4);

aroTable.returnArray(); // Returns [-4, 1, 2, 3]
```

### The **size()** Method

The **size()** method returns the amount of integers held in the AroTable:

```js
const aroTable = new AroTable(-1,2,'3');

aroTable.size(); // Returns 3
```

### The **add()** Method

The **add()** method, as the name suggests adds the arguments passed to it to the AroTable. Its arguments could be an integer, multiple integers, or an array, or better still a combination of both. Returns true if at least a value was added successfully, returns false if not:

```js
const aroTable = new AroTable();

aroTable.add(1); // Returns true
aroTable.add(-2,3); // Returns true
aroTable.add([4]); // Returns true
aroTable.add([5,-6]); // Returns true
aroTable.add([-7,8],-9); // Returns true
aroTable.add([10,11],12,-13); // Returns true

aroTable.add(); // Returns false
```

The **add()** method can also work with strings that can be converted to a valid integer, with the exception of **null** and empty string (**''**):

```js
aroTable.add('1'); // Returns true
aroTable.add('-2','3'); // Returns true
aroTable.add(['4']); // Returns true
aroTable.add(['5','-6']); // Returns true
aroTable.add(['-7','8'],'-9'); // Returns true
aroTable.add(['10','-11'],'12','-13'); // Returns true
aroTable.add(14,['15','-16'],'17',['-18'],19,20,-21,['22','-23',24,25,-26],27,28); // Returns true
aroTable.add([1,2,[3,4,[5,6,[7,8]]]],9); // Returns true

aroTable.add(null); // Returns false
aroTable.add(null,undefined); // Returns false
aroTable.add([null]); // Returns false
aroTable.add([null,undefined]); // Returns false
aroTable.add([null,undefined],null); // Returns false
aroTable.add('one'); // Returns false
aroTable.add('two','three'); // Returns false
aroTable.add('four','five'); // Returns false
```

If the arguments passed contains integer convertible types along with non-integer convertible types, the **add()** method will add the valid input to the AroTable, ignoring the non-integer convertible types:

```js
aroTable.add(1,'-2','three',-4,'5',null,7,undefined,'nine');  // returns true
// In this case, 1, '-2', -4, '5', 7 are added to the AroTable, while all other non-integer convertible typed values are ignored.
```

### The **remove()** Method

The **remove()** method takes the same kind of arguments as the [add()](#the-add-method) method and then removes an occurrence of any value—that exists in the AroTable—passed as an argument from the AroTable. Returns true if at least a value was removed successfully, returns false if not:

```js
const aroTable = new AroTable(2,2,2,4,4,5,4,5,6,2);

aroTable.remove(1); // Returns false
aroTable.remove(2); // Returns true
aroTable.returnArray(); // Returns [ 2, 2, 2, 4, 4, 4, 5, 5, 6 ]
aroTable.remove(4,[5,6],'2'); // Returns true
aroTable.returnArray(); // Returns [ 2, 2, 4, 4, 5 ]
```

The **remove()** method can also work with strings that can be converted to a valid integer, with the exception of **null** and empty string (**''**). See the [add()](#the-add-method) method for examples.

### The **removeAll()** Method

The **removeAll()** method takes the same kind of arguments as the [add()](#the-add-method) method and removes all occurrences of any value—that exists in the AroTable—passed as an argument from the AroTable. Returns true if at least a value was removed successfully, returns false if not:

```js
const aroTable = new AroTable(2,2,2,4,4,5,4,5,6,2);

aroTable.removeAll(-7); // Returns false
aroTable.removeAll('2',[4,5]); // Returns true
aroTable.returnArray(); // Returns [ 6 ]
```

The **removeAll()** method can also work with strings that can be converted to a valid integer, with the exception of **null** and empty string (**''**). See the [add()](#the-add-method) method for examples.

### The **dropAny()** Method

The **dropAny()** method, is a higher-order method that takes in a callback function and removes all occurrences of any value in the AroTable that meets the condition specified in the callback function. Returns true if at least a value was removed successfully, returns false if not:

```js
const aroTable = new AroTable(2,2,2,4,5,6,8,2,9,1,0);

aroTable.dropAny(num => num <= 2); // Returns true
aroTable.returnArray(); // Returns [ 4, 5, 6, 8, 9 ]
aroTable.dropAny(num => num % 2 == 0); // Returns true
aroTable.returnArray(); // Returns [ 5, 9 ]
aroTable.dropAny(num => num >= 10); // Returns false
aroTable.returnArray(); // Returns [ 5, 9 ]
```

### The **returnAny()** Method

The **returnAny()** method, is a higher-order method that takes in a callback function and returns any value in the AroTable that meets the condition specified in the callback function. Returns true if at least a value meets the condition, returns false if not:

```js
const aroTable = new AroTable(2,2,2,4,5,6,8,2,9,1,0);

aroTable.returnAny(num => num <= 2); // Returns [ 0, 1, 2 ]
aroTable.returnAny(num => num % 2 == 0); // Returns [ 0, 2, 4, 6, 8 ]
aroTable.returnAny(num => num >= 10); // Returns false
```

### The **search()** Method

The **search()** method takes in an integer argument. Returns an array with two values, the first is the first index the integer occurs in an array representation of the AroTable, and the second shows how many times it occurred. If no occurrence is found, returns false.

```js
const aroTable = new AroTable(1,3,-2,5,6,-2,6,7,3);

aroTable.search(-2); // Returns [ 0, 2 ]
aroTable.search(3); // Returns [ 3, 2 ]
aroTable.search(9); // Returns false
```

### The **clearDuplicates()** Method

The **clearDuplicates()** method removes all duplicated occurrences from the AroTable, leaving a single occurrence. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(1,2,3,4,2,3,4,5,6,6,6,3);

aroTable.clearDuplicates(); // Returns true
aroTable.returnArray(); // Returns [ 1, 2, 3, 4, 5, 6 ]
aroTable.clearDuplicates(); // Returns false
aroTable.returnArray(); // Returns [ 1, 2, 3, 4, 5, 6 ]
```

### The **returnDuplicates()** Method

The **returnDuplicates()** method returns a sorted array (using Merge Sort) of all integers with duplicated occurrences in the AroTable, if none exists, returns false:

```js
const aroTable = new AroTable(1,2,3,4,2,3,4,5,6,6,6,3);

aroTable.returnDuplicates(); // Returns [ 2, 3, 4, 6 ]
aroTable.clearDuplicates();
aroTable.returnDuplicates(); // Returns false
```

### The **dropDuplicates()** method

The **dropDuplicates()** removes all integers with multiple occurrences from the AroTable. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(1,2,3,4,2,3,4,5,6,6,6,3);

aroTable.dropDuplicates(); // Returns true
aroTable.returnArray(); // Returns [ 1, 5 ]
aroTable.dropDuplicates(); // Returns false
```

### The **dropUnits()** Method

The **dropUnits()** method removes all integers with a single occurrence from the AroTable. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(1,2,3,4,2,3,4,5,6,6,6,3);

aroTable.dropUnits(); // Returns true
aroTable.returnArray(); // Returns [ 2, 2, 3, 3, 3, 4, 4, 6, 6, 6 ]
aroTable.dropUnits(); // Returns false
```

### The **returnUnits()** Method

The **returnUnits()** method returns a sorted array (using Merge Sort) of all integers with a single occurrence in the AroTable, if none exists, returns false:

```js
const aroTable = new AroTable(1,2,3,4,2,3,4,5,6,6,6,3);

aroTable.returnUnits(); // Returns [ 1, 5 ]
aroTable.dropUnits();
aroTable.returnUnits(); // Returns false
```

### The **dropPositives()** Method

The **dropPositives()** method removes all positive integers from the AroTable. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(-5,-4,-3,'-2',-1,'0',1,2,'3',4,5);

aroTable.dropPositives(); // Returns true
aroTable.returnArray(); // Returns [ -5, -4, -3, -2, -1 ]
aroTable.dropPositives(); // Returns false
```

### The **returnPositives()** Method

The **returnPositives()** method returns a sorted array (using Merge Sort) of all positive integers in the AroTable, if none exists returns false:

```js
const aroTable = new AroTable(-5,-4,-3,'-2',-1,'0',1,2,'3',4,5);

aroTable.returnPositives(); // Returns [ 0, 1, 2, 3, 4, 5 ]
aroTable.dropPositives();
aroTable.returnPositives(); // Returns false
```

### The **dropNegatives()** Method

The **dropNegatives()** method removes all negative integers from the AroTable. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(-5,-4,-3,'-2',-1,'0',1,2,'3',4,5);

aroTable.dropNegatives(); // Returns true
aroTable.returnArray(); // Returns [ 0, 1, 2, 3, 4, 5 ]
aroTable.dropNegatives(); // Returns false
```

### The **returnNegatives()** Method

The **returnNegatives()** method returns a sorted array (using Merge Sort) of all negative integers in the AroTable, if none exists returns false:

```js
const aroTable = new AroTable(-5,-4,-3,'-2',-1,'0',1,2,'3',4,5);

aroTable.returnNegatives(); // Returns [ -5, -4, -3, -2, -1 ]
aroTable.dropNegatives();
aroTable.returnNegatives(); // Returns false
```

### The **getDistribution()** Method

The **getDistribution()** method returns an object showing the distribution of integers in the AroTable:

```js
const aroTable = new AroTable(-5,-4,-3,'-2',-1,'0',1,2,'3',4,5);

aroTable.getDistribution(); // Returns { 'Positive Integers': 6, 'Negative Integers': 5 }
```

### The **empty()** Method

The **empty()** method wipes the AroTable clean, it has no return value:

```js
const aroTable = new AroTable(1,'3',2,'-5',4,'-2','-1',5,-3,'-4');

aroTable.empty();
aroTable.returnArray(); // Returns []
aroTable.getDistribution(); // Returns { 'Positive Integers': 0, 'Negative Integers': 0 }
```

A better way to check if the AroTable is empty, is to use...

### The **isEmpty()** Method

The **isEmpty()** method returns true if the AroTable is empty, returns false if not:

```js
const aroTable = new AroTable(1,'3',2,'-5',4,'-2','-1',5,-3,'-4');

aroTable.isEmpty(); // Returns false
aroTable.empty();
aroTable.isEmpty() // Returns true
```

## Acknowledgments

I would like to express my gratitude to my senior colleague, [Mr. Ajayi Taiwo](https://github.com/ajayioyetomi) who helped me with both useful and technical insights as I developed this project.

## Contributors

<a href="https://github.com/aro1914/arotable/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=aro1914/arotable" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change or improve.

## License

The AroTable Project is released under the
[Apache License](http://www.apache.org/licenses/).
