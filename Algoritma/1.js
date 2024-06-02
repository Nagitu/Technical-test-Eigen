function reverseString(str) {
    
    var letters = str.match(/[a-zA-Z]/g);
    var numbers = str.match(/[0-9]/g);

    var reversedLetters = letters.reverse().join("");

    var result = reversedLetters + numbers.join("");

    return result;
}

var inputString = "INED1";
var reversedString = reverseString(inputString);
console.log("Hasil =", reversedString); 
