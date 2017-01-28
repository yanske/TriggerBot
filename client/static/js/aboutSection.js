var app = angular.module("myApp", []);
	app.controller("myCtrl", function($scope){
	$scope.triggered = 0;
	$scope.isTriggeredFunction = function()
	{
		if(triggered > 0)
			$scope.isTriggered = "#Triggered";
		else
			$scope.isTriggered = "#notTriggered";
	}

});