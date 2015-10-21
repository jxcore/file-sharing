var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    env = app.get('env'),
    utils = require('./shared/js/utils'),
    async = require('./shared/js/async')
    path = require('path'),
    fs = require('fs'),
    mime = require('mime'),
    mkdirp = require('mkdirp'),
    multer = require('multer');

var isMobile = typeof Mobile !== 'undefined';
var staticFolderPath = path.resolve(__dirname, env === 'development' && !isMobile ? '../../public' : './build');
app.use(express.static(staticFolderPath));

// allow cross domain requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// serve jxcore and cordova files when not mobile
['jxcore', 'cordova'].forEach(function (name) {
    app.get('/' + name + '.js', function (req, res) {
        res.send('window.' + name + '="none";');
    });
});

// path where files are uploaded
var uploadsPath = path.resolve(__dirname, './uploads');

// log
var logWhenMobile = true;
function log(data) {
    if (isMobile) {
        if (logWhenMobile) {
            Mobile('alert').call(JSON.stringify(data));
        }
    } else if (env === 'development') {
        console.dir(data);
    }
}

// create directory if not exists
function readdir(dirPath, callback) {
    mkdirp(dirPath, function (err) {
        if (err) {
            callback(err);
        } else {
            fs.readdir(dirPath, callback);
        }
    });
}

io.on('connection', function(socket) {
    socket.on('getFileMetadatas', function (data, callback) {
        readdir(uploadsPath, function (err, fileNames) {
            if (err) {
                log(err);
                callback('Error reading uploads directory');
            } else {
                async.map(fileNames, function (fileName, cb) {
                    var filePath = path.resolve(uploadsPath, fileName);
                    fs.stat(filePath, function (err, stats) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, {
                                name: fileName,
                                size: stats.size
                            });
                        }
                    });
                }, function (err, metadatas) {
                    if (err) {
                        console.log(err);
                        callback('Error reading file');
                    } else {
                        callback(null, metadatas);
                    }
                });
            }
        });
    });

    socket.on('removeFile', function (data, callback) {
        var filePath = path.join(uploadsPath, data.name);
        fs.unlink(filePath, function (err) {
            if (err) {
                log(err);
                callback('Problem removing file');
            } else {
                var metadata = {
                    name: data.name
                };

                io.emit('file-removed', metadata);
                callback(null, metadata);
            }
        });
    });
});

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            mkdirp(uploadsPath, function (err) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, uploadsPath);
                }
            });
        },

        // ToDo: create unique file name (enumerate)
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

app.post('/upload', function (req, res) {
    upload.single('file')(req, res, function(err) {
        if(err) {
            log(err);
            callback('Error writing file');
        } else {
            io.emit('file-added', {
                name: req.file.filename,
                size: req.file.size
            });
            res.send();
        }
    });
});

app.get('/download/:name', function (req, res) {
    var fileName = req.params.name;
    var filePath = path.resolve(uploadsPath, fileName);
    fs.readFile(filePath, function (err, file) {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send();
            } else {
                log(err);
                res.status(500).send('Server error');
            }
        } else {
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.setHeader('Content-type', mime.lookup(fileName));
            res.send(file);
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