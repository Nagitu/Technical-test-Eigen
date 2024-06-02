function countWords(INPUT, QUERY) {
    const wordCount = {};
    INPUT.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });


    const result = QUERY.map(queryWord => {
        return wordCount[queryWord] || 0;
    });

    return result;
}

const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];
const output = countWords(INPUT, QUERY);
console.log(output); // Output: [1, 0, 2]
