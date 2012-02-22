(function() {

  this.AjaxObject = (function() {

    AjaxObject.path = '/static/parser.js';

    AjaxObject.hasWorker = window.worker !== null;

    AjaxObject.callbackIndex = 0;

    function AjaxObject(path) {
      if (AjaxObject.hasWorker) {
        AjaxObject.callbacks = [];
        AjaxObject.workers = [];
        if (path != null ? path.length : void 0) AjaxObject.path = path;
      }
    }

    AjaxObject._spawnWorker = function() {
      var worker;
      worker = new Worker(AjaxObject.path);
      worker.addEventListener('message', function(res) {
        var fxns;
        fxns = AjaxObject._getCallback(res.data.id);
        if (!res.data.error) {
          fxns.onSuccess(res.data.response);
        } else {
          fxns.onFailure(res.data.response);
        }
        return AjaxObject.workers.push(this);
      });
      return AjaxObject.workers.push(worker);
    };

    AjaxObject._getWorker = function() {
      var worker;
      worker = AjaxObject.workers.pop();
      if (!worker) {
        AjaxObject._spawnWorker();
        return AjaxObject._getWorker();
      }
      return worker;
    };

    AjaxObject._removeWorker = function(worker) {
      var j, w, _i, _len, _ref;
      j = 0;
      _ref = AjaxObject.workers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        w = _ref[_i];
        if (worker === w) {
          AjaxObject.workers.splice(j, 1);
          return;
        }
        j++;
      }
    };

    AjaxObject._getCallback = function(index) {
      var fxns, i, j, _ref;
      j = 0;
      _ref = AjaxObject.callbacks;
      for (i in _ref) {
        fxns = _ref[i];
        if (fxns.id === index) {
          AjaxObject.callbacks.splice(j, 1);
          return fxns.fxns;
        }
        j++;
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
      var obj, tempConfig, worker;
      if (!AjaxObject.hasWorker) {
        this.singleThread(config, onSuccess, onFailure);
        return;
      }
      worker = AjaxObject._getWorker();
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
      return worker.postMessage(tempConfig);
    };

    return AjaxObject;

  })();

}).call(this);
