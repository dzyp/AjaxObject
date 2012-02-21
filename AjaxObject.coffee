class @AjaxObject
	
	@path = '/static/parser.js'
	@hasWorker = window.worker != null
	
	constructor: (path) ->
    if AjaxObject.hasWorker
      if path?.length
        AjaxObject.path = path
      AjaxObject.worker = new Worker(AjaxObject.path)


	singleThread: (config, onSuccess, onFailure) ->
		config.success = (res) =>
			obj = eval '(' + res + ')'
			onSuccess obj	
		config.error = (res) =>
			onFailure
		$.ajax(config)

	multiThread: (config, onSuccess, onFailure) ->
		if not AjaxObject.hasWorker
      @singleThread config, onSuccess, onFailure
      return


    callback = (res) ->
      if !res.data.error
        onSuccess res.data.response
      else
        onFailure res.data.response
      AjaxObject.worker.removeEventListener('message', callback, false)


    AjaxObject.worker.addEventListener 'message', callback, false

    AjaxObject.worker.postMessage config

