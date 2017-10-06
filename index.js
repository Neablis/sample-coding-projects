let passedTests = 0;
let failedTests = 0;

const checker = (name, func, input, output) => {
  console.log(`\x1b[37m running: ${name}`);
  let results = func.apply(this, input);

  if (JSON.stringify(results) === JSON.stringify(output)) {
    passedTests += 1;
    console.log("\x1b[32m > Success");
  } else {
    failedTest += 1;
    console.log(`\x1b[31m > Error: Got ${results}, expected ${output}`);
  }
}

// 1. Determine if sorted array of integers in monotonic(never decreases or never increases)

const monoCheck = (arr) => {
  let ascending = null;

  for (let x = 1; x < arr.length; x++) {
    let previous = arr[x-1];
    let current = arr[x];

    if (current === previous) continue;

    if (ascending === null) {
      ascending = (previous < current ? 1 : -1);
    } else if (ascending === 1 && current < previous) {
      return false;
    } else if(ascending === -1 && current > previous) {
      return false;
    }
  }

  return true;
};

// Tests

checker('mono ascending', monoCheck, [[1,2,3,4]], true);
checker('mono descending', monoCheck, [[4,3,2,1]], true);
checker('mono same', monoCheck, [[1,1,1,1]], true);
checker('mono ascending 2', monoCheck, [[1,1,1,2]], true);

checker('mono ascending same', monoCheck, [[1,2,2,3]], true);
checker('mono descending same', monoCheck, [[3,2,2,1]], true);
checker('mono false', monoCheck, [[1,2,3,1]], false);


// 2. Given a 2D array of empty spaces, walls, and gates, mark each empty space with the number of cardinal moves it would take to reach the nearest gate

// INF  -1  0  INF
// INF INF INF  -1
// INF  -1 INF  -1
//   0  -1 INF INF

const wallsGates = [
  [
    ['O', '|', 'H', 'O'],
    ['O', 'O', 'O', '|'],
    ['O', '|', 'O', '|'],
    ['H', '|', 'O', 'O'],
  ],
  [
    ['H', '|', 'H', 'O'],
    ['O', 'O', 'O', 'O'],
    ['O', '|', '|', 'O'],
    ['H', '|', 'H', 'O'],
  ]
]

const wallsGatesAnswer = [
  [
    [3,   '|', 'H', 1],
    [2,    2,   1, '|'],
    [1,   '|',  2, '|'],
    ['H', '|',  3,  4]
  ],
  [
    ['H', '|', 'H',  1],
    [ 1,   2,   1,   2],
    [ 1,  '|', '|',  2],
    ['H', '|', 'H',  1],
  ]
]

const findPaths = (wallsGates) => {
  const OPEN = 'O';
  const WALL = '|';
  const GATE = 'H';

  function setDistances(rooms, i, j, dist) {
     if(i >= 0 && i < rooms.length && j >= 0 && j < rooms[i].length) {
       if(rooms[i][j] === WALL || rooms[i][j] < dist) return;

       if (rooms[i][j] === GATE) {
         setDistances(rooms, i + 1, j, dist + 1);
         setDistances(rooms, i - 1, j, dist + 1);
         setDistances(rooms, i, j + 1, dist + 1);
         setDistances(rooms, i, j - 1, dist + 1);

         return;
       }

       if(rooms[i][j] === OPEN || rooms[i][j] > dist) {
         rooms[i][j] = dist;
       }

       setDistances(rooms, i + 1, j, dist + 1);
       setDistances(rooms, i - 1, j, dist + 1);
       setDistances(rooms, i, j + 1, dist + 1);
       setDistances(rooms, i, j - 1, dist + 1);
     }
   }

  let queue = [];
  let rowLen = wallsGates.length;
  if (rowLen === 0) {
      return;
  }

  let colLen = wallsGates[0].length;

  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      if (wallsGates[i][j] === GATE) {
        queue.push([i, j]);
      }
    }
  }

  for (let x = 0; x < queue.length; x++) {
    setDistances(wallsGates, queue[x][0], queue[x][1], 0);
  }

  return wallsGates;
}

