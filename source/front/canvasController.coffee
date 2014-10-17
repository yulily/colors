class Canvas

  @layer = []

  @penX = undefined
  @penY = undefined
  @ctx = undefined
  @size =
    width: 1702
    height: 630
    cameraX: 1702
    cameraY: 630

  @drawing = false
  @stampFlg = false
  @penColor = "#000"
  @paintDb = []
  @penLeft = 1
  @nowLayer = 3
  @savenum = 0
  @bg = "#eee"

  @p : {}
  @canvasSet : {}
  @canvasStartX : 0
  @canvasStartY : 0
  @canvasEndX   : 0
  @canvasEndY   : 0

  constructor: () ->
    # to model
    $.each localStorage, (i) ->
      datasrc = localStorage.getItem("save" + i)
      save_img = $("<img />").attr("src", datasrc).width("50px").height("34px")
      list = $("<li />").append(save_img)
      $(".tool_03 li ul").append list
    @canvasStartX = ($(window).width()/2)-62
    @canvasStartY = ($(window).height()/2)-199
    @canvasEndX   = @canvasStartX + @size.width
    @canvasEndY   = @canvasStartY + @size.height

    $("#canvas canvas").each (i) ->
      layer[i] = $(this)[0]
      return

    @main 0
    ctx.fillStyle = bg
    ctx.fillRect 0, 0, size.width, size.height
    @main 4
    paintDb[0] = layer[nowLayer].toDataURL()
    layer.reverse()
    return

  main: (index) ->
    ctx = layer[index].getContext("2d")
    return

  layerInfo: ->
    layer_index = nowLayer
    view = $("ol li").eq(layer_index).find("img")
    view.attr "src", layer[nowLayer].toDataURL()
    return

  layerSet: (layer) ->
    Draw.main layer.index()
    $("ol#sortable li").find("img").css "border", "none"
    layer.find("img").css "border", "2px solid #a00"
    nowLayer = layer.index()
    return

  canvasClear : ->
    for key, value of @canvasSet
      value.clearRect(0,0,1702,630)

  touchStart : ->
    # タッチ分
    touchNum = 0
    touchNum = event.touches.length - 1
    imageData = @canvasSet.conText.getImageData(0, 0, 1702, 630)

    # タッチ分座標取得
    for i in [0..touchNum]
      if event.touches[i] != undefined
        penX = event.touches[i].pageX
        penY = event.touches[i].pageY
        if penX >= @canvasStartX || penX <= @canvasEndX
          if penY >= @canvasStartY || penY <= @canvasEndY
            $("#x").html penX
            $("#y").html penY
            Draw.layerInfo()
            @p[i] =
              'id'      : event.touches[i].identifier
              'oldPenX' : (event.touches[i].pageX - parseInt($(".nameSet").offset().left)) * 2
              'oldPenY' : (event.touches[i].pageY - parseInt($(".nameSet").offset().top)) * 2

  touchMove  : ->
    drawing = true
    # タッチ分描画
    touchNum = event.changedTouches.length - 1
    for i in [0..touchNum]
      for key, value of @p
        if @p[key]['id'] == event.changedTouches[i].identifier
          penX = event.changedTouches[i].pageX
          penY = event.changedTouches[i].pageY
          if penX >= @canvasStartX || penX <= @canvasEndX
            if penY >= @canvasStartY || penY <= @canvasEndY
              newX = (penX - parseInt($(".nameSet").offset().left)) * 2
              newY = (penY - parseInt($(".nameSet").offset().top)) * 2
              oldX = parseInt(@p[key]['oldPenX'])
              oldY = parseInt(@p[key]['oldPenY'])
              Difference = Math.floor(Math.sqrt(Math.pow(oldX-newX,2) + Math.pow(oldY-newY,2)))
              if Difference >= 11
                @p[key]['penX'] = (penX - parseInt($(".nameSet").offset().left)) * 2
                @p[key]['penY'] = (penY - parseInt($(".nameSet").offset().top)) * 2
                @strokeLine(@p,key)
                @p[key] =
                  'id'      : @p[key]['id']
                  'oldPenX' : @p[key]['penX']
                  'oldPenY' : @p[key]['penY']

  touchEnd   : ->
    drawing = false
    touchNum = event.changedTouches.length - 1
    for i in [0..touchNum]
      for key,value of @p
        if @p[key]['id'] == event.changedTouches[i].identifier
          delete @p[key]

  strokeLine : (p,i) ->
    for key, value of @canvasSet
      value.beginPath()
      value.moveTo(p[i]['oldPenX'], p[i]['oldPenY'])
      value.lineTo(p[i]['penX'],p[i]['penY'])
      value.lineWidth   = 12
      value.lineJoin    = 'round'
      value.lineCap     = 'round'
      value.strokeStyle = 'rgb(0, 0, 0)'
      value.stroke()
      value.closePath()
      value.scale = 2

  movingAverage : (hst)->
    ret =
      x: 0
      y: 0
    for i in [0..m]
      ret.x += hst[i].x
      ret.y += hst[i].y
    ret.x = ret.x/m
    ret.y = ret.y/m
    return ret

  frame: ->
    img = new Image()
    img.src = stampSrc
    img.onload = ->
      ctx.drawImage img, 0, 0
      DrawStart.layerInfo()
      Draw::dbSave()
      return
    return

  stamp: ->
    stampFlg = true
    if stampFlg
      img = new Image()
      img.src = stampSrc
      img.onload = ->
        $("#canvas").mousemove (e) ->
          sX = e.pageX - $(this).offset().left - img.width / 2
          sY = e.pageY - $(this).offset().top - img.height / 2
          $(this).mousedown ->
            (if (not stampFlg) then img.src = "" else false)
            ctx.drawImage img, sX, sY
            return

          return

        DrawStart.layerInfo()
        Draw::dbSave()
        return
    return

  dbSave: (save) ->
    base64 = layer[nowLayer].toDataURL()
    if save
      window.localStorage.setItem "save" + localStorage.length, base64
      save_img = $("<img />").attr("src", base64).width("50px").height("34px")
      list = $("<li />").append(save_img)
      $(".tool_03 li ul").append list
    else
      i = paintDb.length
      paintDb[i] = base64
    return

window.Canvas = window.Canvas || Canvas