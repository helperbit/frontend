/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
