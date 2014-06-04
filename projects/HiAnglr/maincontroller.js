app.controller("MainController",function($scope){
	console.log("Controller is called.")
	$scope.understand = "I now understand how the scope works!"

	$scope.selectedPerson = 0;
	$scope.selectedGenre = null;
	$scope.people = [
		{
			id: 0,
			name: 'Leaon',
			music: [
				'Rock',
				'Metal',
				'Dubstep',
				'Electro'
			],
			live: true
		},
		{
			id: 1,
			name: 'Chris',
			music: [
				'Indie',
				'Drumstep',
				'Dubstep',
				'Electro'
			],
			live: true
		},
		{
			id: 2,
			name: 'Harry',
			music: [
				'Rock',
				'Metal',
				'Thrash Metal',
				'Heavy Metal'
			],
			live: false
		},
		{
			id: 3,
			name: 'Allyce',
			music: [
				'Pop',
				'RnB',
				'Hip Hop'
			],
			live: true
		}
	];

	$scope.newPerson = null;
	$scope.addNew = function() {
		if($scope.newPerson != null && $scope.newPerson != ""){
			$scope.people.push({
				id: $scope.people.length,
				name: $scope.newPerson,
				live: true,
				music: []
			});
		}
	}
});