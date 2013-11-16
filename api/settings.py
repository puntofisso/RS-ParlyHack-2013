"""Global API configuration."""

from os import environ
from urlparse import urlparse

from schemas import events_schema

API_NAME = 'MPinion'
URL_PREFIX = 'api'
if 'EVE_DEBUG' in environ:
    DEBUG = True

if 'MONGOLAB_URI' in environ:
    url = urlparse(environ['MONGOLAB_URI'])
    MONGO_HOST = url.hostname
    MONGO_PORT = url.port
    MONGO_USERNAME = url.username
    MONGO_PASSWORD = url.password
    MONGO_DBNAME = url.path[1:]
else:
    MONGO_DBNAME = API_NAME

events = {
    "item_title": "events",
    "schema": events_schema,
    "resource_methods": ['GET'],
}

DOMAIN = {
    'events': events,
}

# FIXME: Temporarily allow CORS requests for development purposes
X_DOMAINS = "*"
