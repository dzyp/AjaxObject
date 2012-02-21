(function() {

  this.AjaxObject = (function() {

    AjaxObject.path = '/static/parser.js';

    AjaxObject.hasWorker = window.worker !== null;

    function AjaxObject(path) {
      if (AjaxObject.hasWorker) {
        if (path != null ? path.length : void 0) AjaxObject.path = path;
        AjaxObject.worker = new Worker(AjaxObject.path);
      }
    }

    AjaxObject.prototype.singleThread = function(config, onSuccess, onFailure) {
      var _this = this;
      config.success = function(res) {
        var obj;
        obj = eval('(' + res + ')');
        return onSuccess(obj);
      };
      config.error = function(res) {
        return onFailure;
      };
      return $.ajax(config);
    };

    AjaxObject.prototype.multiThread = function(config, onSuccess, onFailure) {
      var callback;
      if (!AjaxObject.hasWorker) {
        this.singleThread(config, onSuccess, onFailure);
        return;
      }
      callback = function(res) {
        if (!res.data.error) {
          onSuccess(res.data.response);
        } else {
          onFailure(res.data.response);
        }
        return AjaxObject.worker.removeEventListener('message', callback, false);
      };
      AjaxObject.worker.addEventListener('message', callback, false);
      return AjaxObject.worker.postMessage(config);
    };

    return AjaxObject;

  })();

}).call(this);
