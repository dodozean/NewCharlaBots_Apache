#!/usr/bin/env python3
import sys

# Assuming newCharlaBots is a Python package in the following directory
sys.path.insert(0, '/home/dodozean/NewCharlaBots_Apache/newCharlaBots')
# sys.path.insert(0, '/w/web/u/m/mjguz/public_html/NewCharlaBots/newCharlaBots')

from newCharlaBots import app as application

# <IfModule mod_wsgi.c>
#     WSGIDaemonProcess newcharlabots python-home=/w/web/u/m/mjguz/public_html/NewCharlaBots/env python-path=/w/web/u/m/mjguz/public_html/NewCharlaBots/newCharlaBots
#     WSGIProcessGroup newcharlabots
#     WSGIScriptAlias / /w/web/u/m/mjguz/public_html/NewCharlaBots/newCharlaBots/newcharlabots.wsgi

#     <Directory /w/web/u/m/mjguz/public_html/NewCharlaBots/newCharlaBots>
#         WSGIProcessGroup newcharlabots
#         WSGIApplicationGroup %{GLOBAL}
#         Require all granted
#     </Directory>

#     Alias /static /w/web/u/m/mjguz/public_html/NewCharlaBots/newCharlaBots/static
#     <Directory /w/web/u/m/mjguz/public_html/NewCharlaBots/newCharlaBots/static>
#         Require all granted
#     </Directory>
# </IfModule>