export module Async {
	/**
	 * Map an array, using an async function
	 * @param array Array of elements to map
	 * @param f Async function that map an element of T0 to element of T1
	 * 
	 * @usage Async.map(media, async (el) => { ...el, ...{ type: await getMediaType(el.mid)} } )
	 */
	export function map<T0, T1>(array: T0[], f: (el: T0) => Promise<T1>): Promise<T1[]> {
		return Promise.all(array.map(f));
	}

	/**
	 * Map an array to another type containing a new field wich is the result of an async function
	 * @param array Array of elements
	 * @param fieldName Name of the field
	 * @param f Async function which populates the field
	 * 
	 * @usage Async.set(media, 'type', el => getMediaType(el.mid))
	 */
	export function set<T0>(array: T0[], fieldName: string, f: (el: T0) => Promise<unknown>): Promise<(T0 & any)[]> {
		return Async.map(array, (el: T0) => new Promise((resolve, reject) => {
			f(el).then(v => {
				const element = { ...el };
				element[fieldName] = v;
				resolve(element);
			}).catch(reject);
		}));
	}

	/**
	 * Iterate over an array asyncronusly
	 * @param array Array of elements to iterate over
	 * @param f Async function to call on each element
	 */
	export function forEach<T>(array: T[], f: (el: T) => Promise<void>): Promise<void[]> {
		return Promise.all(array.map(f));
	}
}
