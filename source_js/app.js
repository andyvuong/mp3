var app = angular.module('mp3',['ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider
        .when('/gallery', {
            templateUrl : 'partials/gallery.html', // inserts this partial into the ngview
            controller : 'galleryController'
        })
        .when('/list', {
            templateUrl : 'partials/list.html', // inserts this partial into the ngview
            controller : 'listController'
        })
        .when('/details/:ind', {
            templateUrl : 'partials/details.html', // inserts this partial into the ngview
            controller : 'detailsController'
        })
        .otherwise({
            redirectTo : '/gallery'
        });
})
