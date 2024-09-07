// static/js/trackChanges.js

let changes = [];
let isCreator = false;

const ChangesTracker = {
  initialize: function() {
    const userId = pad.getUserId();
    isCreator = pad.isPadCreator(userId);
    if (isCreator) {
      this.addToolbarIcon();
    }
  },

  addToolbarIcon: function() {
    $('#editbar .menu_left').append(`
      <button id="trackChangesButton" title="Track Changes">
        <i class="fa fa-pencil"></i> Track Changes
      </button>
    `);
    $('#trackChangesButton').click(() => this.showChangesUI());
  },

  captureChange: function(changeData) {
    changes.push({
      author: changeData.author,
      text: changeData.text,
      timestamp: new Date(),
      accepted: false,
      rejected: false
    });
  },

  showChangesUI: function() {
    // if (!isCreator) return;

    const changesList = changes.map((change, index) => {
      return `
        <li>
          <strong>${change.author}</strong> at ${change.timestamp.toLocaleTimeString()}:
          ${change.text}
          <button onclick="ChangesTracker.acceptChange(${index})">Accept</button>
          <button onclick="ChangesTracker.rejectChange(${index})">Reject</button>
        </li>
      `;
    }).join('');

    $('#editorcontainerbox').append(`
      <div id="changesSidebar" style="position: absolute; right: 0; width: 300px; background: #f9f9f9; padding: 10px;">
        <h3>Tracked Changes</h3>
        <ul>${changesList}</ul>
      </div>
    `);
  },

  acceptChange: function(index) {
    changes[index].accepted = true;
    this.applyChange(index);
    this.updateUI();
  },

  rejectChange: function(index) {
    changes.splice(index, 1); // Remove the change if rejected
    this.updateUI();
  },

  applyChange: function(index) {
    const change = changes[index];
    // Logic to apply the change to the document
  },

  updateUI: function() {
    $('#changesSidebar ul').html(this.showChangesUI());
  }
};

$(document).ready(function() {
  ChangesTracker.initialize();
});

module.exports = ChangesTracker;
