@addEventListener 'message', (e) =>
	@response = new Object()
	xml = new XMLHttpRequest()
	xml.open e.data.type, e.data.url, false
	xml.onreadystatechange = () =>
		if xml.readyState == 4
			if xml.status == 200
        @response.error = false
        @response.response = eval '(' + xml.responseText + ')'
      else
        @response.error = true
        @response.response = xml.statusText
	xml.send if e.data.data then e.data.data else null
	@postMessage(@response)