// static/js/changesTrackerUI.js

var ChangesTrackerUI = {
    renderChangesList: function (changes) {
        var changesListContainer = $('#changes-list');
        changesListContainer.html('');

        changes.forEach(function (change, index) {
            var changeElement = `
                <div class="change-item">
                    <p>${change.text}</p>
                    <button class="accept-change" data-index="${index}">Accept</button>
                    <button class="reject-change" data-index="${index}">Reject</button>
                </div>
            `;
            changesListContainer.append(changeElement);
        });

        // Attach click handlers for accept/reject buttons
        $('.accept-change').on('click', function () {
            var index = $(this).data('index');
            ChangesTracker.acceptChange(index);
        });
        
        $('.reject-change').on('click', function () {
            var index = $(this).data('index');
            ChangesTracker.rejectChange(index);
        });
    }
};
