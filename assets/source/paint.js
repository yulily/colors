define(["jquery", "backbone", "farbtastic"], function($) {
  var $html, Draw, DrawStart, Utility, bg, btn_change, ctx, drawing, layer, nowLayer, paintDb, penColor, penLeft, penWidth, penX, penY, savenum, size, stampFlg, stampSrc, tmpUtility;
  localStorage.clear();
  penX = void 0;
  penY = void 0;
  ctx = void 0;
  stampSrc = void 0;
  penWidth = void 0;
  size = {
    width: 1702,
    height: 630,
    cameraX: 1702,
    cameraY: 630
  };
  drawing = false;
  stampFlg = false;
  penColor = "#000";
  paintDb = [];
  penLeft = 1;
  nowLayer = 3;
  savenum = 0;
  bg = "#eee";
  $html = {
    sortable: $("#sortable").find("li"),
    tab1: $("#tab1"),
    tab2: $("#tab2"),
    info: $(".info")
  };
  layer = [];
  Draw = {
    init: function() {
      $("#canvas canvas").each(function(i) {
        layer[i] = $(this)[0];
      });
      this.main(0);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size.width, size.height);
      this.main(4);
      paintDb[0] = layer[nowLayer].toDataURL();
      layer.reverse();
    },
    main: function(index) {
      ctx = layer[index].getContext("2d");
      $("#canvas canvas").mousemove(function(e) {
        penX = (e.pageX - parseInt($(this).offset().left)) * 2;
        penY = (e.pageY - parseInt($(this).offset().top)) * 2;
        if (!stampFlg) {
          if (drawing) {
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.lineTo(penX, penY);
            ctx.stroke();
          }
          $(this).mousedown(function() {
            penWidth = penLeft;
            ctx.beginPath();
            ctx.lineWidth = penWidth;
            ctx.strokeStyle = penColor;
            ctx.moveTo(penX, penY);
            drawing = true;
          }).mouseup(function() {
            ctx.closePath();
            drawing = false;
          });
        }
        $("#x").html(penX);
        $("#y").html(penY);
        Draw.layerInfo();
      });
    },
    layerInfo: function() {
      var layer_index, view;
      layer_index = nowLayer;
      view = $("ol li").eq(layer_index).find("img");
      view.attr("src", layer[nowLayer].toDataURL());
    },
    layerSet: function(layer) {
      Draw.main(layer.index());
      $("ol#sortable li").find("img").css("border", "none");
      layer.find("img").css("border", "2px solid #a00");
      nowLayer = layer.index();
    }
  };
  DrawStart = Draw;
  DrawStart.init();
  Draw.prototype = {
    frame: function() {
      var img;
      img = new Image();
      img.src = stampSrc;
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
        DrawStart.layerInfo();
        Draw.prototype.dbSave();
      };
    },
    stamp: function() {
      var img;
      stampFlg = true;
      if (stampFlg) {
        img = new Image();
        img.src = stampSrc;
        img.onload = function() {
          $("#canvas").mousemove(function(e) {
            var sX, sY;
            sX = e.pageX - $(this).offset().left - img.width / 2;
            sY = e.pageY - $(this).offset().top - img.height / 2;
            $(this).mousedown(function() {
              if (!stampFlg) {
                img.src = "";
              } else {
                false;
              }
              ctx.drawImage(img, sX, sY);
            });
          });
          DrawStart.layerInfo();
          Draw.prototype.dbSave();
        };
      }
    },
    insta: function() {
      var centerX, img;
      centerX = 94;
      img = new Image();
      img.src = stampSrc;
      img.onload = function() {
        ctx.drawImage(img, centerX, 0);
        DrawStart.layerInfo();
        Draw.prototype.dbSave();
      };
    },
    dbSave: function(save) {
      var base64, i, list, save_img;
      base64 = layer[nowLayer].toDataURL();
      if (save) {
        window.localStorage.setItem("save" + localStorage.length, base64);
        save_img = $("<img />").attr("src", base64).width("50px").height("34px");
        list = $("<li />").append(save_img);
        $(".tool_03 li ul").append(list);
      } else {
        i = paintDb.length;
        paintDb[i] = base64;
      }
    }
  };
  $.each(localStorage, function(i) {
    var datasrc, list, save_img;
    datasrc = localStorage.getItem("save" + i);
    save_img = $("<img />").attr("src", datasrc).width("50px").height("34px");
    list = $("<li />").append(save_img);
    $(".tool_03 li ul").append(list);
  });
  btn_change = function(btn_src, pro) {
    if (pro === "pencil" || pro === "stamp") {
      if (pro === "pencil" && !btn_src.match(/_on/)) {
        btn_src = btn_src.replace(".", "_on.");
      } else {
        if (pro === "stamp") {
          btn_src = btn_src.replace(/_on/, "");
        }
      }
    } else {
      if (btn_src.match(/_on/)) {
        btn_src = btn_src.replace(/_on/, "");
      } else {
        btn_src = btn_src.replace(".", "_on.");
      }
    }
    return btn_src;
  };
  $("#colorpicker").farbtastic("#color");
  $("#canvas canvas").click(function() {
    var r;
    Draw.prototype.dbSave();
    r = paintDb.length;
    DrawStart.layerInfo();
  });
  $(".paint_back").click(function() {
    var i, img;
    img = new Image();
    if (paintDb.length > 0) {
      i = paintDb.length - 2;
      img.src = paintDb[i];
      img.onload = function() {
        ctx.clearRect(0, 0, size.width, size.height);
        ctx.drawImage(img, 0, 0);
      };
      paintDb.pop(i);
      DrawStart.layerInfo();
    }
  });
  $("ul.tool_01 li").click(function() {
    var btn_c, tool;
    tool = $(this).attr("id");
    if (tool === "pencil") {
      stampFlg = false;
      btn_c = btn_change($("ul.tool_01 li#" + tool).find("img").attr("src"), "pencil");
      $("ul.tool_01 li#" + tool).find("img").attr("src", btn_c);
    }
  });
  $(".slide li").click(function() {
    var btn_c, fs;
    fs = $(this).closest("ul").attr("class").replace(/cf\x20/, "");
    stampSrc = $(this).find("img").attr("src");
    if (fs === "s") {
      Draw.prototype.stamp();
      btn_c = btn_change($("ul.tool_01 li#pencil").find("img").attr("src"), "stamp");
      $("ul.tool_01 li#pencil").find("img").attr("src", btn_c);
    } else if (fs === "f") {
      Draw.prototype.frame();
    } else {
      if (fs === "i") {
        Draw.prototype.insta();
      }
    }
  });
  $("ol li").click(function() {
    Draw.layerSet($(this));
  });
  $(".clickzone").click(function() {
    penColor = $("#color").val();
  });
  $(document).on("click", "ul.imcus li", function() {
    penColor = $(this).text();
  });
  $(document).on("focus", "ul.cust li input", function() {
    var code, numb;
    numb = $(this).parent().index();
    code = $(this).val();
    $(".imcus li").eq(numb).text(code).css("background-color", code);
  });
  $(".paint_delete").click(function() {
    ctx.clearRect(0, 0, size.width, size.height);
    DrawStart.layerInfo();
  });
  $(".paint_save").click(function() {
    Draw.prototype.dbSave("save");
  });
  $(document).on("click", "ul.tool_03 li", function() {
    var base64, img, num;
    if ($(this).index() !== 0) {
      num = $(this).index() - 1;
      base64 = localStorage.getItem("save" + num);
      img = new Image();
      img.src = base64;
      ctx.clearRect(0, 0, size.width, size.height);
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
        DrawStart.layerInfo();
      };
    }
  });
  Utility = Backbone.View.extend({
    el: ".funciton",
    events: {
      "click #tab1 header": "tabSwitch1",
      "click #tab2 header": "tabSwitch2"
    },
    tabSwitch1: function() {
      $html.tab2.removeClass("cur");
      $html.tab1.addClass("cur");
    },
    tabSwitch2: function() {
      $html.tab1.removeClass("cur");
      $html.tab2.addClass("cur");
    }
  });
  tmpUtility = new Utility();
  $("#weight").change(function() {
    penLeft = $(this).val();
    $("#w").html(penLeft);
  });
  $(window).keyup(function(event) {
    var maxpenWidth, minpenWidth;
    maxpenWidth = 100;
    minpenWidth = 1;
    if (penLeft >= minpenWidth && penLeft <= maxpenWidth) {
      if (event.keyCode === 38) {
        if (penLeft !== maxpenWidth) {
          penLeft = penLeft + 1;
        } else {
          false;
        }
      } else {
        if (event.keyCode === 40) {
          if (penLeft !== minpenWidth) {
            penLeft = penLeft - 1;
          } else {
            false;
          }
        }
      }
      $(".get").css("left", penLeft + "px");
      $("#w").html(penLeft);
      $("#weight").val = penLeft;
    }
  });
  $(".drag").mousedown(function(e) {
    $(this).closest("section").data("X", e.pageX - $(this).closest("section").position().left).data("Y", e.pageY - $(this).closest("section").position().top).mousemove(function(e) {
      $(this).closest("section").css({
        top: e.pageY - $(this).closest("section").data("Y") + "px",
        left: e.pageX - $(this).closest("section").data("X") + "px"
      });
    }).mouseup(function(e) {
      $(this).unbind("mousemove");
    });
  });
  $(".save").click(function() {
    var mc, paint_data, property;
    $("#s_over form input").not("#regist").remove();
    mc = document.createElement("canvas");
    mc.width = size.width;
    mc.height = size.height;
    for (property in layer) {
      mc.getContext("2d").drawImage(layer[property], 0, 0);
    }
    $("#canvas").css("z-index", "7");
    $("#over,#s_over").show();
    paint_data = mc.toDataURL();
    paint_data = paint_data.replace(/^.*,/, "");
    $("<input />").attr("type", "hidden").attr("name", "paint").attr("value", paint_data).appendTo("#btn form");
  });
  $("#back").click(function() {
    $("#canvas").css("z-index", "2");
    $("#over,#s_over").hide();
  });
});
