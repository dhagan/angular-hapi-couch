(function() {

  var module = angular.module('cores.controllers');


  module.controller('crModelCtrl', function($scope, $location, $q, $window, crResources, crSchema, crCommon) {

    var STATE_EDITING = 'editing';
    var STATE_LOADING = 'loading';
    var STATE_SAVING = 'saving';
    var STATE_ERROR = 'error';

    var self = this;
    var data = $scope.data = {
      valid: true,
      state: STATE_EDITING,
      debug: false,
      files: {}
    };

    // add/update/remove files from the model

    $scope.$on('file:set', function(e, id, file) {
      e.stopPropagation();
      data.files[id] = file;
    });

    $scope.$on('file:remove', function(e, id) {
      e.stopPropagation();
      delete data.files[id];
    });

    // button methods

    $scope.save = function() {
      $scope.$emit('model:save');
      return self.save();
    };

    $scope.cancel = function() {
      $scope.$emit('model:cancel');
    };

    $scope.destroy = function() {
      $scope.$emit('model:destroy');
      return self.destroy();
    };

    $scope.toggleDebug = function() {
      $scope.data.debug = !$scope.data.debug;
    };

    $scope.isNew = function() {
      if (!$scope.model) return true;
      return !$scope.model._rev;
    };
    
    $scope.goBack = function() {
        $window.history.back();
    };    

    //
    // methods
    //

    this.load = function(id) {

      data.state = STATE_LOADING;
      return this._resource.load(id).then(function(doc) {
        self.setModel(doc);
        data.state = STATE_EDITING;

      }, function(err) {
        data.state = STATE_ERROR;
        data.error = err;
      });
    };


    this.save = function() {

      var def = $q.defer();

      if (!$scope.data.valid) {
        def.reject(new Error('Model is not valid'));
        return def.promise;
      }
      data.state = STATE_SAVING;

      var fs = Object.keys(data.files).map(function(k) { return data.files[k]; });

      this._resource.save($scope.model, fs).then(function(doc) {

        self.setModel(doc);
        $scope.modelId = doc._id;
        data.state = STATE_EDITING;
        $scope.$emit('model:saved', $scope.model);
        def.resolve(doc);
        // redirect to model list page
        $location.path(crCommon.getPathFromType($scope.model.type_));

      }, function(err) {

        if (err.message === 'Validation failed') {
          data.state = STATE_EDITING;

          err.errors.forEach(function(v) {
            console.log('broadcast', v);
            $scope.$broadcast('set:customError', v.path, v.code, v.message);
          });
        }
        def.reject(err);
      });

      return def.promise;
    };


    this.destroy = function() {
    
      var type = $scope.model.type_;

      return this._resource.destroy($scope.model).then(
        function() {
          self.setModel(crSchema.createValue($scope.schema));
          $scope.$emit('model:destroyed');
          // redirect to model list page
          $location.path(crCommon.getPathFromType(type));       
        }
      );
    };


    this.setModel = function(model) {
      // reset files dict when model changes
      data.files = {};
      $scope.model = model;
    };


    //
    // init
    //
    data.state = STATE_LOADING;
    self._resource = crResources.get($scope.type);

    // load schema
    self._resource.schema().then(function(schema) {

      // load or create default model
      $scope.schema = schema;
      var id = $scope.modelId;

      if (!id) {
        self.setModel(crSchema.createValue(schema));
        data.state = STATE_EDITING;
      }
      else {
        return self.load(id);
      }
    }).then(function() {

      // watch for modelId changes to load/clear the model
      $scope.$watch('modelId', function(newId, oldId) {

        if (newId !== oldId) {
          if (newId) {
            // load model with new id
            self.load(newId);
          }
          else if (oldId) {
            // newId was set to null, create default value
            self.setModel(crSchema.createValue($scope.schema));
          }
        }
      });

      $scope.$emit('model:ready');
    });
  });

})();