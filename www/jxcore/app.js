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

var files = [];

function generateName(name) {
    if (files.some(function (file) { return file.metadata.name === name; })) {
        var s = '(',
            e = ')';
        var si = name.lastIndexOf(s);
        var ei = name.lastIndexOf(e);
        if (ei !== name.length - 1) {
            return generateName(name + s + 1 + e);
        } else {
            var n = parseInt(name.substring(si + 1, ei));
            return generateName(name.replace(s + n + e, s + (n + 1) + e));
        }
    } else {
        return name;
    }
}


io.on('connection', function(socket) {
    socket.on('getFileMetadatas', function (data, callback) {
        callback(null, files.map(function (file) {
            return file.metadata;
        }));
    });

    socket.on('addFile', function (file, callback) {
        file.metadata.name = generateName(file.metadata.name);
        files.push(file);
        io.emit('file-added', file.metadata);
        callback(null);
    });

    socket.on('getFile', function (data, callback) {
        var file = utils.findOne(files, {
            'metadata.name': data.name
        });
        if (!file) {
            callbac('File does not exist');
        } else {
            callback(null, file);
        }
    });

    socket.on('removeFile', function (data, callback) {
        var i, file;
        for (i = 0; i < files.length; i++) {
            file = files[i];
            if (file.metadata.name === data.name) {
                files.splice(i, 1);
                io.emit('file-removed', file.metadata);
                callback(null, file.metadata);
                break;
            }
        }
    });
});

app.get('/download/:name', function (req, res) {
    var file = utils.findOne(files, {
        'metadata.name': req.params.name
    });
    if (!file) {
        res.status(404).send('File does not exist');
    } else {
        res.setHeader('Content-disposition', 'attachment; filename=' + file.metadata.name);
        res.setHeader('Content-type', file.metadata.type);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.send(file.content);
    }
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