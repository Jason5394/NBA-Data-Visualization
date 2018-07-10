import functools
from nba_py.player import PlayerNotFoundException, PlayerGameLogs, get_player, PlayerShootingSplits, PlayerList
import requests
from fake_useragent import UserAgent
from pandas import DataFrame
from .dataformatting import format_gamelogs, filter_dataframe, format_shootingchart

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)

bp = Blueprint('main', __name__)

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
    players = PlayerList(only_current=0) #get ALL players from the NBA
    headers = ["PERSON_ID", "DISPLAY_LAST_COMMA_FIRST", "FROM_YEAR", "TO_YEAR"]
    player_list = filter_dataframe(players.info(), headers) 
    return render_template('index.html', player_list=player_list)

@bp.route('/player-stats')
def player_stats():
    player_name = request.args.get('player')
    if not player_name:
        return bad_request("player param must be given")
    name_tokens = player_name.split()
    try:
        player_id = get_player(name_tokens[0], last_name=name_tokens[1], just_id=True)
    except (PlayerNotFoundException, IndexError):
        return bad_request('Player not found!')
    gamelogs = PlayerGameLogs(player_id, season='ALL', season_type='Regular Season')
    all_data = format_gamelogs(gamelogs)
    return jsonify(all_data)

@bp.route('/shooting-splits')
def shooting_splits():
    player_name = request.args.get('player')
    if not player_name:
        return bad_request("player query param must be filled.")        
    name_tokens = player_name.split()
    try:
        player_id = get_player(name_tokens[0], last_name=name_tokens[1], just_id=True)
    except (PlayerNotFoundException, IndexError):
        return bad_request("player not found!")
    shooting_splits = PlayerShootingSplits(player_id, season="2017-18")
    res = format_shootingchart(shooting_splits)
    return jsonify(res)