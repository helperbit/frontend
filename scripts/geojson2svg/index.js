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
