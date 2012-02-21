(function() {
  var _this = this;

  this.addEventListener('message', function(e) {
    var xml;
    _this.response = new Object();
    xml = new XMLHttpRequest();
    xml.open(e.data.type, e.data.url, false);
    xml.onreadystatechange = function() {
      if (xml.readyState === 4) {
        if (xml.status === 200) {
          _this.response.error = false;
          return _this.response.response = eval('(' + xml.responseText + ')');
        } else {
          _this.response.error = true;
          return _this.response.response = xml.statusText;
        }
      }
    };
    xml.send(e.data.data ? e.data.data : null);
    return _this.postMessage(_this.response);
  });

}).call(this);
