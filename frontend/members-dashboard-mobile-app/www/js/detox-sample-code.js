/*** CONFIG ***/

var IS_ALL_LOCAL = true; // a hack to switch all operations to local simulations of network services

/*** LOCAL VARIABLES ***/

var LOCAL_ACCOUNT = null;

/*** LOGIN ***/

function login_process() {
    var email = $('#email').val();
    
    // qqLGW: validate email as an email address
    
    if (IS_ALL_LOCAL) {
        local_login(email);
    } else {
        remote_login(email);
    }
}

function logout_process() {
    // always local logout
    local_logout();
}

/*** PAGE TRANSITIONS ***/

function visit_my_detox() { jQuery.mobile.changePage('my-detox.html', { transition: 'slide' }); }
function visit_menu() { jQuery.mobile.changePage('menu.html', { transition: 'slide' }); }
function visit_settings() { jQuery.mobile.changePage('settings.html', { transition: 'flip' }); }
function visit_rewards() { jQuery.mobile.changePage('rewards.html', { transition: 'slide' }); }
function visit_posts() { jQuery.mobile.changePage('posts-list.html', { transition: 'slide' }); }
function visit_stats() { jQuery.mobile.changePage('stats.html', { transition: 'slide' }); }
function visit_campaign() { jQuery.mobile.changePage('campaign.html', { transition: 'slide' }); }
function visit_offers() { jQuery.mobile.changePage('offers.html', { transition: 'slide' }); }

/*** PAGE LOAD EVENTS ***/

$(document).delegate('#posts-list', 'pageshow', load_post_list);

function load_post_list() {
    if (IS_ALL_LOCAL) {
        local_retrieve_posts();
    } else {
        remote_retrieve_posts();
    }
}

/*** REMOTE SERVICE ACCESS ***/

var REMOTE_SERVER = 'http://54.247.76.95';
var PATH_REMOTE_LOGIN = '/account';
var PATH_RETRIEVE_ALL_POSTS = '/post/pending';
var PATH_CREATE_POST = '/post/create';

function remote_login(email) {
    
    // FYI: email is currently ignored
    
    $.ajax({ type: "GET",
        contenttype: "application/json; charset=utf-8",
        data: "{null}",
        url: REMOTE_SERVER + PATH_REMOTE_LOGIN,
        dataType:"json",
        success: function(res) {
            var obj = JSON.parse(res);
            $("#welcome-name").html(obj.Name);
            $('#login-prompt').fadeOut('fast', function() { $('#logged-in-prompt').fadeIn('slow'); });
        },
        error: function(err,status,statusTxt) {
            alert('An error occurred logging in to Digital Detox: ' + statusTxt);
        }
    });                    
}

function remote_retrieve_posts() {

    $.ajax({ type: "GET",
        contenttype: "application/json; charset=utf-8",
        data: "{null}",
        url: REMOTE_SERVER + PATH_RETRIEVE_ALL_POSTS,
        dataType:"json",
        success: function(res) {
            var obj = JSON.parse(res);
            populate_post_list(obj);
        },
        error: function(err,status,statusTxt) {
            alert('An error occurred retrieving your held posts: ' + statusTxt);
        }
    });
}

function remote_submit_post(postText) {
    var out = { Content: postText, SendLater: true };
    
    $.ajax({ type: "POST",
        contenttype: "application/json; charset=utf-8",
        data: out,
        url: REMOTE_SERVER + PATH_CREATE_POST,
        dataType:"json",
        success: function(res) {
            jQuery.mobile.changePage('posts-list.html');
        },
        error: function(err,status,statusTxt) {
            alert('An error occurred storing your post: ' + statusTxt);
        }
    });                    
}

/*** LOCAL SERVICE SIMULATION ACCESS ***/

function local_login(email) {
    // var name = substr(); // qqLGW split string by '@' if present
    
    LOCAL_ACCOUNT = {
        Account: email,
        Name: 'Demo User'
    };
    
    $("#welcome-name").html(LOCAL_ACCOUNT.Name);
    $('#login-prompt').fadeOut('fast', function() { $('#logged-in-prompt').fadeIn('slow'); });
}

function local_logout() {
    LOCAL_ACCOUNT = null;
    $('#logged-in-prompt').fadeOut('fast', function() { $('#login-prompt').fadeIn('slow'); });
}

var LOCAL_POSTS = null;
function local_retrieve_posts() {
    
    if (LOCAL_POSTS == null) {
        LOCAL_POSTS = new Array(); // fake_posts_data();
    }
    
    populate_post_list(LOCAL_POSTS);
}

function local_submit_post(postText) {
    LOCAL_POSTS.push({
            UID: LOCAL_POSTS.length,
            Timestamp: new Date().getTime(),
            Content: postText,
            Network: 'twitter',
            AccountID: LOCAL_ACCOUNT.Account
        });
    jQuery.mobile.changePage('posts-list.html');
}

/*** POSTING ***/

function post_paid() { alert('Paid posting is not yet implemented.'); }

function post_submit() {
    var postText = $('#new-post').val();
    
    if (IS_ALL_LOCAL) {
        local_submit_post(postText);
    } else {
        remote_submit_post(postText);
    }
}

/*** LIST POPULATION ***/

/**
 * posts - { posts[ { UID, timestamp, text, network, accountID } ] }
 * UID: number
 * Timestamp: number
 * Content: string
 * Network: string (facebook|twitter|other)
 * AccountID: string
 **/
function populate_post_list(posts) {
    var ul = '';
    for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
        
        networkImg = 'icons/64x64/twitter.png';
        //if (post.network == 'facebook') { networkImg = 'icons/64x64/facebook.png'; }
        //if (post.network == 'twitter') { networkImg = 'icons/64x64/twitter.png'; }
        
        var li =
                '<li>' +
                    '<a>' +
                        '<img src="' + networkImg + '" />' +
                        '<h3 style="font-weight: normal;">' + post.Content + '</h3>' +
                        '<p>twitter</p>' +
                    '</a>' +
                    '<a href="#" onclick="alert(\'Delete not yet implemented.\');"></a>' +
                '</li>';
                
        ul += li;
    }
    
    //ul = '<ul id="posts-list" data-role="listview" data-split-icon="delete" data-split-theme="d">' + ul + '</ul>';
    //alert(ul);    
    if (posts.length == 0) {
        $('#posts-list-ul').hide();
        $('#no-posts-div').show();
    } else {
        $('#no-posts-div').hide();
        $('#posts-list-ul').show();
    
        $('#posts-list-ul').html(ul);
        $('#posts-list-ul').attr('data-split-icon', 'delete');
        $('#posts-list-ul').listview();
    }
}
