'use strict';

//! app
var app = angular.module('myApp', [
    'ng',
    'ngRoute',
    'cores',
    'myApp.controllers',
    'myApp.directives',
    'myApp.filters',
    'myApp.services'
]);

//! config
app.config(function($routeProvider, $locationProvider, $httpProvider) {
    
    $routeProvider
        .when('/',                  { templateUrl: 'partials/index',        controller: 'IndexCtrl' })
        .when('/users',             { templateUrl: 'partials/users',        controller: 'UserCtrl' })
        .when('/user/create',       { templateUrl: 'partials/user-create',  controller: 'UserCtrl' })
        .when('/user/view/:id',     { templateUrl: 'partials/user-view',    controller: 'UserCtrl' })
        .when('/user/edit/:id',     { templateUrl: 'partials/user-edit',    controller: 'UserCtrl' })
        .when('/user/delete/:id',   { templateUrl: 'partials/users',        controller: 'UserCtrl' })        
        .otherwise(                 { templateUrl: 'partials/404',          controller: '404Ctrl', title: '404'});
        
    // Removes the # in urls
    $locationProvider.html5Mode(true);   
    
    // Intercept responses with a handler service
    $httpProvider.responseInterceptors.push('responseHandler');     
});


//! run
app.run(function(crResources) {
       
    var options = { path: '/cores' };
    
    crResources.init(options).then(function() {
    
        //console.log('cores initialized');                   
    });     
});