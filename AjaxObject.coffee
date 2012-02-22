

class @AjaxObject

  @path = '/static/parser.js'
  @hasWorker = window.worker != null

  @callbackIndex = 0

  constructor: (path) ->
    if AjaxObject.hasWorker
      AjaxObject.callbacks = []
      AjaxObject.workers = []
      if path?.length
        AjaxObject.path = path


  @_spawnWorker = () ->
    worker = new Worker(AjaxObject.path)
    worker.addEventListener 'message', (res) ->
      fxns = AjaxObject._getCallback(res.data.id)
      if !res.data.error
        fxns.onSuccess res.data.response
      else
        fxns.onFailure res.data.response
      AjaxObject.workers.push @

    AjaxObject.workers.push(worker)

  @_getWorker = () ->
    worker = AjaxObject.workers.pop()
    if not worker
      AjaxObject._spawnWorker()
      return AjaxObject._getWorker()
    return worker

  @_removeWorker = (worker) ->
    j = 0
    for w in AjaxObject.workers
      if worker is w
        AjaxObject.workers.splice(j, 1)
        return
      j++

  @_getCallback = (index) ->
    j = 0
    for i, fxns of AjaxObject.callbacks
      if fxns.id is index
        AjaxObject.callbacks.splice j, 1
        return fxns.fxns
      j++
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

    worker = AjaxObject._getWorker()

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
    worker.postMessage tempConfig