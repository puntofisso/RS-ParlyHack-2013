from datetime import datetime
import json
from urllib2 import urlopen

from xmltodict import parse
from bson import json_util


# Re-map parlycal event keys to fit the schema
keymap = {
    "parlycal:house": "house",
    "parlycal:chamber": "chamber",
    "parlycal:date": "date",
    "parlycal:startTime": "start",
    "parlycal:endTime": "end",
    "parlycal:comittee": "comittee",
    "parlycal:inquiry": "inquiry",
    "parlycal:witnesses": "witnesses",
    "parlycal:location": "location",
    "parlycal:subject": "subject",
}


def convert_date(path, key, val):
    """Convert XML keys according to the keymap and insert start and end dates
    as datetime objects."""
    if val is None:
        return None
    if key == 'parlycal:event':
        if 'start' in val:
            val['startDate'] = datetime.strptime(val['date'] + val['start'],
                                                 '%Y-%m-%d%H:%M:%S')
            val.pop('start')
        else:
            val['startDate'] = datetime.strptime(val['date'], '%Y-%m-%d')
        if 'end' in val:
            val['endDate'] = datetime.strptime(val['date'] + val['end'],
                                               '%Y-%m-%d%H:%M:%S')
            val.pop('end')
        else:
            val['endDate'] = datetime.strptime(val['date'], '%Y-%m-%d')
        val.pop('date')
        val.pop('@id')
    return keymap.get(key, key), val


def fetch_calendar():
    """Fetch the UK Parliament calendar feed and add it to the database."""
    from api import post_events
    response = urlopen('http://services.parliament.uk/calendar/all.rss')
    events = parse(response.read(),
                   postprocessor=convert_date)['rss']['channel']['item']
    print json.dumps(post_events(events), default=json_util.default, indent=2)

if __name__ == '__main__':
    fetch_calendar()
