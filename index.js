// index.js

const ChangesTracker = require('./static/js/trackChanges');

exports.expressCreateServer = (hook_name, args, cb) => {
  // Add the route for the change tracker UI
  args.app.get('/plugin/ep_track_changes/ui', (req, res) => {
    res.sendFile(__dirname + '/templates/trackChanges.html');
  });
};

// Middleware to make sure only the creator sees the accept/reject buttons
exports.handleMessage = (hook_name, context, cb) => {
  const message = context.message;
  if (message.type === 'COLLABROOM' && message.data && message.data.type === 'USER_CHANGES') {
    ChangesTracker.captureChange(message.data);
  }
  cb();
};
