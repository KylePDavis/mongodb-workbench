"use strict";

angular.module("mw.components.words", [
	//deps
])


.directive("words", function() {
	return {
		scope: false,
		link: function(scope, element, attrs) {

			element.fadeOut(0);

			var words = attrs.words.split(/\s*,\s*/),
				i = 0,
				next = function next() {
					//TODO: remove jQuery from this (use `jqLite` or `zepto` or `bendc/sprint` or pure JS)
					element.text(words[i])
						.fadeIn(500)
						.delay(1000)
						.fadeOut(500, function() {
							if (++i >= words.length) i = 0;
							next();
						});
				};

			next();

		},
	};
});
