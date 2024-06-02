function diagonalDifference(matrix) {
  
    let diagonal1 = 0;
    let diagonal2 = 0;

    
    for (let i = 0; i < matrix.length; i++) {
        diagonal1 += matrix[i][i]; 
        diagonal2 += matrix[i][matrix.length - 1 - i]; 
    }

    
    return Math.abs(diagonal1 - diagonal2);
}


const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

const result = diagonalDifference(matrix);
console.log(result);
