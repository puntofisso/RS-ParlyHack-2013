parlycal_event_schema = {
    "house": {
        "type": "string",
    },
    "chamber": {
        "type": "string",
    },
    "startDate": {
        "type": "datetime",
    },
    "endDate": {
        "type": "datetime",
    },
    "comittee": {
        "type": "string",
    },
    "inquiry": {
        "type": "string",
        "nullable": True,
    },
    "witnesses": {
        "type": "string",
        "nullable": True,
    },
    "location": {
        "type": "string",
        "nullable": True,
    },
    "subject": {
        "type": "string",
        "nullable": True,
    },
}

events_schema = {
    "title": {
        "type": "string",
    },
    "link": {
        "type": "string",  # URL
    },
    "guid": {
        "type": "string",  # URL
    },
    "author": {
        "type": "string",
    },
    "category": {
        "type": "list",
        "schema": {
            "type": "string",
        },
    },
    "description": {
        "type": "string",
    },
    "parlycal:event": {
        "type": "dict",
        "schema": parlycal_event_schema,
    },
}
