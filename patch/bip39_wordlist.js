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

const fs = require('fs');
const fpath = 'node_modules/bip39/src/wordlists/';
const toRemove = [
	'chinese_simplified.json',
	'chinese_traditional.json',
	'french.json',
	'italian.json',
	'japanese.json',
	'korean.json',
	'spanish.json'
];


toRemove.forEach(p => {
	fs.writeFile(fpath + p, "[]", 'utf8', function (err) {
		if (err) return console.log(err);
	});
});

