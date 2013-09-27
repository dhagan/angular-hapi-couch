(function() {

  var module = angular.module('cores.services');


  module.factory('crValidation', function() {

    return function(scope, watchExpr) {

      watchExpr = watchExpr || 'model';

      // client side errors
      var errors = {};
      // serverside errors
      var customErrors = {};

      var constraints = [];


      scope.hasErrors = function() {
        return Object.keys(errors).length > 0 || Object.keys(customErrors).length > 0;
      };


      scope.hasError = function(name) {
        return !!(errors[name] || customErrors[name]);
      };


      scope.getFirstError = function(name) {
        for (var x in errors) {
          if (errors[x]) return x;
        }
        for (var y in customErrors) {
          if (customErrors[y]) return y;
        }
      };


      var setError = function(name) {
        errors[name] = true;
        scope.$emit('set:error', scope.path + ':' + name);
      };


      var removeError = function(name) {
        if (errors.hasOwnProperty(name)) {
          delete errors[name];
          scope.$emit('remove:error', scope.path + ':' + name);
        }
      };


      var setCustomError = function(name) {
        customErrors[name] = true;
        scope.$emit('set:error', scope.path + ':' + name);
      };


      var removeCustomError = function(name) {
        if (customErrors.hasOwnProperty(name)) {
          delete customErrors[name];
          scope.$emit('remove:error', scope.path + ':' + name);
        };
      };


      var clearCustomErrors = function() {
        angular.forEach(customErrors, function(error, name) {
          removeCustomError(name);
        });
      };


      var addConstraint = function(name, condition, isCustomConstraint) {
        // only check constraints that are defined in the schema
        if (!isCustomConstraint &&
            !scope.schema.hasOwnProperty(name)) return;

        constraints.push(function(value) {
          condition(value) ? removeError(name) : setError(name);
        });
      };


      scope.$on('set:customError', function(e, path, code, message) {
        if (path === scope.path) {
          setCustomError(code);
          return true;
        }
      });


      scope.$watch(watchExpr, function(newValue, oldValue, scope) {

        constraints.forEach(function(c) {
          c(newValue);
        });
        clearCustomErrors();
      });


      return {
        setError: setError,
        removeError: removeError,
        addConstraint: addConstraint
      };
    };
  });
})();