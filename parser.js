(function() {
  var _this = this;

  this.addEventListener('message', function(e) {
    var xml;
    _this.response;
    xml = new XMLHttpRequest();
    xml.open(e.data.type, e.data.url, false);
    xml.onreadystatechange = function() {
      if (xml.readyState === 4) {
        if (xml.status === 200) {
          return _this.response = eval("(" + xml.responseText + ")");
        } else {
          return _this.response = null;
        }
      }
    };
    xml.send();
    return _this.postMessage(_this.response);
  });

}).call(this);
