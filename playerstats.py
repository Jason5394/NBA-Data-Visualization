import functools
from nba_py.player import PlayerNotFoundException, get_player
import requests
from fake_useragent import UserAgent
from pandas import DataFrame
from .dataformatting import get_data

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)

bp = Blueprint('main', __name__)

#dict of different possible error messages
ERRORS = {
    "PlayerNotFound": "Player not found!",
    "NoPlayerParam": "Player query param must be given",
}

@bp.errorhandler(404)
def page_not_found(error=None):
    message = {"status": 404, "message": "Not Found: " + request.url}
    res = jsonify(message)
    res.status_code = 404
    return res

@bp.errorhandler(400)
def bad_request(error=None):
    message = {"status": 400}
    if error is not None:
        message["error"] = str(error)
    res = jsonify(message)
    res.status_code = 400
    return res

@bp.route('/')
def index():
    player_list = get_data("playerlist", only_current=0)
    return render_template('index.html', player_list=player_list)

@bp.route('/player-stats')
def player_stats():
    player_name = request.args.get('player')
    if not player_name:
        return bad_request(ERRORS["NoPlayerParam"])
    name_tokens = player_name.split()
    try:
        player_id = get_player(name_tokens[0], last_name=name_tokens[1], just_id=True)
    except (PlayerNotFoundException, IndexError):
        return bad_request(ERRORS["PlayerNotFound"])
    all_data = get_data("gamelogs", player_id, season="ALL", season_type="Regular Season")
    return jsonify(all_data)

@bp.route('/shooting-splits')
def shooting_splits():
    player_name = request.args.get('player')
    if not player_name:
        return bad_request(ERRORS["NoPlayerParam"])        
    name_tokens = player_name.split()
    try:
        player_id = get_player(name_tokens[0], last_name=name_tokens[1], just_id=True)
    except (PlayerNotFoundException, IndexError):
        return bad_request(ERRORS["PlayerNotFound"])
    res = get_data("shootingsplits", player_id, season="2017-18")
    return jsonify(res)

@bp.route('/player-summary')
def player_summary():
    player_name = request.args.get('player')
    if not player_name:
        return bad_request(ERRORS["NoPlayerParam"])
    name_tokens = player_name.split()
    try:
        player_id = get_player(name_tokens[0], last_name=name_tokens[1], just_id=True)
    except (PlayerNotFoundException, IndexError):
        return bad_request(ERRORS["PlayerNotFound"])
    player_summary = get_data("playersummary", player_id)
    return jsonify(player_summary)

@bp.route('/player-box')
def player_box():
    pass