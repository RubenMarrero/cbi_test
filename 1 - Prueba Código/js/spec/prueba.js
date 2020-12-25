import serpiente from '../lib/problems/caracol';
import gps from '../lib/problems/gps';

describe('prueba', function() {
	it('test framework setup correct', function() {
		expect(true).toBe(true);
	});

	it('caracol', function() {
		expect(serpiente([])).toEqual([]);
		expect(serpiente([2])).toEqual(2);

		let array = [
			[1,2,3],
			[4,5,6],
			[7,8,9]
		];
		expect(serpiente(array)).toEqual([1,2,3,6,9,8,7,4,5]);

		array = [
			[ 1, 2, 3, 4,],
			[ 5, 6, 7, 8,],
		];
		expect(serpiente(array)).toEqual([1,2,3,4,8,7,6,5]);

		array = [
			[ 1, 2, 3, 4,],
			[ 5, 6, 7, 8,],
			[ 9,10,11,12,],
		];
		expect(serpiente(array)).toEqual([1,2,3,4,8,12,11,10,9,5,6,7]);

		array = [
			[ 1, 2, 3, 4,],
			[ 5, 6, 7, 8,],
			[ 9,10,11,12,],
			[13,14,15,16,]
		];
		expect(serpiente(array)).toEqual([1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10]);

		array = [
			[ 1, 2, 3, 4, 5],
			[ 6, 7, 8, 9,10],
			[11,12,13,14,15],
			[16,17,18,19,20],
			[21,22,23,24,25]
		];
		expect(serpiente(array)).toEqual([
			 1, 2, 3, 4,
			 5,10,15,20,
			25,24,23,22,
			21,16,11, 6,
			 7, 8,
			 9,14,
			19,18,
			17,12,
			13
		]);
	});

	it('GPS', function() {
		var roads = [
			{from: 0, to: 1, drivingTime: 5},
			{from: 0, to: 2, drivingTime: 10},
			{from: 1, to: 2, drivingTime: 10},
			{from: 1, to: 3, drivingTime: 2},
			{from: 2, to: 3, drivingTime: 2},
			{from: 2, to: 4, drivingTime: 5},
			{from: 3, to: 2, drivingTime: 2},
			{from: 3, to: 4, drivingTime: 10}
		];

        let [path,length] = gps(5,roads, 0, 4);
		expect(path).toEqual([0, 1, 3, 2, 4]);
		expect(length).toEqual(14);

		// empty graph
		// one edge
		// no start or end
		// no end
		// no start
		// 3 pathes
		// first path is the right one
		// last path is the right one
	});
});