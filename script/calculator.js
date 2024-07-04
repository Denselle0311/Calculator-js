const buttons = document.querySelectorAll('.rows span');
const display = document.querySelector('.display .numbers');
const resultDisplay = document.querySelector('.display .result');

let leftNum = '0';
let rightNum = '0';
let operator = '';
let isCalculated = false;
let isLeftNum = true;
let isRightNum = false;
let isOp = false;

buttons.forEach(item => {
  item.addEventListener('click', e => {
    let target = e.currentTarget.dataset;
    const log = e => console.log(e);
    if(target.symbol) {
      if(target.symbol == 'parenthesis-l') {
        log('parenthesis L')
      } 
      else if(target.symbol == 'parenthesis-r') {
        log('parenthesis R')
      }
    }
    else if(target.number) {
      switch(target.number) {
        case '1' : handleNumbers('1');  
        break
        case '2' : handleNumbers('2');
        break
        case '3' : handleNumbers('3');
        break
        case '4' : handleNumbers('4');
        break
        case '5' : handleNumbers('5');
        break
        case '6' : handleNumbers('6');
        break
        case '7' : handleNumbers('7');
        break
        case '8' : handleNumbers('8');
        break
        case '9' : handleNumbers('9');
        break
        case '0' : handleNumbers('0');
        break
        case '.' : handleNumbers('.');
        break
      }
    }
    else if(target.operator) {
      let isOpExist = isAlreadyExist(operator);
      // if(isOpExist) {
      //   let lastDisplay = getLastDisplay();
      //   let index = lastDisplay.indexOf(operator);
      //   renderDisplay(replace);
      //   return    
      // }
      isOp = true;
      isLeftNum = false;
      isRightNum = true;
      isCalculated = false;
      operation(target.operator);
      console.log(isOp)
    }
    else if(target.delete) {
      back();
    }
  })
})

function renderDisplay (input) {
  display.textContent = input;
}

function updateResult(input) {
  resultDisplay.textContent += input;
}

function handleNumbers(num) {
  if(isLeftNum) {
    if(isCalculated && !isOp) {
      leftNum = num;
      renderDisplay(num);
      isCalculated = false;
      return
    }
    //if leftnum is zero replace it wt empty string
    leftNum = leftNum == '0' ? '' : leftNum;
    leftNum += num;

    console.log(leftNum)
    renderDisplay(leftNum);
  }
  else if(isRightNum) {
    // find zero in lastdisplay & return if there is already
    let lastDisplay = getLastDisplay().split(' ');
    let lastIndex = lastDisplay.length - 1;
    let isThereOp =  isAlreadyExist(operator); 
    let includesZero = lastDisplay[lastIndex].includes('0');

    if(includesZero && num == '0') return
    if(includesZero) lastDisplay.splice(lastIndex,1);
    lastDisplay = lastDisplay.join(' ');
    // if there is zero in display replace it & add space
    rightNum = includesZero ? ' ' + num 
      : isThereOp ? ' ' + num
      : num;
    lastDisplay += rightNum;
    
    renderDisplay(lastDisplay);
  }
}


function operation(op) {
  switch(op) {
    case '+' : operator = '+';
                checkOperator(op);
    break
    case '-' : operator = '-';
                checkOperator(op);
    break
    case '/' : operator = '/';
                checkOperator(op);
    break
    case '*' : operator = 'x';
                checkOperator('x');
    break
    case '%' : operator = '%';
                checkOperator(op);
    break
    case '=' : bodmas();
    break
  }
}

function isAlreadyExist(input) {
  const lastDisplay = getLastDisplay().split(' ');
  const c = lastDisplay.filter(e => e != '' );
  let index = c.length -1;
  let d = lastDisplay.indexOf(input);
  let l = lastDisplay.lastIndexOf(input);
  return d == index || l == index
}

function bodmas() {
  let last = getLastDisplay().split('');
  let toCompute = last.some(e => e == operator);
  if(!toCompute) return
  const eq = display.textContent.split(' ').filter(e => e != '');
  const bod = ['/','x','%','-','+'];
  let left;
  let right;
  let op;
  let result;
  let lastDisplay;
  
  for(let i = 0; i < bod.length; i++) {
    while(eq.includes(bod[i])) {
      let opIndex = eq.findIndex(e => e === bod[i]);
      left = eq[opIndex - 1];
      op = eq[opIndex];
      right = eq[opIndex + 1];

      result = equal(left,op,right).toFixed(4);
      // shift result to left
      eq.splice(opIndex - 1,3,result);
    }
    
  }
  lastDisplay = getLastDisplay();
  renderDisplay(result);
  resultDisplay.textContent ='';
  updateResult(lastDisplay);
  // console.log(lastDisplay)
  // console.log(eq)
}

function checkOperator(op) {
  let lastDisplay = getLastDisplay();
  if(isOp) {
    const opers = ['/','x','%','-','+'];
    const temp = lastDisplay.split(' ');
  
    let l = temp[temp.length -1];
    
    if(l == operator) {
      return
    }

    for(let i = 0; i < opers.length; i++) {
      while(temp.includes(opers[i])) {
        let opTrue = temp[temp.length-1] == opers[i];
        let opIndex = opTrue ? temp.length-1 : 'number';
        let opL = temp[opIndex];

        if(opL != operator && opIndex != 'number') {
          temp.splice(opIndex,1,op);
          renderDisplay(temp.join(' '));
          return
        }
        break;
      }
    }
  }
  // get lastdisplay to concatonate display and operator
  if(!isLeftNum && isCalculated) {
    resultDisplay.textContent = '';
    updateResult(lastDisplay);
  }
  lastDisplay += ` ${op}`;
  renderDisplay(lastDisplay);
}

function getLastDisplay() {
  return display.textContent
}

function equal(num1,op,num2) {
  let result = 0;
  switch(op) {  
    case 'x' : result = +num1 * +num2;
    break
    case '/' : result = +num1 / +num2;
    break
    case '%' : result = +num1 % +num2;
    break
    case '-' : result = +num1 - +num2;
    break
    case '+' : result = +num1 + +num2;
    break
  }
  isLeftNum = true;
  isRightNum = false;
  isOp = false;
  isCalculated = true;
  console.log('equal ' + result);
  return result;
}

function back() {
  let lastDisplay = getLastDisplay().split('');
  let Nan = lastDisplay.join('') == 'NaN';
  if(Nan) {
    renderDisplay('0');
    return
  }
  isCalculated = false;
  // let leftLast = lastDisplay[0];
  // let opLast = lastDisplay[1];
  // let rightLast = lastDisplay[2];
  
  if(isLeftNum) {
    if(lastDisplay.length ==  1)  {
      leftNum = '0';
      lastDisplay = leftNum;
      renderDisplay(lastDisplay);
      console.log('zero')
      return
    }
    let left = lastDisplay;
    left.splice(-1,1);
    lastDisplay = left.join('');
    renderDisplay(lastDisplay)
    return
  }
  let index = lastDisplay.length -1;
  let d = lastDisplay.indexOf(operator);
  if(index == d) isLeftNum = true;

  lastDisplay.splice(index,1);
  console.log(d == index);
  let space = lastDisplay[index -1].includes(' ');
  if(space != undefined && space) {
    console.log('spcae')
    lastDisplay.splice(index -1, 1);
  }
  console.log(lastDisplay)
  renderDisplay(lastDisplay.join(''));
}

window.onload = () => renderDisplay(leftNum);