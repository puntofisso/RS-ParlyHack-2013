/*** SHARED DATA ***/

var UPCOMING_BUSINESS; // array of events
var SELECTED_SENTENCE; // selected event
var SELECTED_TOPIC; // topic selected from event title
var INBOX_DATA; // retrieve inbox data on the selected topic

/*** REMOTE DATA URLs ***/

var IS_ALL_LOCAL = false;
var CALENDAR_URL = 'http://1e0c030.ngrok.com/calendar.php?date=2013-11-18';
var MAILBOX_URL = 'http://1e0c030.ngrok.com/averagemailbox.php?topic=';
var GUARDIAN_URL = 'http://1e0c030.ngrok.com/guardian.php?fromdate=2013-11-10&todate=2013-11-17&topic=';

/*** TRANSITIONS ***/

function visit_upcoming_business() { jQuery.mobile.changePage('upcoming-business.html', { transition: 'slide' }); }

function visit_keyword_selector_for_upcoming_business(index) {
    SELECTED_SENTENCE = UPCOMING_BUSINESS[index].subject;
    jQuery.mobile.changePage('topic-keyword-selector.html', { transition: 'slide' });
}

function visit_report_for_selected_keyword(keyword) {
    SELECTED_TOPIC = keyword;
    jQuery.mobile.changePage('report.html', { transition: 'slide' });
}

/*** INPUT EVENTS ***/

function analyse_selected_topic_keywords() {
    var words = SELECTED_SENTENCE.split(' ');
    var selected_words = new Array();
    
    for (var i = 0; i < words.length; i++) {
        var slider_id = '#word' + i;
        if ($(slider_id).val() != '') {
            var selected_word = $(slider_id).val();
            selected_words.push(selected_word);
            break;
        }
    }

    if (selected_words.length > 0) {
        // NASTY - just visits the report for the single FIRST word selected
        visit_report_for_selected_keyword(selected_words[0]);
    } else {
        alert('No topics selected.');
    }
}

function analyse_typed_topic_keyword() {
    var typed_keyword = $('#topic-keyword-input').val();
    if (typed_keyword == '') { alert('Please type a topic keyword.'); return; }
    visit_report_for_selected_keyword(typed_keyword);
}

/*** PAGE LOAD EVENTS ***/

$(document).delegate('#upcoming-business-page', 'pageshow', load_upcoming_business);
$(document).delegate('#keyword-selector-page', 'pageshow', load_selected_sentence);
$(document).delegate('#report-page', 'pageshow', load_selected_topic_report);

function load_upcoming_business() {
    if (IS_ALL_LOCAL) {
        UPCOMING_BUSINESS = fake_topic_data();
        populate_upcoming_business(UPCOMING_BUSINESS);
    } else {
        remote_retrieve_topic_data(populate_upcoming_business);
    }
}

function load_selected_sentence() {
    populate_sentence_selector(SELECTED_SENTENCE);
}

function load_selected_topic_report() {
    if (IS_ALL_LOCAL) {
        alert('No local mocked inbox data available.');
    } else {
        remote_retrieve_mailbox_data(SELECTED_TOPIC, populate_report);
    }
}

/*** remote retrieve data ***/

function remote_retrieve_mailbox_data(topic, success_function) {
    $.ajax({
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        data: "{null}",
        url: MAILBOX_URL + topic,
        dataType:"json",
        success: function(res) {
            success_function(res);
        },
        error: function(err,status,statusTxt) {
            alert('An error occurred retrieving mailbox data: ' + statusTxt);
        }
    });
}

function remote_retrieve_topic_data(success_function) {
    $.ajax({
        type: "GET",
        contenttype: "application/json; charset=utf-8",
        data: "{null}",
        url: CALENDAR_URL,
        dataType:"json",
        success: function(res) {
            success_function(res);
        },
        error: function(err,status,statusTxt) {
            alert('An error occurred retrieving the schedule: ' + statusTxt);
        }
    });
}