// Tests
for (let x = 0; x < wallsGates.length; x++) {
  checker(`findPaths ${x}`, findPaths, [wallsGates[x]], wallsGatesAnswer[x]);
}

// 3. Determine if a simplified regex and subject string are a match. Simplified regex consists of alpha characters(a-z), '.' which maps to any 1 character, and '_*' where '_' is a letter and '*' means 0 or more matches of that letter.
// e.g. 'a*b', 'aaaaab' == match, 'a*b', 'b' == match

const regexChecker = (reg, str) => {
  if (reg.length === 1) return true;

  const operations = reg.split('');
  const strArray = str.split('');
  const allowedOperations = ['.', '*'];
  let lastChar = null;

  while (operations.length !== 0) {
    const operation = operations.shift();

    if (operation === '.') {
      if (strArray.length === 0) {
        return false;
      }
      strArray.shift();
    } else if (operation === '*'){
      const first = lastChar;
      let end = false;

      while (!end) {
        const next = strArray[0];
        if (next === undefined) {
          return true;
        } else if (first !== next)  {
          end = true;
        } else {
          strArray.shift();
        }
      }
    } else {
      lastChar = strArray.shift();
      if ( lastChar !== operation) {
        return false;
      }
    }
  }

  if (strArray.length !== 0) return false;

  return true;
};

// Tests

checker('regexChecker single *', regexChecker, ['a*', 'a'], true);
checker('regexChecker multiple *', regexChecker, ['a*', 'aaaaaa'], true);
checker('regexChecker multiletters *', regexChecker, ['a*b', 'aaaaab'], true);
checker('regexChecker single .', regexChecker, ['.b', 'ab'], true);
checker('regexChecker . and *', regexChecker, ['.b*', 'abbb'], true);
checker('regexChecker many .', regexChecker, ['...', 'aba'], true);
checker('regexChecker long', regexChecker, ['a*...b*', 'aaaaabbbb'], true);

checker('regexChecker single * false', regexChecker, ['a*', ''], false);
checker('regexChecker multiletters * false', regexChecker, ['a*b', 'aaaaabbb'], false);
checker('regexChecker single . false', regexChecker, ['.b', 'aab'], false);
checker('regexChecker . and * false', regexChecker, ['.b*', 'aabbb'], false);
checker('regexChecker many . false', regexChecker, ['...', 'abaa'], false);
checker('regexChecker long false', regexChecker, ['a*...b*', 'baaaaabbbb'], false);

// 4. Given 2 sorted arrays, one of length N with W integers and one of length 2N of W integers, merge the two

const mergeSorter = (arr1, arr2) => {
  let pos1 = 0;
  let pos2 = 0;
  const arr3 = [];

  while (pos1 !== arr1.length || pos2 !== arr2.length) {
    if (arr1[pos1] <= arr2[pos2]) {
      arr3.push(arr1[pos1]);
      pos1 += 1;
    } else {
      arr3.push(arr2[pos2]);
      pos2 += 1;
    }
  }

  return arr3;
};

// Tests

checker('mergeSorter 1', mergeSorter, [[1,2,3], [1,1,2,2,3,3]], [1,1,1,2,2,2,3,3,3]);
checker('mergeSorter 2', mergeSorter, [[1,1,1], [2,2,2]], [1,1,1,2,2,2]);
checker('mergeSorter 3', mergeSorter, [[], [2,2,2]], [2,2,2]);

// 5. Given a binary tree, and a point to a node in that tree, construct an array of the remaining elements(ascending).

class BinarySearchTree {
  constructor () {
    this.root = null;
  }

  Node (val) {
    return {
      value: val,
      left: null,
      right: null
    }
  }

  push (val) {
    var root = this.root;

    if(!root){
      this.root = this.Node(val);
      return;
    }

    var currentNode = root;
    var newNode = this.Node(val);

    while(currentNode){
      if(val < currentNode.value) {
          if(!currentNode.left){
             currentNode.left = newNode;
             break;
          }
          else{
             currentNode = currentNode.left;
        }
      } else {
         if(!currentNode.right){
            currentNode.right = newNode;
            break;
         }
         else{
            currentNode = currentNode.right;
         }
      }
    }

    return newNode;
  }

