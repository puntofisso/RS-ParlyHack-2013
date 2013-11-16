
/**
 * Some topic data on the liquidation of poor people.
 **/
function fake_topic_data() {
    var data = new Array();
    data.push({
                date: '2013-11-16',
                startTime: '11:00:00',
                subject: 'Poor people should be punished.',
                topics: ['poor', 'punishment'],
                house: 'Commons',
                chamber: 'whatever'
            });
    data.push({
                date: '2013-11-16',
                startTime: '13:00:00',
                subject: 'Appropriate punishments for paupers.',
                topics: ['poor', 'punishment'],
                house: 'Commons',
                chamber: 'whatever'
            });
    data.push({
                date: '2013-11-16',
                startTime: '15:00:00',
                subject: 'What are we going to do with all the space?',
                topics: ['all the space', 'do'],
                house: 'Commons',
                chamber: 'whatever'
            });
    return data;
}

/**
 * Fake data representing a slow polarisation over a short period of time.
 **/
function fake_period_data() {
    var data = new Array();
    data.push({
                period: {start: '1384616506', end: '1384617099' },
                positive: 20,
                neutral: 5,
                negative: 15
              });
    data.push({
                period: {start: '1384617099', end: '1384617699' },
                positive: 18,
                neutral: 5,
                negative: 17
              });
    data.push({
                period: {start: '1384617699', end: '1384618299' },
                positive: 15,
                neutral: 3,
                negative: 20
              });
    data.push({
                period: {start: '1384618299', end: '1384618899' },
                positive: 12,
                neutral: 1,
                negative: 23
              });
    return data;
}
