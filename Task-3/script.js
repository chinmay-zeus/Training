let inp = document.querySelector("#in");
let output = document.querySelector("#output");

function multiply(number, result) {
  let carry = 0;
  for (let i = 0; i < result.length; i++) {
    let prod = result[i] * number + carry;
    result[i] = prod % 10;
    carry = Math.floor(prod / 10);
  }

  while (carry > 0) {
    result.push(carry % 10);
    carry = Math.floor(carry / 10);
  }

  return result;
}

function computeFactorial(n) {
  let result = [1];

  for (let i = 2; i <= n; i++) {
    result = multiply(i, result);
  }

  return result.reverse().join("");
}

function handleFactorial() {
  let n = parseInt(inp.value);
  if (isNaN(n) || n < 0) {
    output.innerText = "Please enter a valid non-negative number";
    return;
  }

  if (inp.value > 1000) {
    output.innerText = "Input too large, please enter a number less than or equal to 1000";
    return;
  }

  let ans = computeFactorial(n);
  output.innerText = ans;
  console.log(ans);
}
