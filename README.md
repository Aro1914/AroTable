# AroTable (For Client Side)

## Contents

- [AroTable (For Client Side)](#arotable-for-client-side)
  - [Contents](#contents)
  - [Description](#description)
  - [Usage](#usage)
    - [Client-side Only](#client-side-only)
    - [**Decimal Places**](#decimal-places)
  - [Methods](#methods)
    - [The **add()** Method](#the-add-method)
    - [The **returnArray()** Method](#the-returnarray-method)
    - [The **size()** Method](#the-size-method)
    - [The **remove()** Method](#the-remove-method)
    - [The **removeAll()** Method](#the-removeall-method)
    - [The **search()** Method](#the-search-method)
    - [The **dropAny()** Method](#the-dropany-method)
    - [The **returnAny()** Method](#the-returnany-method)
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

AroTable is a number data structure capable of sorting itself on any interaction that calls for the internal structure to be updated. It utilizes the same mechanism used by Count Sort to arrange the whole number portion of numbers stored in it into an array representation, while MergeSort is used to determine the accurate position in which the decimal portions are to be attached.  

> AroTable boasts a Big O Notation for time complexity of O(n) in adding and removing, and an amazing O(1) in searching!

Compatible with both client-side and server-side environments.

## Usage

### Client-side Only

For the server-side implementation, see the [AroTable-For-Server-Side Repo](https://github.com/Aro1914/AroTable-For-Server-Side)

Install the **AroTable** package using [NPM](https://www.npmjs.org/):

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

### **Decimal Places**

The maximum number of decimal places for numbers stored in the AroTable is **3**, e.g. _1.234, 3.345, -23434.334, -0.646_.  

- Any value that exceeds this amount of decimal places would trigger an immediate approximation to 3 decimal places, e.g _12.3455345_ -> _12.346_, the original form of the value would be irretrievable and the newly approximated value stored in its place.  
- In the earlier example, running a [lossless search](#the-search-method) for _12.3455345_ would result in _false_ being returned, rather a [lossy search](#the-search-method) for its integer portion - _12_, would return the range of its occurrences.  
- In the event one attempts to insert values like _4.999999_ and _-12.999999_, they will both be rounded to _5_ and _-13_ respectively.  

## Methods

### The **add()** Method

The **add()** method, as the name suggests adds the arguments passed to it to the AroTable. Its arguments could be a number, multiple numbers, or an array, or better still a combination of both.  

Returns true if at least a value was added successfully, returns false if not:

```js
const aroTable = new AroTable();

aroTable.add(1); // Returns true
aroTable.add(-2.45, 3); // Returns true
aroTable.add([4]); // Returns true
aroTable.add([5, -6.999]); // Returns true
aroTable.add([-7, 8.343], -9); // Returns true
aroTable.add([10, -11], 12.432, -13); // Returns true

aroTable.add(); // Returns false
```

The **add()** method can also work with strings that can be converted to a valid number, with the exception of empty string (**''**), other types such as **null** and **undefined** are not supported:

```js
aroTable.add('1.8'); // Returns true
aroTable.add('-2.12', '3'); // Returns true
aroTable.add(['4']); // Returns true
aroTable.add(['5.4', '-6']); // Returns true
aroTable.add(['-7.111', '8'], '-9'); // Returns true
aroTable.add(['10.13', '-11.922'], '12', '-13.16'); // Returns true
aroTable.add(14, ['15.149', '-16'],'17', ['-18'], 19.1, 20.9, -21, ['22.7', '-23.6', 24.5, 25, -26.355], 27.2, 28); // Returns true
aroTable.add([1, 2, [3.123, 4, [5, 6.11, [7.15, 8]]]], 9); // Returns true

aroTable.add(null); // Returns false
aroTable.add(null, undefined); // Returns false
aroTable.add([null]); // Returns false
aroTable.add([null, undefined]); // Returns false
aroTable.add([null, undefined], null); // Returns false
aroTable.add('one'); // Returns false
aroTable.add('two', 'three'); // Returns false
aroTable.add('four', 'five'); // Returns false
```

If the arguments passed contains number convertible types along with non-number convertible types, the **add()** method will add the valid input to the AroTable, ignoring the non-number convertible types:

```js
aroTable.add(1,'-2.1', 'three', -4, '5', null, 7.32, undefined, 'nine'); // Returns true
// In this case, 1, '-2.1', -4, '5', 7.32 are added to the AroTable, while all other non-number convertible typed values are ignored.
```

### The **returnArray()** Method

The **returnArray()** method returns an array representation of the AroTable:

```js
const aroTable = new AroTable(0.1, 2.05, '-3.53', -4, ['23.23', -133]);

aroTable.returnArray(); // Returns [ -133, -4, -3.53, 0.1, 2.05, 23.23 ]
```

### The **size()** Method

The **size()** method returns the amount of numbers held in the AroTable:

```js
const aroTable = new AroTable(-1, 2.5, '3');

aroTable.size(); // Returns 3
```

### The **remove()** Method

The **remove()** method takes the same kind of arguments as the [add()](#the-add-method) method and then removes an occurrence of any value—that exists in the AroTable—passed as an argument from the AroTable. Returns true if at least a value was removed successfully, returns false if not:

```js
const aroTable = new AroTable(2.3, -2.9, 2.21, 4, -4, -5.3, 4.832, 5, 6, 2);

aroTable.remove(1); // Returns false
aroTable.remove(2.21); // Returns true
aroTable.returnArray(); // Returns [ -5.3, -4, -2.9, 2, 2.3, 4, 4.832, 5,  6 ]
aroTable.remove(4, [5, 6], '2.3'); // Returns true
aroTable.returnArray(); // Returns [ -5.3, -4, -2.9, 2, 4.832 ]
```

### The **removeAll()** Method

The **removeAll()** method takes the same kind of arguments as the [add()](#the-add-method) method and removes all occurrences of any value—that exists in the AroTable—passed as an argument from the AroTable. Returns true if at least a value was removed successfully, returns false if not:

```js
const aroTable = new AroTable(2.1 ,2, -2.1, 4.33, -4, 5.1, 4.33, 5, 6, 2);

aroTable.removeAll(-7); // Returns false
aroTable.removeAll('2', [4.33, -2.1]); // Returns true
aroTable.returnArray(); // Returns [ -4, 2.1, 5, 5.1, 6 ]
```

### The **search()** Method

The **search()** method takes in a value (that can be converted to a valid number) argument and an optional second boolean argument, to perform two kinds of searches:

- **Lossless** - The default search type, explicitly specified by passing a second boolean argument with the value of `true`.  
  Returns results for the exact value passed as the first argument in an array with two values, the first shows the index the number first occurs in an array representation of the AroTable, and the second shows how many times it occurs.
- **Lossy** - The alternative search type, explicitly specified by passing a second boolean argument with the value of `false`.  
  Returns results for the integer reference of the value passed as the first argument in an array with two values, the first shows the index a number with the same integer portion first occurs in an array representation of the AroTable, and the second shows how many times such an occurrence appears.

```js
const aroTable = new AroTable(-4, '-0.78', -4.01, 3.981, -5.55, [-0.05, -3.4, -3, '0.64'], -4.678, '6.13',  5.79, 2, 0.56, -2.7);

// Lossless Search
aroTable.search(-3.4); // Returns [ 4, 1 ]
aroTable.search(2); // Returns [ 11, 1 ]
aroTable.search(5.79); // Returns [ 13, 1 ]
aroTable.search('-0.78') // Returns [ 7, 1 ]
aroTable.search(9); // Returns false

// Lossy Search
aroTable.search(-4.72, false) // Returns [ 1, 3 ]
aroTable.search(0, false) // Returns [ 9, 2 ]
aroTable.search(2.03, false) // Returns [ 11, 1 ]
aroTable.search('-3.81', false) // Returns [ 4, 2 ]
aroTable.search(9, false) // Returns false
```

### The **dropAny()** Method

The **dropAny()** method, is a higher-order method that takes in a callback function and removes all occurrences of any value in the AroTable that meets the condition specified in the callback function. Returns true if at least a value was removed successfully, returns false if not:

```js
const aroTable = new AroTable(2.7, 1.2, -2.4, 4, 5, 6.124, 8, -2, 9.993, 1, 0);

aroTable.dropAny(num => num <= 2); // Returns true
aroTable.returnArray(); // Returns [ 2.7, 4, 5, 6.124, 8, 9.993 ]
aroTable.dropAny(num => num % 2 == 0); // Returns true
aroTable.returnArray(); // Returns [ 2.7, 5, 6.124, 9.993 ]
aroTable.dropAny(num => num >= 10); // Returns false
aroTable.returnArray(); // Returns [ 2.7, 5, 6.124, 9.993 ]
```

### The **returnAny()** Method

The **returnAny()** method, is a higher-order method that takes in a callback function and returns any value in the AroTable that meets the condition specified in the callback function. Returns an array containing the number(s) that meet the condition, returns false if none could be found that fulfills the condition:

```js
const aroTable = new AroTable(2.7, 1.2, -2.4, 4, 5, 6.124, 8, -2, 9.993, 1, 0);

aroTable.returnAny(num => num <= 2); // Returns [ -2, -2.4, 0, 1, 1.2 ]
aroTable.returnAny(num => num % 2 == 0); // Returns [ -2, 0, 4, 8 ]
aroTable.returnAny(num => num >= 10); // Returns false
```

### The **clearDuplicates()** Method

The **clearDuplicates()** method removes all duplicated occurrences from the AroTable, leaving a single occurrence. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.clearDuplicates(); // Returns true
aroTable.returnArray(); // Returns [ -5.1, -2.343, -1, 3, 4, 6, 6.3 ]
aroTable.clearDuplicates(); // Returns false
aroTable.returnArray(); // Returns [ 1, 2.343, 4, 5.1, 6, 6.3 ]
```

### The **returnDuplicates()** Method

The **returnDuplicates()** method returns a sorted array of all numbers with duplicated occurrences in the AroTable, if none exists, returns false:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.returnDuplicates(); // Returns [ -2.343, 3, 4, 6.3 ]
aroTable.clearDuplicates();
aroTable.returnDuplicates(); // Returns false
```

### The **dropDuplicates()** method

The **dropDuplicates()** removes all numbers with multiple occurrences from the AroTable. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.dropDuplicates(); // Returns true
aroTable.returnArray(); // Returns [ -5.1, -1, 6 ]
aroTable.dropDuplicates(); // Returns false
```

### The **dropUnits()** Method

The **dropUnits()** method removes all numbers with a single occurrence from the AroTable. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.dropUnits(); // Returns true
aroTable.returnArray(); // Returns [ -2.343, -2.343, 3, 3, 3, 4, 6.3, 6.3 ]
aroTable.dropUnits(); // Returns false
```

### The **returnUnits()** Method

The **returnUnits()** method returns a sorted array of all numbers with a single occurrence in the AroTable, if none exists, returns false:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.returnUnits(); // Returns [ -5.1, -1, 6 ]
aroTable.dropUnits();
aroTable.returnUnits(); // Returns false
```

### The **dropPositives()** Method

The **dropPositives()** method removes all positive numbers from the AroTable. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.dropPositives(); // Returns true
aroTable.returnArray(); // Returns [ -5.1, -2.343, -2.343, -1 ]
aroTable.dropPositives(); // Returns false
```

### The **returnPositives()** Method

The **returnPositives()** method returns a sorted array of all positive numbers in the AroTable, if none exists returns false:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.returnPositives(); // Returns [ 3, 4, 6, 6.3 ]
aroTable.dropPositives();
aroTable.returnPositives(); // Returns false
```

### The **dropNegatives()** Method

The **dropNegatives()** method removes all negative numbers from the AroTable. Returns true if successful, returns false if not:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.dropNegatives(); // Returns true
aroTable.returnArray(); // Returns [ 3, 3, 3, 4, 4, 6, 6.3, 6.3 ]
aroTable.dropNegatives(); // Returns false
```

### The **returnNegatives()** Method

The **returnNegatives()** method returns a sorted array of all negative numbers in the AroTable, if none exists returns false:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.returnNegatives(); // Returns [ -5.1, -2.343, -1 ]
aroTable.dropNegatives();
aroTable.returnNegatives(); // Returns false
```

### The **getDistribution()** Method

The **getDistribution()** method returns an object showing the distribution of numbers in the AroTable:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.getDistribution(); // Returns { 'Positive Numbers': 8, 'Negative Numbers': 4 }
```

### The **empty()** Method

The **empty()** method wipes the AroTable clean, it has no return value:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

aroTable.empty();
aroTable.returnArray(); // Returns []
aroTable.getDistribution(); // Returns { 'Positive Numbers': 0, 'Negative Numbers': 0 }
```

> A better way to check if the AroTable is empty, is to use...

### The **isEmpty()** Method

The **isEmpty()** method returns true if the AroTable is empty, returns false if not:

```js
const aroTable = new AroTable(-1, -2.343, 3, 4, -2.343, 3, 4, -5.1, 6, 6.3, 6.3, 3);

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
