const socketIO = require('socket.io');
const jwt = require('fesjs/lib/jwt');
const { getUser } = _db('providers/base/UserProvider');
let _io = null;

function boostSocketIO(server) {
  _io = socketIO(server);
  _io.on('connection', function(socket) {
    _log('user connected ', socket.id);
    socket.on('subscribe', async function({ pageId, userId, token }) {
      // join userId
      if (userId) {
        console.log('join', socket.id, 'to ', userId);
        socket.join(userId);
        socket.emit('notify', {
          type: 'success',
          message: 'join ' + socket.id + ' to room("userId") : ' + userId,
          slient: true
        });
      }

      // join userId
      if (token) {
        try {
          let tokenData = jwt.verify(token);
          const user = await getUser({
            email: tokenData.email,
            username: tokenData.username
          });
          socket.join(user._id);
          _log('socket join user ', user);
          socket.emit('notify', {
            type: 'success',
            message: 'join ' + socket.id + ' to room("userId") : ' + user._id,
            slient: true
          });
        } catch (error) {
          _log('socket subscribe error', error);
        }
      }

      // join pageId
      if (pageId) {
        console.log('join', socket.id, 'to ', pageId);
        socket.join(pageId);
        socket.emit('notify', {
          type: 'success',
          message: 'join ' + socket.id + ' to room("pageId") : ' + pageId,
          slient: true
        });
      }
    });
  });
  return _io;
}

module.exports = { boostSocketIO, io: () => _io };
