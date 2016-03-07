/* Sample Controller */

app.controller('detailsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $http.get('./data/imdb250.json').success(function(data) {
        $scope.data = data;
        $scope.dataObj = $scope.data[$routeParams.ind - 1];
        $scope.ind = $routeParams.ind;


        $scope.leftInd = parseInt($scope.ind) - 1;
        $scope.rightInd = parseInt($scope.ind) + 1;

        if ($scope.leftInd < 1) {
            $scope.leftInd = $scope.ind;
        }

        if ($scope.rightInd > $scope.data.length) {
            $scope.rightInd = $scope.ind;
        }

    }).error(function(err) {
        console.log("Error occured loading the data.");
    }); 

}]);

app.controller('listController', ['$scope', '$http', '$location', function($scope, $http, $location) {

    /**
     * Function called by the filter listener. Filters out the results based on the user text input.
     */
    $scope.filterResults = function() {
        $scope.results = [];
        for (var i = 0; i < $scope.data.length; i++) {
            var movieObj = $scope.data[i];
            var queryLower = $scope.query.toLowerCase();
            
            var textDump = movieObj.title + ' ' + movieObj.genre.join(' ') + ' ' + movieObj.director.join(' ') + ' '
            + movieObj.actors.join(' ') + ' ' + movieObj.plot + ' ' + movieObj.language;

            var textDumpLower = textDump.toLowerCase();

            if (textDumpLower.includes(queryLower)) {
                var movieData = {
                    "title": movieObj.title,
                    "rank": movieObj.rank,
                    "rated": movieObj.rated, 
                    "genre": movieObj.genre,
                    "img": './data/images/' + movieObj.imdbID + '.jpg'
                };
                $scope.results.push(movieData);
            }
        }
    };

    /**
     * Sets the predicate for sorting the movies if the select option is changed. 
     */
    $scope.setSortBy = function() {
        if ($scope.sortSelection === 'title') {
            var ind = $scope.predicate[0];
            $scope.predicate = ind + 'title';
        }
        else if ($scope.sortSelection === 'rank') {
            var ind = $scope.predicate[0];
            $scope.predicate = ind + 'rank';
        }
    };

    /** 
     * Sets the predicate for ordering the movies if the toggle is changed (used on click).
     */
    $scope.goOrderBy = function(value) {
        if (value === 'ascending') {
            $scope.predicate = '-' + $scope.predicate.substr(1);
        }
        else if (value === 'descending') {
            console.log("yes");
            $scope.predicate = '+' + $scope.predicate.substr(1);
        }
    };

    // go to the detail view
    $scope.goToMovieDetail = function(id) {
        console.log(id);
        var path = '/details/'+id;
        console.log(path);
        $location.path('/details/'+id);
    }

    // load data
    $http.get('./data/imdb250.json').success(function(data) {
        $scope.data = data;

        // add listeners
        $scope.$watch('query', $scope.filterResults, true);
        $scope.$watch('sortSelection', $scope.setSortBy, true);

    }).error(function(err) {
        console.log("Error occured loading the data.");
    }); 

    // dynamic changing list of movies
    $scope.results = [];

    // user input
    $scope.query = '';

    $scope.sortSelection = 'title';

    // predicate used for ordering the ng-repeat
    $scope.predicate = '-rank';
    $scope.reverse = '!reverse';

}]);


app.controller('galleryController', ['$scope', '$http', '$location', function($scope, $http, $location) {

    // load data
    $http.get('./data/imdb250.json').success(function(data) {
        $scope.data = data;
        $scope.genres = getGenres(data); 
        $scope.imageNames = getAllImageData(data);
    }).error(function(err) {
        console.log("Error occured loading the data.");
    }); 

    /**
     * Processes the JSON file and returns list of all the genres in the data set.
     */
    function getGenres(data) {
        var genreSet = [];
        for (var i = 0; i < data.length; i++) {
            var genres = data[i].genre;
            for (var j = 0; j < genres.length; j++) {
                if (genreSet.indexOf(genres[j]) == -1) {
                    genreSet.push(genres[j]);
                }
            }           
        }
        genreSet.push('All');
        return genreSet;
    }

    /**
     * Processes the JSON file and returns list of all the json ids.
     */
    function getAllImageData(data) {
        var names = [];
        for (var i = 0; i < data.length; i++) {
            var imageObj = {
                "imgName": './data/images/' + data[i].imdbID + '.jpg',
                "rank": data[i].rank
            }
            names.push(imageObj);
        }
        return names;
    }

    /**
     * Returns a list of image names from all of the image data with the given genre.
     */
    function getImageNamesFromGenre(data, name) {
        var names = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].genre.indexOf(name) != -1) { 
                var imageObj = {
                    "imgName": './data/images/' + data[i].imdbID + '.jpg',
                    "rank": data[i].rank
                }
                names.push(imageObj);  
            }
        }
        return names;
    };

    /**
     * Sets the imageNames scope object to a list containing all the movies with the provided genreName (used on click).
     */
    $scope.setMoviesFromGenre = function(genreName) {
        if (genreName == "All") {
            $scope.imageNames = getAllImageNames($scope.data);
        }
        else {
            $scope.imageNames = getImageNamesFromGenre($scope.data, genreName);
        }
    };

    // go to the detail view
    $scope.goToMovieDetail = function(id) {
        console.log(id);
        var path = '/details/'+id;
        console.log(path);
        $location.path('/details/'+id);
    }

}]);


