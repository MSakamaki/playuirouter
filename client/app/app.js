'use strict';

angular.module('ngfullApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.router.stateHelper',
  'ui.bootstrap'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, stateHelperProvider, $logProvider) {
    $urlRouterProvider
      .otherwise('/main/sub1');
    $logProvider.debugEnabled(true);


    // resolveを使用すると、state内部独自のFactory、Valueを作る事が出来る。
    var resolve = {
        myFact: function(name){
          return name + ' allo!';
        },
        value: 'resolve'
      };
    // dataはscope内部独自のstate
    // costomData access of $state.data.customData1 
    // parent access $state.current.data.customData1
    var data = {
          costomData: 'hoge'
        };

    $stateProvider.state('main',{
        abstract: true,
        url: '/main',
        template: '<h1>Contacts Page </h1>' +
                  '<ul><li><a ui-sref="main.sub1"> return to top</a></li>' + 
                  '<li><ui-view/></li></ul>' + 
                  '<div ui-view="head"></div>' + 
                  '<div ui-view="body"></div>' + 
                  '<div ui-view="foot"></div>',
        data: { title: 'MAIN TITLE' }
      }).state('main.sub1',{
        url: '/sub1',
        views: {
          '': {
            template: '<div>All Sub {{sub.title}}!</div>' + 
                      '<div ui-view=""></div>' + 
                      '<ul>' + 
                      '<li><a ui-sref="main.sub1.a">a link</a></li>' + 
                      '<li><a ui-sref="main.sub1.A">A link</a></li>' + 
                      '<li><a ui-sref="main.sub1.report"> report link</a></li>' +
                      '<li><a ui-sref="main.sub2"> sub 2 link</a></li>' +
                      '</ul>' + 
                      '</ul>' + 
                      '<button ng-click="sub.toNotPage()">{{p.name}} Page NotFound </button>' + 
                      '<div>button<ul ng-repeat="p in sub.contacts">' + 
                      '<li><button ng-click="sub.toAlink(p)">{{p.name}} button</button></li>' + 
                      '</ul></div>',
            controllerAs: 'sub',
            controller: function($state, $rootScope, $log){ 
              this.title=$state.current.data.title; 
              this.contacts = [
                {id: 1, name:'alice'}
               ,{id: 'bobsite', name:'bob'}
               ,{id: 3, name:'catihy'}
               ,{id: 4, name:'dany'}
               ]

              this.toAlink = function(p){
                $state.go('main.sub1.detail', {id: p.id});
              }
              this.toNotPage = function(){
                $state.go('main.noting');
              }
              /* ライフサイクルめも
                $stateChangeStart 
                $viewContentLoading 
                onExit 
                onEnter 
                $stateChangeSuccess 
                $stateChangeStart 
                onExit 
                $stateChangeSuccess 
                ---------------------------------
                -- ここでページが切り替わる（ボタン）--
                ---------------------------------
                $stateChangeStart 
                $viewContentLoading 
                onEnter 
                $stateChangeSuccess 
              */
              // ページ遷移開始
              $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){ $log.debug(event.name);});
              // ページがないとき
              $rootScope.$on('$stateNotFound',function(event, toState, toParams, fromState, fromParams){ 
                $log.debug('ページがないので、ページ遷移しないようBLOCK!',event.name);
                event.preventDefault(); 
              });
              // 成功時
              $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){ $log.debug(event.name);});
              // エラー時
              $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){ $log.debug(event.name);});
              // viewがロードされる前に発火
              $rootScope.$on('$viewContentLoading',function(event, toState, toParams, fromState, fromParams){ $log.debug(event.name);});

            }
          },
          'head': {
            template: '<div> Main Header Detail</div>'
          },
          'body': {
            template: '<div> Main Body Detail</div>'
          },
          'foot': {
            template: '<ul>' + 
                      '<li><a ui-sref="main.sub1.a">a link</a></li>' + 
                      '<li><a ui-sref="main.sub1.A">A link</a></li>' + 
                      '<li><a ui-sref="main.sub1.report"> report link</a></li>' +
                      '<li><a ui-sref="main.sub2"> sub 2 link</a></li>' +
                      '</ul>'
          }
        }
      }).state('main.sub1.a',{
        url: '/a',
        views: {
          'head@main': {
            template: '<div> a Header Detail</div>'
          },
          'body@main': {
            template: '<div>sub vuew</div>'
          }
        }
      }).state('main.sub1.report',{
        url: '^/report', // ^をつけるとルートURL
        views: {
          'head@main': {
            template: '<div> a Header Detail</div>'
          },
          'body@main': {
            template: '<div> a Body Detail</div>'
          }
        },
      }).state('main.sub1.detail',{
        url: '/{id:[0-9]}',
        onEnter: function($stateParams, $log){ // ステート開始時に呼ばれる
          $log.debug('onEnter : ',$stateParams.id);
        },
        onExit: function($stateParams, $log){ // ステート終了時に呼ばれる
          $log.debug('onExit : ',$stateParams.id);
        },
        views: {
          'body@main': {
            template: '<div>sub vuew {{detail.id}} !</div>',
            controllerAs: 'detail',
            controller: function($state,$stateParams){
              this.id = $stateParams.id;
              return void 0;
            }
          }
        }
      }).state({
        name: 'main.sub2', // 第一引数でなく、nameプロパティでもステートの定義が出来る
        url: '/sub2',
        template: '<div>All Sub Page2!</div>'
      });

    $locationProvider.html5Mode(true);
  });