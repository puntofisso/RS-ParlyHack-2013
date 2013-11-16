var IS_ALL_LOCAL = true;

/*** TRANSITIONS ***/

function visit_upcoming_business() { jQuery.mobile.changePage('upcoming-business.html', { transition: 'slide' }); }

/*** PAGE LOAD EVENTS ***/

$(document).delegate('#upcoming-business-page', 'pageshow', load_upcoming_business);

function load_upcoming_business() {
    // #commons-upcoming-business-list
    // #lords-upcoming-business-list

    alert('upcoming business load');
    
    var business = null;
    if (IS_ALL_LOCAL) {
        business = fake_topic_data();
    } else {
        business = remote_retrieve_topic_data();
    }
    
    populate_upcoming_business(business);
}

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
    // $('#posts-list-ul').attr('data-split-icon', 'delete');
    
    // apply listview
    $('#commons-upcoming-business-list').listview('refresh');
}