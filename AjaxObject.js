(function() {

  this.AjaxObject = (function() {

    AjaxObject.path = '/static/parser.js';

    AjaxObject.hasWorker = window.worker !== null;

    AjaxObject.callbackIndex = 0;

    function AjaxObject(path) {
      if (AjaxObject.hasWorker) {
        AjaxObject.callbacks = [];
        if (path != null ? path.length : void 0) AjaxObject.path = path;
        AjaxObject.worker = new Worker(AjaxObject.path);
        AjaxObject.worker.addEventListener('message', function(res) {
          var fxns;
          fxns = AjaxObject._getCallback(res.data.id);
          if (!res.data.error) {
            return fxns.onSuccess(res.data.response);
          } else {
            return fxns.onFailure(res.data.response);
          }
        });
      }
    }

    AjaxObject._getCallback = function(index) {
      var fxns, i, _ref;
      _ref = AjaxObject.callbacks;
      for (i in _ref) {
        fxns = _ref[i];
        if (fxns.id === index) return fxns.fxns;
      }
      return null;
    };

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
      var obj, tempConfig;
      if (!AjaxObject.hasWorker) {
        this.singleThread(config, onSuccess, onFailure);
        return;
      }
      obj = new Object();
      obj.id = AjaxObject.callbackIndex;
      AjaxObject.callbackIndex++;
      obj.fxns = new Object();
      obj.fxns.onSuccess = onSuccess;
      obj.fxns.onFailure = onFailure;
      tempConfig = new Object();
      $.extend(true, tempConfig, config);
      tempConfig.id = obj.id;
      AjaxObject.callbacks.push(obj);
      return AjaxObject.worker.postMessage(tempConfig);
    };

    return AjaxObject;

  })();

}).call(this);
