function eval() {
    // Do not use eval!!!
    return;
}
let operators = ["+", "-", "*", "/", "^"];

// удаление пробелов
function removeSpaces(expr) {
    let re = /\s/g;
    return expr.replace(re, "");
}

// преобразование строки с выражением в массив
function toArray(expr) {
    let arr = [];
    let number = "";
    let i = 0;
    while (i < expr.length) {
        if (operators.includes(expr[i]) || expr[i] == "(" || expr[i] == ")") {
            if (number.length != 0) {
                arr.push(Number(number));
                number = "";
            }
            arr.push(expr[i]);
            i++;
        }
        else {
            number += expr[i];
            i++;
        }
    }
    if (number.length != 0)
        arr.push(Number(number));
    return arr;
}

// проверка выражения
function check(expr) {
    let state = 0;
    let brackets = 0;   // счетчик скобок
    let i = 0;          // индекс символа
    while (true) {
        switch (state) {
            case 0:
                if (i == expr.length - 1)   // последний символ
                    state = 2;
                else
                    if (expr[i] == "(") {
                        brackets++;
                        i++;
                        state = 0;
                    }
                    else
                        if (typeof expr[i] === "number") {
                            i++;
                            state = 1;
                        }
                        else {
                            return false;
                        }
                break;
            case 1:
                if (i == expr.length - 1)   //последний символ
                    state = 2;
                else
                    if (expr[i] == ")") {
                        brackets--;
                        if (brackets < 0) {
                            throw "ExpressionError: Brackets must be paired";
                        }
                        state = 1;
                        i++;
                    }
                    else
                        if (operators.includes(expr[i])) {
                            i++;
                            state = 0;
                        }
                        else {
                            return false;
                        }
                break;
            case 2:
                if (expr[i] == ")") {
                    brackets--;
                    if (brackets != 0) {
                        throw "ExpressionError: Brackets must be paired";
                    }
                    else {
                        return true;
                    }
                }
                else
                    if (brackets != 0) {
                        throw "ExpressionError: Brackets must be paired";
                    }
                    else
                        if (typeof expr[i] === "number") {
                            return true;
                        }
                        else {
                            return false;
                        }
                break;
        }
    }
}

// определение приоритета
function priority(el) {
    if (el == "^")
        return 3;
    else
        if (el == "*" || el == "/")
            return 2;
        else
            if (el == "+" || el == "-")
                return 1;
            else      // если число
                return 10;
}

// преобразование в постфиксную запись
function makePostfix(expr) {
    let temp = [];
    let postfix = [];
    for (i = 0; i < expr.length; i++) {
        if (expr[i] == "(")
            temp.push(expr[i]);
        else
            if (operators.includes(expr[i])) {
                if (temp.length == 0) {
                    temp.push(expr[i]);
                }
                else {
                    while (temp.length != 0 && priority(expr[i]) <= priority(temp[temp.length - 1]) && temp[temp.length - 1] != "(") {
                        postfix.push(temp.pop(temp.length - 1));
                    }

                    temp.push(expr[i]);
                }
            }
            else
                if (expr[i] == ")") {
                    while (temp[temp.length - 1] != "(") {
                        postfix.push(temp.pop(temp.length - 1));
                    }
                    temp.pop(temp.length - 1);
                }
                else
                    postfix.push(expr[i]);
    }

    while (temp.length != 0) {
        if (temp[temp.length - 1] != "(")
            postfix.push(temp.pop(temp.length - 1));
        else
            temp.pop(temp.length - 1);
    }
    return postfix;
}

// вычисление выражения
function calculate(postfix) {
    let temp = [];
    let op1;
    let op2;
    for (i = 0; i < postfix.length; i++) {
        if (operators.includes(postfix[i])) {
            switch (postfix[i]) {
                case "+":
                    op1 = temp.pop(temp[temp.length - 1]);
                    op2 = temp.pop(temp[temp.length - 1]);
                    temp.push(op1 + op2);
                    break;
                case "-":
                    op1 = temp.pop(temp[temp.length - 1]);
                    op2 = temp.pop(temp[temp.length - 1]);
                    temp.push(op2 - op1);
                    break;
                case "*":
                    op1 = temp.pop(temp[temp.length - 1]);
                    op2 = temp.pop(temp[temp.length - 1]);
                    temp.push(op1 * op2);
                    break;
                case "/":
                    op1 = temp.pop(temp[temp.length - 1]);
                    if (op1 == 0)
                        throw "TypeError: Division by zero.";
                    op2 = temp.pop(temp[temp.length - 1]);
                    temp.push(op2 / op1);
                    break;
                case "^":
                    op1 = temp.pop(temp[temp.length - 1]);
                    op2 = temp.pop(temp[temp.length - 1]);
                    temp.push(Math.pow(op1, op2));
                    break;
            }
        }
        else
            temp.push(Number(postfix[i]));
    }
    return temp[0];
}

function expressionCalculator(expr) {
    let arr = toArray(removeSpaces(expr));
    if (check(arr))
        return calculate(makePostfix(arr));

    else
        throw "Invalid expression!";
}

module.exports = {
    expressionCalculator
}