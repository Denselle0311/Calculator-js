const buttons = document.querySelectorAll('.rows span');
const display = document.querySelector('.display .numbers');
const resultDisplay = document.querySelector('.display .result');
const delBtn = document.querySelector('span[data-delete]');

let leftNum = '0';
let rightNum = '';
let operator = '';
let isCalculated = false;
let isLeftNum = true;
let isRightNum = false;
let isOp = false;
let results;

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

function addDisplay(input) {
  display.textContent += input;
}

function updateResult(input) {
  resultDisplay.textContent += input;
}

function handleNumbers(num) {
  delBtn.textContent = 'CE';
  if(isLeftNum) {
    if(leftNum.includes('.') && num == '.'
        || leftNum.includes('%')) return
    if(isCalculated && !isOp) {
      leftNum = num;
      renderDisplay(num);
      isCalculated = false;
      return
    }
    //if leftnum is zero replace it wt empty string
    leftNum = leftNum == '0' && num != '.' ? '' : leftNum;
    leftNum += num;

    console.log(leftNum)
    renderDisplay(leftNum);
  }
  else if(isRightNum) {
    let last = getLastDisplay().split(' ').at(-1);

    let isPeriod = getLastDisplay().split(' ').at(-1).includes('.');
    if(isPeriod && num == '.'
        || last.includes('%')) return
    // find zero in lastdisplay & return if there is already
    let lastDisplay = getLastDisplay().split(' ');
    let lastIndex = lastDisplay.length - 1;
    let isThereOp =  isAlreadyExist(operator); 
    let onlyZero = lastDisplay[lastIndex] == '0';

    if(rightNum == '0' && num == '0') return
    if(rightNum == '0' && num != '0') {
      rightNum = num;
      lastDisplay.splice(lastIndex,1); // remove zero
      lastDisplay = `${lastDisplay.join(' ')} ${rightNum}`;
      renderDisplay(lastDisplay);
      console.log(rightNum)
      return
    }
    // onlyzero then remove it
    // if(onlyZero && num != '.') lastDisplay.splice(lastIndex,1);
    // lastDisplay = lastDisplay.join(' ');
    // if there is zero in display replace it & add space
    console.log(onlyZero)
    if(onlyZero) {
      if(!isPeriod && num != '.') {
        rightNum = ` ${num}`;
      } else if(num == '.') {
        rightNum += num;
      }
    } else if(isThereOp) {
      rightNum = num;
      addDisplay(` ${rightNum}`)
      console.log(rightNum);
      return
    }
    // rightNum = onlyZero && !isPeriod && num != '.' ? ' ' + num 
    //   : onlyZero && num == '.' ? num
    //   : isThereOp ? ' ' + num
    //   : num;
    console.log(rightNum);
    rightNum += num;
    addDisplay(num);
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
  const bod = ['/','x','%','-','+'];
  let left;
  let right;
  let op;
  let result;
  let lastDisplay;

  const eq = percent(last).join(' ').split(' ').filter(e => e != '');
  console.log(eq)
  for(let i = 0; i < bod.length; i++) {
    while(eq.includes(bod[i])) {
      let opIndex = eq.findIndex(e => e === bod[i]);
      left = eq[opIndex - 1];
      op = eq[opIndex];
      right = eq[opIndex + 1];

      //if(!(left && right && op)) return
      console.log(op)
      result = equal(left,op,right);
      results = result;
      // shift result to left
      eq.splice(opIndex - 1,3,result);
    }
    
  }
  if(result == undefined) return
  lastDisplay = getLastDisplay();
  renderDisplay(result.toFixed(6) * 1);
  resultDisplay.textContent ='';
  updateResult(lastDisplay);
  // console.log(lastDisplay)
  // console.log(eq)
}

function checkOperator(op) {
  let lastDisplay = getLastDisplay();
  let findPer = lastDisplay.split('');
  let rightFind = findPer.join('').split(' ');

  if(op == '%') {
  
  if(!isOp && isLeftNum) {
    if(leftNum.split('').at(-1) == op) return
    leftNum += op;
    lastDisplay = leftNum;
  }
  if(isRightNum) {
    if(rightNum.split('').at(-1) == op) return

    rightNum += op;
    lastDisplay += op;
  }

    renderDisplay(lastDisplay);
    return
  }
  // if there is similar op return else there is already and not same op replace
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
  // update result
  if(!isLeftNum && isCalculated) {
    resultDisplay.textContent = '';
    updateResult(lastDisplay);
  }
  lastDisplay += ` ${op}`;
  renderDisplay(lastDisplay);

  isOp = true;
  isLeftNum = false;
  isRightNum = true;
  isCalculated = false;
}

function getLastDisplay() {
  return display.textContent
}

function equal(num1,op,num2) {
  let result = 0;
  switch(op) {  
    case 'x' : result = +num1 * +num2;
      break
    case '/' : result = +num1/ +num2;
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
  leftNum = result.toString();
  rightNum = '';
  delBtn.textContent = 'AC';
  console.log('equal ' + result);
  return result;
}

function percent(last) {
let lastDisplay = last.join('').split(' ');
  const arr = [];
  lastDisplay.forEach(e => {
      arr.push(e)
  });
  return arr.reduce((acc,curr,i) => {
    let num = curr.split('');
    
    if(curr.includes('%')) {
      num = num.filter(e => e != '%').join('');
      curr = +num;
      curr = curr / 100;
      if(i > 0) {
        acc[i] = acc[0] * curr;
      } else {
        acc[i] = curr;
      }
    } else {
      acc[i] = curr;
    }
    return acc;
  }, []);
}

function back() {
  console.log(delBtn)
  let lastDisplay = getLastDisplay().split('');
  let index = lastDisplay.length -1;
  let d = lastDisplay.lastIndexOf(operator);
  let Nan = results == 'NaN';
  if(Nan) {
    renderDisplay('0');
    return
  }
  if(isCalculated) {
    delBtn.textContent = 'CE';
    renderDisplay('0');
    resultDisplay.textContent = '';
    leftNum = '0';
    rightNum = '';
    return
  }

  if(index == d) {
    lastDisplay.splice(d-1,2);
    // lastDisplay.splice(-1,1);
    
    console.log(lastDisplay)
    renderDisplay(lastDisplay.join(''));
    return
  }
  
  if(isLeftNum) {
    if(leftNum.length ==  1)  {
      leftNum = '0';
      renderDisplay(leftNum);
      console.log('zero')
      return
    }
    let left = leftNum.split('');
    left.splice(-1,1);
    leftNum = left.join('');
    renderDisplay(leftNum)
    return
  } 
  else if(isRightNum) {
    let display = lastDisplay.join('').split(' ');
    let last = display.at(-1);
    if(display.length == 1) {
      isLeftNum = true;
      isOp = false;
      isRightNum = false;

      if(leftNum.length == 1) {
          leftNum ='0'
      } else {
          let l = leftNum.split('');
          l.splice(-1,1);
          leftNum = l.join('');
      }


      renderDisplay(leftNum);
      return
    }
    if(last.length == 1) {
      lastDisplay.splice(-1,1);
    }
    let right = rightNum.split('');
    right.splice(-1,1);
    rightNum = right.join('');
    lastDisplay.splice(-1,1);
    console.log(lastDisplay)
    renderDisplay(lastDisplay.join(''));
    return
  }
}

window.onload = () => renderDisplay(leftNum);