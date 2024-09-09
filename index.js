'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
const Changeset = require('ep_etherpad-lite/static/js/Changeset');
const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');

let changes = [];

// Middleware to track changes made in the pad
exports.handleMessage = (hook_name, context, cb) => {
  const message = context.message;
  const pad = context.pad;

  if (message.type === 'COLLABROOM' && message.data && message.data.type === 'edit') {
    const { userInfo, padId, changeset, apool } = message.data;

    // Extract operations from the changeset
    const unpackedChangeset = Changeset.unpack(changeset);
    const operations = unpackedChangeset.ops;

    const timestamp = new Date().toISOString();

    changes.push({
      user: userInfo.name,
      operations,
      time: timestamp,
      padId,
      accepted: false
    });

    padMessageHandler.updatePadClients(pad, { type: 'track_change', change: changes });
  }

  cb(null);
};

// Serve the changes tracking UI
exports.expressCreateServer = (hook_name, args, cb) => {
  args.app.get('/plugin/ep_track_changes/ui', (req, res) => {
    res.sendFile(__dirname + '/templates/trackChanges.html');
  });
};

// Add "Track Changes" button to the editor toolbar
exports.eejsBlock_editbarMenuLeft = (hookName, args, cb) => {
  if (args.renderContext.isReadOnly) return cb();

  const toolbarHtml = eejs.require('ep_track_changes/templates/trackChangesButton.ejs');
  args.content += toolbarHtml;

  cb();
};

// Handle accept/reject actions
exports.handleCustomMessage = (hook_name, context, cb) => {
  const message = context.message;
  const pad = context.pad;

  if (message.type === 'track_changes_decision') {
    const { changeIndex, decision, padId } = message.data;

    if (decision === 'accept') {
      changes[changeIndex].accepted = true;
    } else if (decision === 'reject') {
      const changeToUndo = changes[changeIndex].operations;

      const undoChangeset = Changeset.inverse(pad.atext.text, changeToUndo);
      const newChangeset = Changeset.compose(pad.atext.text, undoChangeset);
      
      padMessageHandler.updatePadClients(padId, { type: 'reject_change', changeIndex });
      
      pad.appendRevision(newChangeset);
      changes.splice(changeIndex, 1);
    }
  }

  cb(null);
};
