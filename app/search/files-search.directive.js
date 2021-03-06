(function() {
  'use strict';

  angular.module('cumulus.search', [])

  .directive('filesearch', ['config', function(config) {
    var FileSearchController = function($rootScope, $scope) {
      var vm = this;

      $scope.$watch('isSearchOpen', function(newValue, oldValue) {
        if (newValue === false && oldValue === true) {
          vm.closeSearch();
        }
      });

      vm.closeSearch = function() {
        $rootScope.$broadcast('searchClosed');
        $rootScope.nbSearchResults = 0;
        vm.searchQuery = '';
        vm.isSearchOpen = false;
      }

      vm.search = function(query) {
        $rootScope.$broadcast('fileSearch', query);
      };
    };

    var path = config.ressourcesPath;

    return {
      restrict: 'E',
      controller: FileSearchController,
      controllerAs: 'fileSearchCtrl',
      templateUrl: path + 'search/file-search.html'
    };
  }])
})();
