// create the module
var macbethApp = angular.module('macbethApp', ['ngRoute']);

// configure our routes
macbethApp.config(function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'views/home.html',
            controller  : 'mainController'
        });
});

// create the controller and inject Angular's $scope
macbethApp.controller('mainController', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {


    $scope.sort = 'lines';
    
    // title case the names returned by the data from $http.get
    function titleCase(str) {
      str = str.toLowerCase().split(' ');
      newWords = [];

      for (let word of str) {
        newWords.push(word.charAt(0).toUpperCase() + word.slice(1));
      }
      newWords = newWords.join(' ');
      return newWords;
    }
    
    $http.get('../data/macbethdata.json').success((response) => {
        if(response) {
            $scope.speakers = response;
        }
        
        for (let key in $scope.speakers) {
            if($scope.speakers.hasOwnProperty(key)) {
                $scope.speakers[key].name = titleCase($scope.speakers[key].name);
            }
        }   
    })
    .error((err) => {
           console.error(err); 
        });
}]);