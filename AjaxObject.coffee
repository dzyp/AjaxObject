class @AjaxObject
	
	@path = '/Scripts/parser.js'
	@hasWorker = window.worker != null

	@worker
	
	constructor: (path) ->
		if path?.length
			AjaxObject.path = path
		@worker = new Worker(AjaxObject.path)

	singleThread: (config, onSuccess, onFailure) =>	
		config.success = (res) =>
			obj = eval res
			onSuccess obj	
		config.error = (res) =>
			onFailure
		$.ajax(config)

	multiThread: (config, onSuccess, onFailure) =>
		if not AjaxObject.hasWorker
			@singleThread config, onSuccess, onFailure
			return

		@worker.addEventListener 'message', (res) =>
			if res?
				onSuccess res.data
			else
				onFailure
		@worker.postMessage config


