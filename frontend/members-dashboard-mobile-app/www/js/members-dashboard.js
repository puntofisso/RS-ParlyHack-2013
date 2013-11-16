var IS_ALL_LOCAL = false;

/*** TRANSITIONS ***/

function visit_upcoming_business() { jQuery.mobile.changePage('upcoming-business.html', { transition: 'slide' }); }

/*** PAGE LOAD EVENTS ***/

$(document).delegate('#upcoming-business-page', 'pageshow', load_upcoming_business);

function load_upcoming_business() {
    // #commons-upcoming-business-list
    // #lords-upcoming-business-list

    alert('loading upcoming business...');
    
    if (IS_ALL_LOCAL) {
        var business = null;
        business = fake_topic_data();
        populate_upcoming_business(business);
    } else {
        remote_retrieve_topic_data(populate_upcoming_business);
    }
    
}

/*** remote retrieve data ***/

var CALENDAR_URL = 'http://1e0c030.ngrok.com/calendar.php';

function remote_retrieve_topic_data(success_function) {
    $.ajax({
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        data: "{null}",
        url: CALENDAR_URL,
        dataType:"json",
        success: function(res) {
            var obj = JSON.parse(res);
            success_function(obj);
        },
        error: function(err,status,statusTxt) {
            alert('An error occurred retrieving the schedule: ' + statusTxt);
        }
    });
}

/*** UI population ***/

function populate_upcoming_business(items) {
    var ul = '';
    ul += '<li data-role="list-divider">Upcoming...</li>';
    
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
                
        var li =
                '<li>' +
                    '<a>' +
                        '<img src="img/portcullis.png" />' +
                        '<h3 style="font-weight: normal;">' + item.subject + '</h3>' +
                        '<p>' + item.date + '</p>' +
                    '</a>' +
                    //'<a href="#" onclick="alert(\'Delete not yet implemented.\');"></a>' +
                '</li>';
                
        ul += li;
    }

    // set up list    
    $('#commons-upcoming-business-list').html(ul);
    $('#commons-upcoming-business-list').attr('data-role', 'listview');
    $('#commons-upcoming-business-list').attr('data-inset', 'true');
    $('#commons-upcoming-business-list').listview('refresh');
}