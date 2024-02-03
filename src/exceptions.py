"""
Custom exceptions .py module for qhacks-24 repo
"""

class NotWavError(Exception):
    def __init__(self, message):            
        # Call the base class constructor with the parameters it needs
        super().__init__(message)