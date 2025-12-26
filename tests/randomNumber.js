function random_number() {
  //Code format shortcut: Shift+Alt+F
  const prompt = require('prompt-sync')({ sigint: true });
  let x = Math.floor(Math.random() * 10);
  var input = prompt('Guess a number : ');
  if (x == input) {
    console.log('Yeee! You guess a Correct number');
  } else if (input > x) {
    console.log('You guess a greater number!');
  } else {
    console.log('You guess a smaller number!');
  }
  console.log('random no : ' + x);
}
random_number();
