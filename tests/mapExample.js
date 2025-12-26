console.log('==================1st example of map function=============');
let arr = [10, 20, 30];
let a = arr.map((value, index, array) => {
  console.log(value, index, array);
  return value + 1;
});
console.log(a);
console.log('==================2nd example of map function=============');
let numbers = [1, 2, 3];
const updatedNumbers = numbers.map((e) => e * 2);
console.log(updatedNumbers);
console.log('==================1st example of filter function=============');
let arr2 = [10, 20, 30, 0, 3, 5];
let a2 = arr2.filter((value) => {
  return value < 10;
});
console.log(a2);
