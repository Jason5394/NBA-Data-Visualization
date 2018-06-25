import functools
from nba_py.player import PlayerNotFoundException, PlayerGameLogs, get_player
import requests
from fake_useragent import UserAgent
from pandas import DataFrame

from .dataformatting import format_gamelogs

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

bp = Blueprint('playerstats', __name__)

@bp.route('/')
def index():
    print(url_for('playerstats.index'))
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

@bp.route('/<int:player>/')
def player(player_id):
    pass     