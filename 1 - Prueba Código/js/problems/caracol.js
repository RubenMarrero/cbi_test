/*
  	Dado un array nxn, devuelve los elementos ordenados de fuera hacia dentro
	en espiral en el sentido de las agujas del reloj.

		let array = [
			[ 1, 2, 3, 4, 5],
			[ 6, 7, 8, 9,10],
			[11,12,13,14,15],
			[16,17,18,19,20],
			[21,22,23,24,25]
		];
	Ejemplo:
	array = [[1,2,3],
             [4,5,6],
             [7,8,9]]
	snail(array) #=> [1,2,3,6,9,8,7,4,5]

	Nota: El objetivo NO es ordenar los elementos de menor a mayor, sino recorrer
	la matriz en espiral.
	Nota: La matriz 0x0 se representa como [[]]
*/

export default function snail(array) {
	if (  1 === array.length) {
		return array[0];
	}

	if (  0 === array.length) {
		return [];
	}

	let [height, width] = [ array.length - 1 , array[0].length - 1 ];
	
	let solution = [];
	for (let w = 0; w < width; w++) {
		solution.push(array[0][w]);
	}

	for (let h = 0; h < height; h++) {
		solution.push(array[h][width]);
	}

	for (let w = width; w > 0; w--) {
		solution.push(array[height][w]);
	}

	for (let h = height; h > 0; h--) {
		solution.push(array[h][0]);
	}

	let trimmed_array = [];
	for (let row = 1; row < height; row++) {
		trimmed_array.push(array[row]);		
		trimmed_array[row-1] = trimmed_array[row-1].splice(1,width-1);
	}

	solution.push(...snail(trimmed_array));
	return solution;
}