define [
  "jquery"
  "backbone"
  "farbtastic"
], ($) ->
  _Canvas = new _Canvas()
  _Tool   = new _Tool()

  $html =
    sortable: $("#sortable").find("li")
    tab1: $("#tab1")
    tab2: $("#tab2")
    info: $(".info")
    penW: $("#pen-width")

  # paint start
  $("#canvas canvas").on
  # タッチの開始、マウスボタンを押したとき
    "mousedown": () ->
      unless stampFlg
        if _Canvas.drawing
          _Canvas.touchStart()
    "mousemove": () ->
      _Canvas.touchMove()
    "mouseup mouseout": () ->
      _Canvas.touchEnd()

  # paint data layer
  $("#canvas canvas").click ->
    Draw::dbSave()
    r = paintDb.length
    DrawStart.layerInfo()
    return

  # layer change
  $("ol li").click ->
    Draw.layerSet $(this)
    return

  # controller
  Utility = Backbone.View.extend(
    el: "#optionTool"
    events:
      "click .slide.stamp li": "pushStamp"
      "click .slide.frame li": "pushFrame"
  )

  # controller
  Utility = Backbone.View.extend(
    el: ".funciton"
    events:
      "click #tab1 header": "tabSwitch1"
      "click #tab2 header": "tabSwitch2"
  )

  # controller
  Utility = Backbone.View.extend(
    el: "#headerTool"
    events:
      "click #headerTool .back": "paintBack"
      "click #headerTool .next": "paintNext"
      "click #headerTool .local-save": "paintLocalSave"
      "click #headerTool .delete": "paintDelete"
      "click #headerTool .save": "paintSave"
  )
  # view
  Utility = Backbone.View.extend(
    el: "#asideTool"
    events:
      "click #asideTool .pen": "usePen"
      "click #asideTool .figure": "useShape"
      "click #asideTool .frame": "useFrame"
      "click #asideTool .stamp": "useStamp"
      "click #asideTool .local-result": "useLocalSave"
      "click #asideTool .webcamera": "useWebCamera"

    initialize:->
      _.bindAll(@)

    tabSwitch1: ->
      $html.tab2.removeClass "cur"
      $html.tab1.addClass "cur"
      return

    tabSwitch2: ->
      $html.tab1.removeClass "cur"
      $html.tab2.addClass "cur"
      return
  )

  # /_ plugin setting
  # penColor Change
  $("#colorpicker").farbtastic "#color"
  $(".clickzone").click ->
    penColor = $("#color").val()
    return
  $(document).on "click", "ul.imcus li", ->
    penColor = $(this).text()
    return
  $(document).on "focus", "ul.cust li input", ->
    numb = $(this).parent().index()
    code = $(this).val()
    $(".imcus li").eq(numb).text(code).css "background-color", code
    return
  # plugin setting _/
