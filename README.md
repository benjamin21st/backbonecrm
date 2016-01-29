# Backbone Bootstrap CRM

## Overview
Backbone Bootstrap CRM, code named **bbCRM**, is a backend agnostic, single page web app for listing and managing your site or app's users.

## Set up
Setting up **bbCRM** is easy, here we used Flask (a Python framework) as an example.

- Step 1: Clone this repo to your local machine: `git clone https://github.com/benjamin21st/backbonecrm`
- Step 2: `cd` into the **backbonecrm** directory, and initiate a virtual environment by running: `virtualenv env` (of course you can replace **env** with any name you want for the virtual environment)
- Step 3: Activate virtual environment by running: `source env/bin/activate` on **Unix** machines (Mac or Linux distributions), or `source env/scripts/activate` on **Windows** machines
- Step 4: Install basic dependency -- the Flask framework by running `pip install -r requirements.txt`
- Step 5: Run simple server with code: `python api.py`

Then if you navigate your browser to [Localhost:5001](http://localhost:5001/) and you should see a list of dummy users.