'use strict';

var gutil = require('gulp-util');

module.exports = function() {
	if(!arguments) {
		return;
	}

	var args = Array.prototype.slice.call(arguments);
	args.map(function(output) {
		if(output) {
			gutil.log(output);
		}
	});
};
