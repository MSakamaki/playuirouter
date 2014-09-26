'use strict';

angular.module('ngfullApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.sub1.A', {
        url: '/A',
        views: {
          'head@main': {
            template: '<div> a Header Detail</div>'
          },
          'body@main': {
            template: '<div> A PAGE !</div>',
            resolve: { // resolveはcontoler分離で使用できる？
                message: function(){
                    return 'X-hoge';
                }
            },
            controller: 'bCtrl'
          }
        },
      });
  })

  .controller('bCtrl', function ($scope, $state, message) {
    console.log('allo', message);
    $scope.NM = "hoge";
  });
