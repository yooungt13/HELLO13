var angularTodo = angular.module('angularTodo', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// When the page loads, all API calls Todos
	$http.get('/api/todos')
		.success(function(data) {
			$scope.todos = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// When a new TODO add, send the text to the API
	$scope.createTOdo = function(){
		$http.post('/api/todos',$scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// Delete a TODO after finishing
	$scope.deleteTodo = function(){
		$http.delete('/api/todos/' + id)
			.success(function(data) {
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}