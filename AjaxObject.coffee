

class @AjaxObject

  @path = '/static/parser.js'
  @hasWorker = window.worker != null

  @callbackIndex = 0

  constructor: (path) ->
    if AjaxObject.hasWorker
      AjaxObject.callbacks = []
      if path?.length
        AjaxObject.path = path
      AjaxObject.worker = new Worker(AjaxObject.path)
      AjaxObject.worker.addEventListener 'message', (res) ->
        fxns = AjaxObject._getCallback(res.data.id)
        if !res.data.error
          fxns.onSuccess res.data.response
        else
          fxns.onFailure res.data.response


  @_getCallback = (index) ->
    for i, fxns of AjaxObject.callbacks
      if fxns.id is index
        return fxns.fxns
    return null

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

    obj = new Object()
    obj.id = AjaxObject.callbackIndex
    AjaxObject.callbackIndex++
    obj.fxns = new Object()
    obj.fxns.onSuccess = onSuccess
    obj.fxns.onFailure = onFailure
    tempConfig = new Object()
    $.extend(true, tempConfig, config)
    tempConfig.id = obj.id
    AjaxObject.callbacks.push(obj)
    AjaxObject.worker.postMessage tempConfig