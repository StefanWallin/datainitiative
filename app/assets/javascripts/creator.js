//= require angular
var app = angular.module('Creator', []);
app.factory('templates', function() {
  return {
    compact:   '<ng-include src="\'compact\'"></ng-include>',
    detailed:  '<ng-include src="\'detailed\'"></ng-include>'
  };
});
app.controller('ApplicationController', function($scope, $document){
	$scope.basicDataTypes = ["String", "Char", "Boolean", "Integer", "Long", "Float", "Double", "BigDecimal"];
	$scope.canvas  = { id: "canvas", 'nested': false, 'startY': 0, 'startX': 0, 'x': -1500, 'y': -1500, scale: 1 };
	$scope.shapes = [
		{ id: 'entity_0', 'nested': true, 'startY': 0, 'startX': 0, 'x': 1750, 'y': 1600, 'selected': false, 'entity': {name: 'Human'} },
		{ id: 'entity_1', 'nested': true, 'startY': 0, 'startX': 0, 'x': 1690, 'y': 1735, 'selected': false, 'entity': {name: 'Aids'} }
	];
	$scope.selectedShape = -1;
	$document.dragging = false;

	$scope.addShape = function(event) {
		var canvasElem = $("#" + $scope.canvas.id);
		if(event.target == canvasElem[0] && !$document.dragging) {
			
			var canvasWrapperElem = canvasElem.parent();
			var canvasWidth = canvasElem.width();
			var canvasHeight = canvasElem.height();
			var x, y;
			if(	!isNaN(event.offsetX) && event.offsetX > -1 && event.offsetX <= canvasWidth &&
				!isNaN(event.offsetY) && event.offsetY > -1 && event.offsetY <= canvasHeight) {
				x = event.offsetX;
				y = event.offsetY;
			} else {
				x = Math.abs($scope.canvas.x) + canvasWrapperElem.width()/2;
				y = Math.abs($scope.canvas.y) + canvasWrapperElem.height()/2;
			}
			$scope.shapes.push({
				'id': "entity_" + $scope.shapes.length,
				'nested': true,
				'startY': 0,
				'startX': 0,
				'x': x,
				'y': y,
				'selected': false,
				'entity': {
					'name': 'EntityName'
				}
			});
		}
	};
	$scope.removeShape = function(event, index) {
		event.stopPropagation();
		$scope.selectedShape = -1;
		$scope.shapes.splice(index, 1);
	};
	$scope.saveState = function() {
		console.log("running function saveState with arguments: ", arguments);
	};
	$scope.forkState = function() {
		console.log("running function forkState with arguments: ", arguments);
	};
	$scope.shareState = function() {
		console.log("running function shareState with arguments: ", arguments);
	};
	$scope.unselectAll = function(event) {
		if(event !== null && event !== undefined) event.stopPropagation();
		$scope.shapes[$scope.selectedShape].selected = false;
		$scope.selectedShape = -1;
	};
	$scope.workspaceClicked = function(event) {
		if($scope.selectedShape === -1){
			$scope.addShape(event);
		} else {
			$scope.unselectAll();
		}
	};
	$scope.setSelected = function(event, index) {
		var elem = $(event.target);
		if(elem.data("my-movable") !== null) {
			// Only prevent default with elements that is not directly the movable.
			// All other elements will be descendants, and their event bubbling should
			// work as normally intended.
			event.stopPropagation();
		}
		if($scope.selectedShape > -1) {
			$scope.shapes[$scope.selectedShape].selected = false;
		}
		$scope.shapes[index].selected = true;
		$scope.selectedShape = index;
	};
	$scope.scaleIn = function(element, scope) {
		if($scope.canvas.scale < 2) {
			if(element === undefined) element = $("#"+$scope.canvas.id);
			$scope.canvas.scale = $scope.canvas.scale + 0.1;
			element.css({
				top: ($scope.canvas.x - $scope.canvas.y*0.1) + 'px',
				left:  ($scope.canvas.x - $scope.canvas.x*0.1) + 'px',
				"-webkit-transform": "scale(" + $scope.canvas.scale + ")"
			});
		}
	};
	$scope.scaleOut = function(element, scope) {
		if($scope.canvas.scale > 0.5) {
			if(element === undefined) element = $("#"+$scope.canvas.id);
			$scope.canvas.scale = $scope.canvas.scale - 0.1;
			element.css({
				top: ($scope.canvas.x + $scope.canvas.y*0.1) + 'px',
				left:  ($scope.canvas.x + $scope.canvas.x*0.1) + 'px',
				"-webkit-transform": "scale(" + $scope.canvas.scale + ")"
			});
		}
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

				var elem = $(event.target);
				if(elem.data("my-movable") !== undefined) {
					// Only prevent default with elements that is not directly the movable.
					// All other elements will be descendants, and their event bubbling should
					// work as normally intended.
					event.preventDefault();
					console.log("preventDefault 1", elem.data("my-movable"));
				}
				if(scope.movableElement.id == event.target.id || $(event.target).parents("#"+scope.movableElement.id).length > 0) {
					// Only do moving for the movable that we clicked inside.
					scope.movableElement.startX = event.pageX - scope.movableElement.x;
					scope.movableElement.startY = event.pageY - scope.movableElement.y;
					$document.on('mousemove', mousemove);
					$document.on('mouseup', mouseup);
				}
				return false;
			});
 
			function mousemove(event) {
				event.preventDefault();
				$document.dragging = true;
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
				return false;
			}
 
			function mouseup(event) {
				var elem = $(event.target);
				console.log(elem);
				if(elem.data("my-movable") !== undefined) {
					// Only prevent default with elements that is not directly the movable.
					// All other elements will be descendants, and their event bubbling should
					// work as normally intended.
					event.preventDefault();
					console.log("preventDefault 2");
				}
				setTimeout(function(){
					$document.dragging = false;
				}, 200);
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
				return false;
			}
		}
	};
});
