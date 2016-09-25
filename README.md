# Nodeweb

express 中操作 session 要用到 express-session (https://github.com/expressjs/session ) 这个模块，主要的方法就是session(options)，其中 options 中包含可选参数，主要有：

name: 设置 cookie 中，保存 session 的字段名称，默认为 connect.sid 。
store: session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等。express 生态中都有相应模块的支持。
secret: 通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
cookie: 设置存放 session id 的 cookie 的相关选项，默认为
(default: { path: '/', httpOnly: true, secure: false, maxAge: null })
genid: 产生一个新的 session_id 时，所使用的函数， 默认使用 uid2 这个 npm 包。
rolling: 每个请求都重新设置一个 cookie，默认为 false。
resave: 即使 session 没有被修改，也保存 session 值，默认为 true。



