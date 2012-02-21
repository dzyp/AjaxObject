@addEventListener 'message', (e) =>
  @response = new Object()
  temp = e.data.id
  xml = new XMLHttpRequest()
  xml.open e.data.type, e.data.url, true
  xml.onreadystatechange = () =>
    if xml.readyState == 4
      if xml.status == 200
        @response.error = false
        @response.response = eval '(' + xml.responseText + ')'
        @response.id = temp
        @postMessage(@response)
      else
        @response.error = true
        @response.response = xml.statusText
        @response.id = temp
        @postMessage(@response)
  xml.send if e.data.data then e.data.data else null
