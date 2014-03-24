var gutil = require('gulp-util');

module.exports = function() {
	if(!arguments) {
		return;
	}

	arguments.map(function(output) {
		if(output) {
			gutil.log(output);
		}
	});
};