from os import environ

from eve import Eve
from eve.methods.post import post

from settings import API_NAME

app = Eve(API_NAME)


def add_events(events):
    with app.test_request_context():
        return post('events', events)

if __name__ == '__main__':
    # Heroku support: bind to PORT if defined, otherwise default to 5000.
    if 'PORT' in environ:
        port = int(environ.get('PORT'))
        host = '0.0.0.0'
    else:
        port = 5000
        host = '127.0.0.1'
    app.run(host=host, port=port)
