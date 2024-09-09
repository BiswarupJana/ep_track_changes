'use strict';

let changesList = [];

const trackChanges = {
  init: function() {
    $('#trackChangesButton').click(function() {
      trackChanges.toggleChangesPopup();
    });

    pad.socket.on('track_change', function(data) {
      changesList = data.change;
      trackChanges.renderChanges();
    });

    pad.socket.on('reject_change', function(data) {
      trackChanges.removeChange(data.changeIndex);
    });
  },

  toggleChangesPopup: function() {
    const popup = $('#trackChangesPopup');
    popup.toggleClass('visible');
    this.renderChanges();
  },

  renderChanges: function() {
    const popup = $('#trackChangesPopupContent');
    popup.html('');
    changesList.forEach((change, index) => {
      const changeItem = `<div class="change-item">
                            <p><strong>${change.user}</strong> made a change: ${change.change}</p>
                            <p>Time: ${change.time}</p>
                            <button data-index="${index}" class="accept-change">Accept</button>
                            <button data-index="${index}" class="reject-change">Reject</button>
                          </div>`;
      popup.append(changeItem);
    });

    $('.accept-change').click(function() {
      const index = $(this).data('index');
      trackChanges.acceptChange(index);
    });

    $('.reject-change').click(function() {
      const index = $(this).data('index');
      trackChanges.rejectChange(index);
    });
  },

  acceptChange: function(index) {
    pad.socket.emit('custom', {
      type: 'track_changes_decision',
      data: { changeIndex: index, decision: 'accept', padId: pad.id }
    });
  },

  rejectChange: function(index) {
    pad.socket.emit('custom', {
      type: 'track_changes_decision',
      data: { changeIndex: index, decision: 'reject', padId: pad.id }
    });
  },

  removeChange: function(index) {
    changesList.splice(index, 1);
    this.renderChanges();
  }
};

exports.postAceInit = (hook, context) => {
  trackChanges.init();
};
