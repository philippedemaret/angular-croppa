/* --------------------------------------------------
 | Utilities for working with Croppa
 | 
 | This is an AngularJS directive to simplify using
 | Croppa in your AngularJS applications.
 |
 | Usage:
 | `<croppa src="path/to/image.png"></croppa>`
 -------------------------------------------------- */

angular.module('app').directive('croppa', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			src: '=src'
		},
		template: '<img ng-src="http://concierge-server.dev/_uploads/{{image}}" alt="">',
		link: function(scope, elem, attrs) {

			// Defaults
			var width  = attrs.width  || '_';
			var height = attrs.height || '_';
			var ext    = attrs.extension.replace('.', '') || 'png';
			var imageSrc;

			if (!scope.src) return; // Don't allow empty strings
			if (scope.src && typeof scope.src == 'number') {
				imageSrc = scope.src + '';  // typecast to string
			}
			if (attrs.width && attrs.width != '_') {
				width = Math.round(width);
			}
			if (attrs.height && attrs.height != '_') {
				height = Math.round(height);
			}

			// Produce the croppa syntax
			var suffix = '-'+width+'x'+height;

			// Add options.  If the key has no arguments (like resize), the key will be like [1]
			if (attrs.options && attrs.options instanceof Array) {
				var val, key;
				for (key in attrs.options) {
					val = attrs.options[key];

					// A simple string option
					if (typeof val == 'string') {
						suffix += '-'+val;
					}

					// An object like {quadrant: 'T'} or {quadrant: ['T']}
					else if (typeof val === 'object') {
						for (key in val) {
							val = val[key];
							if (val instanceof Array) suffix += '-'+key+'('+val.join(',')+')';
							else suffix += '-'+key+'('+val+')';
							break; // Only one key-val pair is allowed
						}
					}
				}
			}

			// Break the path apart and put back together again
			//return scope.src.replace(/^(.+)(\.[a-z]+)$/i, "$1"+suffix+"$2");

			imageSrc = imageSrc + '.' + ext;
			scope.image = imageSrc.replace(/^(.+)(\.[a-z]+)$/i, "$1"+suffix+"$2");
		}
	};
});