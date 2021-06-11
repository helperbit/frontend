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

var geojson2svg = require('geojson2svg');

var converter = geojson2svg(
  {
    viewportExtent: {width: 200, height: 200}, 
    mapExtent: {left: -90, bottom: -90, right: 90, top: 90},
    output: 'svg',
    fitTo: 'width',
    "attributes": {"style": "fill: #cf202e"}
  }
);


var fs = require ('fs');


fs.readFile('country.geojson', function (err, data) {
	var geo = JSON.parse(data);

	geo.features.forEach (function (item) {
		console.log (item.properties.code);
		var pathData = converter.convert(item.geometry);
		fs.writeFile ('out/'+item.properties.code+'.svg', '<svg>'+pathData[0]+'</svg>');
	});
});
