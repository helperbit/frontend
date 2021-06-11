import { Async } from "./async";

describe('Async Helper', () => {
	it('should run map', async () => {
		const na = await Async.map([1, 2, 3], (el: number) => new Promise((resolve, reject) => resolve(el * 2)));
		expect(na).toEqual([2, 4, 6]);
	});

	it('should run set', async () => {
		const na = await Async.set([{ n: 1 }, { n: 1 }, { n: 1 }], 'c', (el) => new Promise((resolve, reject) => resolve(el.n * 2)));
		expect(na).toEqual([{ n: 1, c: 2 }, { n: 1, c: 2 }, { n: 1, c: 2 }]);
	});

	it('should run foreach', async () => {
		let a = 0;
		await Async.forEach([1,2,3], n => { 
			return new Promise((resolve, reject) => { 
				a += n;
				resolve();
			});
		})
		expect(a).toBe(6);
	});
});