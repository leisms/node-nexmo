/*!
 * node-nexmo
 * Copyright(c) 2011 Paul O'Fallon <paul@ofallonfamily.com>
 * MIT Licensed
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var connect = require('connect');

function Receipts(options) {
    this.options = options || {};
    this.server = null;
}

util.inherits(Receipts, EventEmitter);

Receipts.prototype.attach = function(server, endpoint) {
    var that = this;
    this.server = server
    this.server.use(connect.query()).use(endpoint, function(req, res) {
        res.writeHead(200);
        res.end();
        if (typeof req.query.status !== 'undefined') {
            that.emit('inbound-message', {
                'type': req.query.type
                , 'to': req.query.to
                , 'msisdn': req.query.msisdn
                , 'network-code': req.query['network-code']
                , 'messageId': req.query.messageId
                , 'message-timestamp': req.query['message-timestamp']
                , 'text': req.query.text
            });
        } else if (typeof req.query.type !== 'undefined') {
            that.emit('inbound-message', {
                'type': req.query.type
                , 'to': req.query.to
                , 'msisdn': req.query.msisdn
                , 'network-code': req.query['network-code']
                , 'messageId': req.query.messageId
                , 'message-timestamp': req.query['message-timestamp']
                , 'text': req.query.text
            });
        }
    });
    return this.server
}

Receipts.prototype.start = function(opts, callback) {

    var opts;

    if (!opts) {
        opts = {
            port: 3001
        }
    }

    this.attach(connect(), '/receipts');
    this.server.listen(opts.port || 3001);

};

Receipts.prototype.stop = function(country, callback) {

    this.server.close();

};

module.exports = Receipts;
