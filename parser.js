(function() {
  var _this = this;

  this.addEventListener('message', function(e) {
    var temp, xml;
    _this.response = new Object();
    temp = e.data.id;
    xml = new XMLHttpRequest();
    xml.open(e.data.type, e.data.url, true);
    xml.onreadystatechange = function() {
      if (xml.readyState === 4) {
        if (xml.status === 200) {
          _this.response.error = false;
          _this.response.response = eval('(' + xml.responseText + ')');
          _this.response.id = temp;
          return _this.postMessage(_this.response);
        } else {
          _this.response.error = true;
          _this.response.response = xml.statusText;
          return _this.postMessage(_this.response);
        }
      }
    };
    return xml.send(e.data.data ? e.data.data : null);
  });

}).call(this);
