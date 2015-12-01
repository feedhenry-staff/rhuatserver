var app=angular.module("rhuat",["ui.router","ngMaterial"]);
app.config(function($mdThemingProvider,$stateProvider, $urlRouterProvider) {
  // $mdThemingProvider.theme("default").primaryPalette("blue-grey");
  $urlRouterProvider.when("","/deviceList");
  $urlRouterProvider.otherwise("/deviceList");
  $stateProvider.state('deviceList', {
      url: "/deviceList",
      templateUrl: "tmpl/deviceList.html"
  })
  .state('wdsession',{
    url:"/wdsession/:sessionId",
    templateUrl:"tmpl/wdsession.html"
  })
  // .state("list.text",{
  //   url:"/text",
  //   templateUrl:"tmpl/addText.html"
  // })
  // .state("about",{
  //   url:"/about",
  //   templateUrl:"tmpl/about.html"
  // })
});
app.run(function($state){
});
