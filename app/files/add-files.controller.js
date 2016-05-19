(function() {
  'use strict';

  angular.module('cumulus.files')

  .controller('AddFilesController', ['$scope', '$rootScope', 'Upload', '$timeout', 'breadcrumbsService', 'ngToast', 'FilesListService', 'ModalService', 'configService',
    function($scope, $rootScope, Upload, $timeout, breadcrumbsService, ngToast, FilesListService, ModalService, configService) {
      var vm = this;

      $scope.$watch('files', function() {
        console.log(vm.dropInNewFolder ? 'uploadNewFolder' : 'upload');
        // $scope.upload($scope.files);

        if (vm.dropInNewFolder) {
          var templateUrl = configService.get('ressourcesPath') + 'modal/create-folder.html';
          ModalService.showModal({
            templateUrl: configService.get('ressourcesPath') + 'modal/create-folder.html',
            controller: function($scope, files, close) {
              var vm = this;

              vm.isModalOpened = true;
              vm.folderName = 'Untitled folder';

              vm.close = function(result) {
                close(result, 200);
                vm.isModalOpened = false;
              };
            },
            controllerAs: 'newFolderModalCtrl',
            inputs: {
              files: $scope.files
            },
            appendElement: angular.element(document.getElementById('modal'))
          }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(userResponse) {
              // @todo: checker le nom du dossier
              // if (isValidFolderName(userResponse)) {} ...

              FilesListService.uploadFilesInFolder(userResponse, $scope.files, function() {
                var crumbsArray = breadcrumbsService.getCurrentPathCrumbs(),
                  currentPath;

                currentPath = crumbsArray.slice(1, crumbsArray.length).join('/');
                $rootScope.$broadcast('openAbsoluteFolder', '/' + currentPath);
                ngToast.create('File(s) uploaded in ' + userResponse);
              });

              modal.element.modal('hide');

              $('#dropzone').removeClass('dragover');
              $('#dropzone-modal').addClass('hide');
              $('#dropzone-new-folder').addClass('hide');
            });
          });
        } else {
          FilesListService.uploadFiles($scope.files, function() {
            var crumbsArray = breadcrumbsService.getCurrentPathCrumbs(),
              currentPath;

            currentPath = crumbsArray.slice(1, crumbsArray.length).join('/');
            $rootScope.$broadcast('openAbsoluteFolder', '/' + currentPath);
            ngToast.create('File(s) uploaded');
            $('#dropzone').removeClass('dragover');
            $('#dropzone-modal').addClass('hide');
            $('#dropzone-new-folder').addClass('hide');
          });
        }
      });


      // $scope.upload = function(files, isNewFolder, callback) {
      //   if (files && files.length) {
      //     var crumbsArray = breadcrumbsService.getCurrentPathCrumbs(),
      //       currentPath,
      //       baseUrl;

      //     currentPath = crumbsArray.slice(1, crumbsArray.length).join('/');
      //     baseUrl = 'http://files.cumulus.dev/' + currentPath;

      //     for (var i = 0; i < files.length; i++) {
      //       var file = files[i];
      //       if (!file.$error) {
      //         Upload.upload({
      //           url: baseUrl + '/' + file.name,
      //           method: 'POST',
      //           data: {
      //             file: file
      //           }
      //         }).progress(function(evt) {
      //           var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //           $scope.log = 'progress: ' + progressPercentage + '% ' +
      //                       evt.config.data.file.name + '\n' + $scope.log;
      //         }).success(function(data, status, headers, config) {
      //           $rootScope.$broadcast('openAbsoluteFolder', '/' + currentPath);
      //           ngToast.create('File(s) uploaded');
      //           $timeout(function() {
      //               $scope.log = 'file: ' + config.data.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
      //           });
      //         }).then(function() {
      //           $('#dropzone').removeClass('dragover');
      //           $('#dropzone-modal').addClass('hide');
      //           $('#dropzone-new-folder').addClass('hide');
      //         }).then(callback);
      //       }
      //     }
      //   }
      // };

      vm.drag = function(isDragging, dragClass, dragEvent) {
        console.log('drag', isDragging);
        if (isDragging) {
          $('#dropzone-modal').removeClass('hide');
          $('#dropzone-new-folder').removeClass('hide');
        } else {
          $('#dropzone-modal').addClass('hide');
          $('#dropzone-new-folder').addClass('hide');
        }
      };

      vm.dragNewFolder = function(isDragging, dragClass, dragEvent) {
        console.log('dragNewFolder', isDragging);
        if (isDragging) {
          $('#dropzone').removeClass('dragover');
          $('#lolilol').hide();
          vm.dropInNewFolder = true;
          console.log('dropInNewFolder?', vm.dropInNewFolder);
        } else {
          $('#dropzone').addClass('dragover');
          $('#lolilol').show();
          vm.dropInNewFolder = false;
          console.log('dropInNewFolder?', vm.dropInNewFolder);
        }
      };
    }
  ])
})();