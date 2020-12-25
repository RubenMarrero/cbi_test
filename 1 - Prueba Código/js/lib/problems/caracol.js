"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = snail;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function snail(array) {
	if (1 === array.length) {
		return array[0];
	}

	if (0 === array.length) {
		return [];
	}

	var height = array.length - 1,
	    width = array[0].length - 1;


	var solution = [];
	for (var w = 0; w < width; w++) {
		solution.push(array[0][w]);
	}

	for (var h = 0; h < height; h++) {
		solution.push(array[h][width]);
	}

	for (var _w = width; _w > 0; _w--) {
		solution.push(array[height][_w]);
	}

	for (var _h = height; _h > 0; _h--) {
		solution.push(array[_h][0]);
	}

	var trimmed_array = [];
	for (var row = 1; row < height; row++) {
		trimmed_array.push(array[row]);
		trimmed_array[row - 1] = trimmed_array[row - 1].splice(1, width - 1);
	}

	solution.push.apply(solution, (0, _toConsumableArray3.default)(snail(trimmed_array)));
	return solution;
}