"""Shared utility functions for the backend."""

from bson.objectid import ObjectId, InvalidId


def to_object_id(id_str: str):
    """Convert a string to ObjectId, returning the original string if conversion fails.
    
    This centralizes the repeated try/except ObjectId conversion pattern
    used across multiple routers.
    """
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return id_str
