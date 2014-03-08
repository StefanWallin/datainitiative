//= require angular
var app = angular.module('Creator', [])
.controller('ApplicationController', function($scope){
	$scope.canvas  = { id: "canvas", 'nested': false, 'startY': 0, 'startX': 0, 'x': -3000, 'y': -3000, scale: 1 };
	$scope.shapes = [
		{ id: 'entity_0', 'nested': true, 'startY': 0, 'startX': 0, 'x': 3450, 'y': 3200 },
		{ id: 'entity_1', 'nested': true, 'startY': 0, 'startX': 0, 'x': 3150, 'y': 3070 }
	];
	$scope.addEntity = function () {
		$scope.shapes.push({
			'id': "entity_" + $scope.shapes.length,
			'nested': true,
			'startY': 0,
			'startX': 0,
			'x': Math.abs($scope.canvas.x) + $("#" + $scope.canvas.id).parent().width()/2,
			'y': Math.abs($scope.canvas.y) + $("#" + $scope.canvas.id).parent().height()/2
		});
	};
	$scope.saveState = function () {
		console.log("running function saveState with arguments: ", arguments);
	};
	$scope.forkState = function () {
		console.log("running function forkState with arguments: ", arguments);
	};
	$scope.shareState = function () {
		console.log("running function shareState with arguments: ", arguments);
	};


});
app.directive('myMovable', function($document) {
	return {
		restrict: 'A',
		scope: {
			movableElement: '=myMovable'
		},
		link: function(scope, element, attr) {
			scope.movableElement.id = attr.id;
			var newX, newY, canvasWidth, canvasHeight;
			canvasHeight = element.height() - element.parent().height();
			canvasWidth = element.width() - element.parent().width();
			element.css({
				top: scope.movableElement.y + 'px',
				left:  scope.movableElement.x + 'px'
			});
			element.on('mousedown', function(event) {
				// Prevent default dragging of selected content
				event.preventDefault();
				if(scope.movableElement.id == event.target.id) {
					scope.movableElement.startX = event.pageX - scope.movableElement.x;
					scope.movableElement.startY = event.pageY - scope.movableElement.y;
					$document.on('mousemove', mousemove);
					$document.on('mouseup', mouseup);
				}
			});
 
			function mousemove(event) {
				event.preventDefault();
				scope.movableElement.y = event.pageY - scope.movableElement.startY;
				scope.movableElement.x = event.pageX - scope.movableElement.startX;
				// These if's are here to check boundaries and keep the "canvas" in shape.
				// Nested shapes invert the boolean logic against non nested.
				
				if (scope.movableElement.nested) {
					if(scope.movableElement.y < 0) {
						scope.movableElement.y = newY = 0;
					} else if(scope.movableElement.y < canvasHeight) {
						scope.movableElement.y = newY = canvasHeight;
					} else {
						newY = scope.movableElement.y;
					}
					if(scope.movableElement.x < 0) {
						scope.movableElement.x = newX = 0;
					} else if(scope.movableElement.x < canvasWidth) {
						scope.movableElement.x = newX = canvasWidth;
					} else {
						newX = scope.movableElement.x;
					}
				} else {
					if(scope.movableElement.y > 0) {
						scope.movableElement.y = newY = 0;
					} else if(scope.movableElement.y < -canvasHeight) {
						scope.movableElement.y = newY = -canvasHeight;
					} else {
						newY = scope.movableElement.y;
					}
					if(scope.movableElement.x > 0) {
						scope.movableElement.x = newX = 0;
					} else if(scope.movableElement.x < -canvasWidth) {
						scope.movableElement.x = newX = -canvasWidth;
					} else {
						newX = scope.movableElement.x;
					}

				}

				element.css({
					top: newY + 'px',
					left:  newX + 'px'
				});
			}
 
			function mouseup() {
				event.preventDefault();
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}
		}
	};
});
app.directive('myScalable', function($window) {
	var scaleIn = function(element, scope) {
		console.log("scaleIn");
		scope.canvas.scale = scope.canvas.scale + 0.1;
		element.css({
			top: (scope.canvas.x - scope.canvas.y*0.1) + 'px',
			left:  (scope.canvas.x - scope.canvas.x*0.1) + 'px',
			"-webkit-transform": "scale(" + scope.canvas.scale + ")"
		});
	};
	var scaleOut = function(element, scope) {
		console.log("scaleOut");
		scope.canvas.scale = scope.canvas.scale - 0.1;
		element.css({
			top: (scope.canvas.x + scope.canvas.y*0.1) + 'px',
			left:  (scope.canvas.x + scope.canvas.x*0.1) + 'px',
			"-webkit-transform": "scale(" + scope.canvas.scale + ")"
		});
	};
	var throttle = function(fn, threshhold, scope) {
		threshhold || (threshhold = 250);
		var last,
		deferTimer;
		return function () {
			var context = scope || this;

			var now = +new Date(),
			args = arguments;
			if (last && now < last + threshhold) {
				// hold on to it
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
					last = now;
					// fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	};
	return function(scope, element, attr) {
		angular.element($window).bind("mousewheel", throttle(function(event){
			if(event.toElement == element[0]) {
				if(event.originalEvent.wheelDelta > 0) {
					scaleIn(element, scope);
				}else{
					scaleOut(element, scope);
				}
			}
		}, 100));
	};
});

app.directive('myScalable', function($window) {
	return function(){

	};
});
