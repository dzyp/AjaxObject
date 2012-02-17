(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.AjaxObject = (function() {

    AjaxObject.path = '/Scripts/parser.js';

    AjaxObject.hasWorker = window.worker !== null;

    AjaxObject.worker;

    function AjaxObject(path) {
      this.multiThread = __bind(this.multiThread, this);
      this.singleThread = __bind(this.singleThread, this);      if (path != null ? path.length : void 0) AjaxObject.path = path;
      this.worker = new Worker(AjaxObject.path);
    }

    AjaxObject.prototype.singleThread = function(config, onSuccess, onFailure) {
      var _this = this;
      config.success = function(res) {
        var obj;
        obj = eval(res);
        return onSuccess(obj);
      };
      config.error = function(res) {
        return onFailure;
      };
      return $.ajax(config);
    };

    AjaxObject.prototype.multiThread = function(config, onSuccess, onFailure) {
      var _this = this;
      if (!AjaxObject.hasWorker) {
        this.singleThread(config, onSuccess, onFailure);
        return;
      }
      this.worker.addEventListener('message', function(res) {
        if (res != null) {
          return onSuccess(res.data);
        } else {
          return onFailure;
        }
      });
      return this.worker.postMessage(config);
    };

    return AjaxObject;

  })();

}).call(this);
