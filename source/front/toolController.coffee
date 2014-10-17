class toolController extends canvasController
  @stampSrc = undefined
  @penWidth = undefined

  constructor: ->
    localStorage.clear()

  btn_change: (btn_src, pro) ->
    if pro is "pencil" or pro is "stamp"
      if pro is "pencil" and not btn_src.match(/_on/)
        btn_src = btn_src.replace(".", "_on.")
      else btn_src = btn_src.replace(/_on/, "")  if pro is "stamp"
    else
      if btn_src.match(/_on/)
        btn_src = btn_src.replace(/_on/, "")
      else
        btn_src = btn_src.replace(".", "_on.")
    btn_src

  back: ->
    img = new Image()
    if paintDb.length > 0
      i = paintDb.length - 2
      img.src = paintDb[i]
      img.onload = ->
        ctx.clearRect 0, 0, size.width, size.height
        ctx.drawImage img, 0, 0
        return

      paintDb.pop i
      DrawStart.layerInfo()
    return

  toolPencil: ->
    tool = $(this).attr("id")
    if tool is "pencil"
      stampFlg = false
      btn_c = btn_change($("ul.tool_01 li#" + tool).find("img").attr("src"), "pencil")
      $("ul.tool_01 li#" + tool).find("img").attr "src", btn_c
    return

  stamp: ->
    fs = $(this).closest("ul").attr("class").replace(/cf\x20/, "")
    stampSrc = $(this).find("img").attr("src")
    if fs is "s"
      Draw::stamp()
      btn_c = btn_change($("ul.tool_01 li#pencil").find("img").attr("src"), "stamp")
      $("ul.tool_01 li#pencil").find("img").attr "src", btn_c
    else if fs is "f"
      Draw::frame()
    else Draw::insta()  if fs is "i"
    return

  delete: ->
    ctx.clearRect 0, 0, size.width, size.height
    DrawStart.layerInfo()
    return

  temporarySet: ->
    unless $(this).index() is 0
      num = $(this).index() - 1
      base64 = localStorage.getItem("save" + num)
      img = new Image()
      img.src = base64
      ctx.clearRect 0, 0, size.width, size.height
      img.onload = ->
        ctx.drawImage img, 0, 0
        DrawStart.layerInfo()
        return
    return

  changePenInfo: ->
    penLeft = $(this).val()
    $("#w").html penLeft
    return

  dragTool: ->
    $(this).closest("section").data("X", e.pageX - $(this).closest("section").position().left).data("Y", e.pageY - $(this).closest("section").position().top).mousemove((e) ->
      $(this).closest("section").css
        top: e.pageY - $(this).closest("section").data("Y") + "px"
        left: e.pageX - $(this).closest("section").data("X") + "px"

      return
    ).mouseup (e) ->
      $(this).unbind "mousemove"
      return

    return

  save: ->
      Draw::dbSave "save"
      $("#s_over form input").not("#regist").remove()
      mc = document.createElement("canvas")
      mc.width = size.width
      mc.height = size.height
      for property of layer
        mc.getContext("2d").drawImage layer[property], 0, 0
      $("#canvas").css "z-index", "7"
      $("#over,#s_over").show()
      paint_data = mc.toDataURL()
      paint_data = paint_data.replace(/^.*,/, "")
      $("<input />").attr("type", "hidden").attr("name", "paint").attr("value", paint_data).appendTo "#btn form"
      return

  returnDraw: ->
    $("#canvas").css "z-index", "2"
    $("#over,#s_over").hide()
    return

