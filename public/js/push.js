// Gets the list of campuses from the server once the page loads
$.ajax({
    type: 'get',
    url: 'api/campuses',
    success: function (response) {
        var campuses = $(response);

        campuses.each(function (index, campus) {
            $('select[name="ministries[]"]').append("<option data-id='" + campus._id + "' disabled>----- " + campus.name + " -----</option>");

            $.ajax({
                type: 'GET',
                url: 'api/campuses/' + campus._id + '/ministries',
                async: false,
                success: function (ministries) {
                    var ministries = $(ministries); //TODO: Look into removing the double declaration

                    ministries.each(function (index, ministry) {
                        $('#push-form select[name="ministries[]"]').append("<option value='" + ministry._id + "'>" + ministry.name + "</option>");
                        $('#schedule-form select[name="ministries[]"]').append("<option value='" + ministry._id + "'>" + ministry.name + "</option>");
                    });
                }
            });
        });
        $('select[name="ministries[]"]').attr('size', $('#push-form select[name="ministries[]"] option').length);
    }
});

// Initializes the basic push notification form
$("#push-form").ajaxForm({
    success: function (response) {
        if (response.success === true) {
            $('#result').html("Message sent successfully");
            $('#result').removeClass('text-danger');
            $('#result').addClass('text-success');

            $.ajax({
                type: 'POST',
                url: 'api/notifications',
                body: {
                    body: $("#push-form textarea").val(),
                    sent: true,
                    ministries: $("#push-form select").val(),
                    time: new Date()
                }
            });
        }
        else {
            $('#result').html("Message failed to send");
            $('#result').removeClass('text-success');
            $('#result').addClass('text-danger');
        }
    }
});

// Initializes the scheduled notification form
$("#schedule-form").ajaxForm({
    beforeSubmit: function (arr, $form, options) {
        var time = new Date(arr[1].value);
        arr[1].value = time.toISOString();
    },
    success: function (response) {
        $("#scheduled-notifications").load('/notifications/renderScheduledNotifications');
    }
});

// Initializes the datetimepicker bootstrap widget
$("#datetimepicker").datetimepicker({
    format: 'YYYY-MM-DD hh:mm A'
});

// Attaches a click event to the event list in order to render the event notification page
$(".list-group-item").click(function () {
    var item = $(this);
    $('#event-notifications').load('/notifications/renderEventNotifications', { event_id: item.attr('data-id') }, function () {
        $('#create-event-notification-form').ajaxForm({
            success: function () {
                $('#event-notification-table').load('/notifications/renderEventNotificationTable', { event_id: item.attr('data-id') });
            }
        });
    });
});