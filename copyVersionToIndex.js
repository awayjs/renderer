'use strict';
exports.__esModule = true;
const fs = require('fs');

// read in the /index.ts

// use regex to find a console log for printing the version and update it for the new version

// update /index.ts with the new content

console.log('update src/index.ts with version:', process.env.npm_package_version);

fs.readFile('./index.ts', 'utf8', function(err, data) {
	if (err) throw err;
	const re = /(.*[a-zA-Z]\s-\s)(.*)(["|']\);.*)/;
	//console.log("before", data)
	//#BUILD_VIA_NPM_VERSION_PATCH_TO_DISPLAY_VERSION_HERE#", process.env.npm_package_version);
	data = data.replace(re, '$1' + process.env.npm_package_version + '$3');
	//console.log("after", data)
	fs.writeFile('./index.ts', data, function(err) {
		if (err) throw err;
		console.log('Updated ./index.ts with inserted version ', process.env.npm_package_version);
	});
});