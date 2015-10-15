var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    env = app.get('env'),
    utils = require('./shared/js/utils'),
    path = require('path');

var isMobile = typeof Mobile !== 'undefined';
var staticFolderPath = path.resolve(__dirname, env === 'development' && !isMobile ? '../../public' : './build');
app.use(express.static(staticFolderPath));

['jxcore', 'cordova'].forEach(function (name) {
    app.get('/' + name + '.js', function (req, res) {
        res.send('window.' + name + '="none";');
    });
});

function getSocketById(socketId) {
    return io.sockets.sockets.filter(function (socket) {
        return socket.id === socketId;
    })[0];
}

function getGameById(gameId) {
    return io.sockets.sockets.filter(function (socket) {
        return socket.game && socket.game.id === gameId;
    }).map(function (socket) {
        return socket.game;
    })[0];
}

function getGames() {
    return io.sockets.sockets.filter(function (socket) {
        return socket.game;
    }).map(function (socket) {
        return socket.game;
    });
}

io.on('connection', function(socket) {
    socket.on('error', function (err) {
        console.log(err);
    });

    socket.on('create-game', function (game, callback) {
        var game = {
            id: '' + Date.now(),
            maxPlayers: game.maxPlayers,
            turnIndex: game.turnIndex,
            width: game.width,
            height: game.height,
            winningScore: game.winningScore,
            creator: socket.id,
            players: [],
            started: false
        };
        socket.game = game;
        io.emit('game-created', game);
        callback(null, game);
    });

    socket.on('get-games', function (data, callback) {
        var games = io.sockets.sockets.map(function (_socket) {
            return _socket.game;
        }).filter(function (game) {
            return game;
        });
        callback(null, games);
    });

    socket.on('enter-game', function (data, callback) {
        var game = io.sockets.sockets.filter(function (_socket) {
            return _socket.game && _socket.game.id === data.gameId;
        }).map(function (_socket) {
            return _socket.game;
        })[0];

        if (!game) {
            callback('No game found with id: ' + data.gameId);
        } else if (game.started) {
            callback('Game has already started');
        } else {
            if (game.players.indexOf(socket.id) === -1) {
                if (game.maxPlayers === game.players.length) {
                    callback('Game is full of players');
                } else {
                    game.players.push(socket.id);
                    io.emit('player-joined-game', {
                        playerSocketId: socket.id,
                        gameId: game.id
                    });
                }
            }
            callback(null, game);
        }
    });

    socket.on('start-game', function (data, callback) {
        var game = getGameById(data.gameId);
        if (!game) {
            callback('Game does not exist');
        } else if (game.players.indexOf(socket.id) === -1) {
            callback('You are not a player of this game');
        } else {
            game.started = true;
            io.sockets.sockets.forEach(function (_socket) {
                _socket.emit('game-started', {
                    gameId: game.id,
                    meIndex: game.players.indexOf(_socket.id)
                });
            });
            callback();
        }
    });

    socket.on('fill', function (data, callback) {
        var game = getGameById(data.gameId);
        if (!game) {
            callback('Game not found');
        } else if (game.players.indexOf(socket.id) === -1) {
            callback('You are not playing this game');
        } else {
            game.players.forEach(function (playerSocketId) {
                if (socket.id !== playerSocketId) {
                    var playerSocket = getSocketById(playerSocketId);
                    if (playerSocket) {
                        playerSocket.emit('filled', {
                            i: data.i,
                            j: data.j,
                            gameId: game.id
                        });
                    }
                }
            });
            callback();
        }
    });

    socket.on('leave-game', function (data, callback) {
        if (socket.game) {
            io.emit('game-discarded', {
                gameId: socket.game.id
            });
            socket.game = null;
        } else {
            io.sockets.sockets.forEach(function (_socket) {
                if (_socket.game) {
                    var game = _socket.game;
                    var players = game.players;
                    players.splice(players.indexOf(socket.id), 1);
                    if (game.players.length === 0) {
                        _socket.game = null;
                        io.emit('game-discarded', {
                            gameId: game.id
                        });
                    } else {
                        io.emit('player-left-game', {
                            gameId: game.id,
                            playerSocketId: socket.id
                        });
                    }
                }
            });
        }
        callback(null);
    });

    socket.broadcast.emit('player-connected', {
        socketId: socket.id
    });

    socket.on('disconnect', function () {
        if (socket.game) {
            io.emit('game-discarded', {
                gameId: socket.game.id
            });
        } else {
            io.sockets.sockets.forEach(function (_socket) {
                var game = _socket.game;
                if (game) {
                    var players = game.players;
                    var playerIndex = players.indexOf(socket.id);
                    if (playerIndex !== -1) {
                        players.splice(playerIndex, 1);
                        if (game.players.length === 0) {
                            _socket.game = null;
                            io.emit('game-discarded', {
                                gameId: game.id
                            });
                        } else {
                            io.emit('player-left-game', {
                                gameId: game.id,
                                playerSocketId: socket.id
                            });
                        }
                    }
                }
            });
        }
    });
});

var port = process.env.PORT || 8001;
http.listen(port, function() {
    console.log('listening on *:' + port);
});

function getHost() {
    var os = require('os');
    var net = os.networkInterfaces();
    var ips = [];

    for (var ifc in net) {
        var addrs = net[ifc];
        for (var a in addrs) {
            if (addrs[a].family == 'IPv4' && !addrs[a].internal) {
                var addr = addrs[a].address;
                if (addr.indexOf('192.168.') == 0 || addr.indexOf('10.0.') == 0) {
                    ips.push(addr);
                }
            }
        }
    }

    if (ips.length == 0) {
        if (net.hasOwnProperty('en0') || net.hasOwnProperty('en1')) {
            var addrs = net['en0'] || net['en1'];
            for (var a in addrs) {
                if (addrs[a].family == 'IPv4' && !addrs[a].internal) {
                    var addr = addrs[a].address;
                    ips.push(addr);
                }
            }
        }

        if (ips.length == 0) {
            for (var ifc in net) {
                var addrs = net[ifc];
                for (var a in addrs) {
                    if (addrs[a].family == 'IPv4' && !addrs[a].internal) {
                        var addr = addrs[a].address;
                        ips.push(addr);
                    }
                }
            }
        }
    }

    return 'http://' + ips[0] + ':' + port;
}

if (isMobile) {
    Mobile('getHost').registerSync(getHost);
}