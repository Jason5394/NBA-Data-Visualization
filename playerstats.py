import functools
from nba_py.player import PlayerNotFoundException, PlayerGameLogs, get_player
import requests
from fake_useragent import UserAgent
from pandas import DataFrame

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
        #return render_template(url_for('playerstats.index'))
    name_tokens = player_name.split()
    try:
        player_id = get_player(name_tokens[0], last_name=name_tokens[1], just_id=True)
    except (PlayerNotFoundException, IndexError):
        flash('Could not find player!')
        return render_template('index.html')
    gamelogs = PlayerGameLogs(player_id, season_type='Regular Season')
    pts_data = gamelogs.info()['PTS'].tolist()
    print('pts_data:', pts_data)
    chart_data = {
        'labels': [i for i in range(0, len(pts_data))],
        'data': pts_data,
        'legend': "Points",
    }
    return render_template('index.html', player=player_name, gamelogs=gamelogs.info(), chart_data=chart_data)
