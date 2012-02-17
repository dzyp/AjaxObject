@addEventListener 'message', (e) =>
	@response
	xml = new XMLHttpRequest()
	xml.open e.data.type, e.data.url, false
	xml.onreadystatechange = () =>
		if xml.readyState == 4
			if xml.status == 200
				@response = eval "(" + xml.responseText + ")"
			else
				@response = null
	xml.send()
	@postMessage(@response)