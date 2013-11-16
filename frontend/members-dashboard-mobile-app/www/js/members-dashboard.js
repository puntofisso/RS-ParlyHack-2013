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
    
    
    
}