define(["jquery", "backbone", "farbtastic"], function($) {
  var $html, Utility, _Canvas, _Tool;
  _Canvas = new _Canvas();
  _Tool = new _Tool();
  $html = {
    sortable: $("#sortable").find("li"),
    tab1: $("#tab1"),
    tab2: $("#tab2"),
    info: $(".info"),
    penW: $("#pen-width")
  };
  $("#canvas canvas").on({
    "mousedown": function() {
      if (!stampFlg) {
        if (_Canvas.drawing) {
          return _Canvas.touchStart();
        }
      }
    },
    "mousemove": function() {
      return _Canvas.touchMove();
    },
    "mouseup mouseout": function() {
      return _Canvas.touchEnd();
    },
    "click": function() {
      var r;
      Draw.prototype.dbSave();
      r = paintDb.length;
      DrawStart.layerInfo();
    }
  });
  $("#layer li").click(function() {});
  Utility = Backbone.View.extend({
    el: "#optionTool",
    events: {
      "click .slide.stamp li": "pushStamp",
      "click .slide.frame li": "pushFrame"
    }
  });
  Utility = Backbone.View.extend({
    el: ".funciton",
    events: {
      "click #tab1 header": "tabSwitch1",
      "click #tab2 header": "tabSwitch2",
      "click #layer li": "layerSwitch"
    },
    tabSwitch1: function() {
      $html.tab2.removeClass("cur");
      $html.tab1.addClass("cur");
    },
    tabSwitch2: function() {
      $html.tab1.removeClass("cur");
      $html.tab2.addClass("cur");
    },
    layerSwitch: function() {
      return Draw.layerSet($(this.el));
    }
  });
  Utility = Backbone.View.extend({
    el: "#headerTool",
    events: {
      "click #headerTool .back": "paintBack",
      "click #headerTool .next": "paintNext",
      "click #headerTool .local-save": "paintLocalSave",
      "click #headerTool .delete": "paintDelete",
      "click #headerTool .save": "paintSave"
    }
  });
  Utility = Backbone.View.extend({
    el: "#asideTool",
    events: {
      "click #asideTool .pen": "usePen",
      "click #asideTool .figure": "useShape",
      "click #asideTool .frame": "useFrame",
      "click #asideTool .stamp": "useStamp",
      "click #asideTool .local-result": "useLocalSave",
      "click #asideTool .webcamera": "useWebCamera"
    },
    initialize: function() {
      return _.bindAll(this);
    }
  });
  $("#colorpicker").farbtastic("#color");
  $(".clickzone").click(function() {
    var penColor;
    penColor = $("#color").val();
  });
  $(document).on("click", "ul.imcus li", function() {
    var penColor;
    penColor = $(this).text();
  });
  return $(document).on("focus", "ul.cust li input", function() {
    var code, numb;
    numb = $(this).parent().index();
    code = $(this).val();
    $(".imcus li").eq(numb).text(code).css("background-color", code);
  });
});
