function View(app){

  var _app = app;

  this.getApplication = function(){ return _app; };
  this.setApplication = function(app){ _app = app; };

  this.load = function(){}
}