  dfs(node) {
    if (node === undefined) {
      node = this.root;
    }

    if(node){
      console.log(node.value);
      this.dfs(node.left);
      this.dfs(node.right);
    }
  }

  inorder(n) {
    const retArray = [];

    const storeInOrder = (node) => {
      if (node === undefined) {
        node = this.root;
      }

      if(node){
        storeInOrder(node.left);
        retArray.push(node.value);
        storeInOrder(node.right);
      }
    }

    storeInOrder(n);

    return retArray;
  }
}

var bst = new BinarySearchTree();

bst.push(1);
bst.push(5);
bst.push(4);
let node = bst.push(2);
bst.push(7);
bst.push(5);
bst.push(2);
bst.push(9);
bst.push(15);
bst.push(3);
bst.push(7);
bst.push(10);

// 6. How would you handle localization for a page? As an example, facebook had a function called 'get_page_title()' that checked the localization string and returned a value. This was a problem, as the function contained hundreds of lines from the switch statement. Should move towards externalization, go on to talk about template strings('Happy Birthday, Mitchell'), might talk about language engine issues('A banana' vs 'An apple' vs 'They waited for an ambulance' vs 'He waited for the car', etc)

// 7. Given a 2D array of '0's and '1's, count the number of islands. Islands are '1's surrounded by water('0's) in all cardinal directions

const islands = [
  [
    ['0','0', '0', '0','1'],
    ['1','1', '0', '0','1'],
    ['1','1', '0', '0','1'],
    ['0','0', '0', '0','1'],
    ['0','1', '1', '0','1'],
  ],
  [
    ['0','0', '0', '0','1'],
    ['1','1', '0', '0','1'],
    ['1','1', '0', '0','1'],
    ['0','0', '0', '0','1'],
    ['0','1', '1', '1','1'],
  ],
  [
    ['1','0', '1', '0','1'],
    ['0','0', '0', '1','1'],
    ['1','1', '0', '0','1'],
    ['0','0', '0', '1','1'],
    ['0','1', '1', '0','1'],
  ],
  [
    ['1','0', '1', '0','1'],
    ['0','1', '0', '1','0'],
    ['1','0', '1', '0','1'],
    ['0','1', '0', '1','0'],
    ['1','0', '1', '0','1'],
  ],
  [
    ['1','1', '1', '1','0'],
    ['1','1', '0', '1','0'],
    ['1','1', '0', '0','1'],
    ['1','1', '0', '0','0'],
    ['0','0', '0', '0','0'],
  ],
  [
    ['1','1', '0', '0','0'],
    ['1','1', '0', '0','0'],
    ['0','0', '1', '0','0'],
    ['0','0', '0', '1','1'],
  ],
];

const islandAnswers = [3, 2, 5, 13, 2, 3];

const countIslands = (islands) => {
  let visited = 0;

  const flipIslands = (islands, i, j) => {
    const [len, len1] = [islands.length, islands[0].length];
    if (i >= len || j >= len1 || i < 0 || j < 0) {
      return;
    }

    if (islands[i][j] === '1') {
      islands[i][j] = '0';
      flipIslands(islands, i - 1, j, len, len1);
      flipIslands(islands, i, j - 1, len, len1);
      flipIslands(islands, i + 1, j, len, len1);
      flipIslands(islands, i, j + 1, len, len1);
    }
  }

  for (let x = 0; x < islands.length; x++) {
    for (let y = 0; y < islands[x].length; y++) {
      if (islands[x][y] === '1') {
        visited += 1;
        flipIslands(islands, x, y);
      }
    }
  }

  return visited;
}


// Tests
for (let x = 0; x < islandAnswers.length; x++) {
  checker(`countIslands ${x}`, countIslands, [islands[x]], islandAnswers[x]);
}

console.log(`\x1b[32m > ${passedTests} Successes`);
console.log(`\x1b[31m > ${failedTests} Failures`);
