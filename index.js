// index.js
var _ = require('underscore');
var ChangesTracker = require('./static/js/changesTracker');

// Hook into the 'postToolbarInit' event to initialize the plugin UI
exports.postToolbarInit = function (hook_name, context, cb) {
    // Initialize the plugin's interface
    ChangesTracker.initializeUI();
    cb();
};

// Hook into 'handleMessage' to track changes made by collaborators
exports.handleMessage = function (hook_name, context, cb) {
    var message = context.message;
    
    if (message.type === 'COLLABROOM' && message.data && message.data.type === 'USER_CHANGES') {
        // Capture the changes
        ChangesTracker.captureChange(message.data);
    }
    cb();
};

// Hook for when a creator accepts or rejects changes
exports.aceEditEvent = function (hook_name, context, cb) {
    ChangesTracker.processEditEvent(context);
    cb();
};
