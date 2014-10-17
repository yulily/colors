
module.exports = {
  index : ->
    console.log 'huhu'
    socketIO = require("socket.io")

    # クライアントの接続を待つ(IPアドレスとポート番号を結びつけます)
    io = socketIO.listen(server)

    # クライアントが接続してきたときの処理
    io.sockets.on "connection", (socket) ->
      console.log "connection"

      # メッセージを受けたときの処理
      socket.on "message", (data) ->

        # つながっているクライアント全員に送信
        console.log "message"
        io.sockets.emit "message",
          value: data.value

        return

      # クライアントが切断したときの処理
      socket.on "disconnect", ->
        console.log "disconnect"
        return
  room  : ->


}
