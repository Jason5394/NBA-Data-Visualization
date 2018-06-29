import functools
from nba_py.player import PlayerNotFoundException, PlayerGameLogs, get_player, PlayerShootingSplits
import requests
from fake_useragent import UserAgent
from pandas import DataFrame
from .dataformatting import format_gamelogs

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)

bp = Blueprint('playerstats', __name__)

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
    player_name = request.args.get('player')
    if not player_name:
        return render_template('index.html')
    name_tokens = player_name.split()
    try:
        player_id = get_player(name_tokens[0], last_name=name_tokens[1], just_id=True)
    except (PlayerNotFoundException, IndexError):
        flash('Could not find player!')
        return render_template('index.html')
    gamelogs = PlayerGameLogs(player_id, season='ALL', season_type='Regular Season')
    all_data = format_gamelogs(gamelogs)
    return render_template('index.html', player=player_name, chart_data=all_data)

@bp.route('/shooting-splits')
def player():
    player_name = request.args.get('player')
    if not player_name:
        return bad_request("player query param must be filled.")        
    name_tokens = player_name.split()
    try:
        player_id = get_player(name_tokens[0], last_name=name_tokens[1], just_id=True)
    except (PlayerNotFoundException, IndexError):
        return bad_request("player not found!")
    shooting_splits = PlayerShootingSplits(player_id)
    res = {
        "FGM": shooting_splits.shot_5ft()["FGM"].tolist(),
        "FGA": shooting_splits.shot_5ft()["FGA"].tolist()
    }
    return jsonify(res)