function remote_retrieve_guardian_data(args) {
    //qqLGW
}

/*** UI population ***/

function populate_report(inbox_data) {
    INBOX_DATA = inbox_data;
    $('#report-header').html('report: ' + SELECTED_TOPIC);
    $('#inbox-sentiment-header').html('Sentiment for: ' + SELECTED_TOPIC);
    // $('#events-for-keyword-header').html('Events for: ' + SELECTED_TOPIC);

    // #inbox-sentiment-graph
    // aggregate the inbox sentiment data per day

    var dates = new Array();
    var POSes = new Array();
    var NEUes = new Array();
    var NEGes = new Array();
    
    for (var i = 0; i < INBOX_DATA.length; i++){
        var INBOX_DAY = INBOX_DATA[i];
        dates.push(INBOX_DAY.date);
        POSes.push(INBOX_DAY.average_pos);
        NEGes.push(INBOX_DAY.average_neg);
        NEUes.push(INBOX_DAY.average_neu);
    }
    
    var chart_data = {
	//labels : ["January","February","March","April","May","June","July"],
        labels: dates,
	datasets :
            [
		{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			// data : [65,59,90,81,56,55,40] /* neutral, gray */
                        data: NEUes
		},
		{
			fillColor : "rgba(151,205,151,0.5)",
			strokeColor : "rgba(151,205,151,1)",
			pointColor : "rgba(151,205,151,1)",
			pointStrokeColor : "#fff",
			//data : [28,48,40,19,96,27,100] /* positive, green */
                        data: POSes
		},
                {
			fillColor : "rgba(205,151,151,0.5)",
			strokeColor : "rgba(205,151,151,1)",
			pointColor : "rgba(205,151,151,1)",
			pointStrokeColor : "#fff",
			//data : [15,60,40,42,44,11,80] /* negative, red */
                        data: NEGes
                }
            ]
        };
    
    //Get chart's canvas 2D context with jQuery, create graph object
    var ctx = document.getElementById("inbox-sentiment-graph").getContext("2d");
    var sentiment_chart = new Chart(ctx).Line(chart_data);

    // #events-for-keyword-list
    
}

function populate_upcoming_business(items) {
    UPCOMING_BUSINESS = items;

    var ul = '';
    ul += '<li data-role="list-divider">Upcoming business</li>';
    
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        
        var timeAndDate = item.date;
        if (item.startTime != null) { timeAndDate += ', ' + item.startTime; }
        
        var li =
                '<li>' +
                    '<a onclick="visit_keyword_selector_for_upcoming_business(' + i + ');">' +
                        '<img src="img/portcullis.png" />' +
                        '<h3 style="font-weight: normal;">' + item.subject + '</h3>' +
                        '<p>' + timeAndDate + '</p>' +
                    '</a>' +
                '</li>';
                
        ul += li;
    }

    // set up list    
    $('#commons-upcoming-business-list').html(ul);
    $('#commons-upcoming-business-list').attr('data-role', 'listview');
    $('#commons-upcoming-business-list').attr('data-inset', 'true');
    $('#commons-upcoming-business-list').listview('refresh');
}

function populate_sentence_selector(sentence) {
    var words = sentence.split(' ');
    var html = '';
    
    for (i = 0; i < words.length; i++) {
        var word = words[i];
        
        html += generate_toggle_button(word, 'word' + i) + ' ';
        //html += word + ' ';
    }
    
    $('#sentence-selector').html(html);
    
    for (i = 0; i < words.length; i++) {
        $('#word' + i).slider();
    }
}

function generate_toggle_button(text, id) {
    var txt =
        '<select name="' + id + '" id="' + id + '" data-role="slider">' +
            '<option value="">' + text + '</option>' +
            '<option value="' + text + '">' + text + '</option>' +
        '</select>';
    return txt;
}

function generate_button(text, cmd) {
    return
        '<a data-role="button" onclick="' + cmd + '">' + text + '</a>';
}