import re
from pandas import DataFrame

from nba_py.player import PlayerNotFoundException, PlayerGameLogs, get_player, PlayerShootingSplits, PlayerList, PlayerSummary

def filter_dataframe(dataframe, headers):
    """returns a dict of lists based on the headers of the pandas dataframe. If there is only one row aside from the header, then 
       it will only return key-value pairs, not lists. """
    if dataframe.shape[0] < 1:
        return

    data = {}
    if dataframe.shape[0] == 1:
        for header in headers:
            data[header] = dataframe[header].tolist()[0]
    else:
        for header in headers:
            data[header] = dataframe[header].tolist()
    return data

def format_gamelogs(gamelogs):
    """Expects a PlayerGameLogs object and returns a dict of key-value pairs of 
    statstype : List[entries]"""
    all_data = {}
    #the list of different stats we will choose to pull
    statstypes = ["PTS", "REB", "AST", "STL", "BLK"]
    all_data = filter_dataframe(gamelogs.info(), statstypes)
    for statstype in statstypes:
        all_data[statstype].reverse()
    #init game number list (temporary)
    all_data["labels"] = [i for i in range(0, gamelogs.info().shape[0])]
    return all_data

def format_shootingsplits(shooting_splits):
    data = {}
    tooltip = filter_dataframe(shooting_splits.shot_5ft(), ["FGM", "FGA"])
    total_fgm = sum(tooltip["FGM"])
    total_fga = sum(tooltip["FGA"])
    tooltip["FGM"].append(total_fgm)
    tooltip["FGA"].append(total_fga)
    percentage = []
    frequency = []
    for (fgm, fga) in zip(tooltip["FGM"], tooltip["FGA"]):
        try:
            percentage.append(fgm/fga)
        except ZeroDivisionError:
            #case where there were no attempts
            percentage.append(0)
        try:
            frequency.append(fga/total_fga)
        except ZeroDivisionError:
            frequency.append(0)

    #construct data object to be sent
    data["tooltip"] = tooltip
    data["tot_FGM"] = total_fgm
    data["tot_FGA"] = total_fga
    data["percentage"] = percentage
    data["frequency"] = frequency

    return data 

def format_playerlist(player_list):
    headers = ["PERSON_ID", "DISPLAY_LAST_COMMA_FIRST", "FROM_YEAR", "TO_YEAR"]
    return filter_dataframe(player_list.info(), headers) 

def format_playersummary(player_summary):
    summary = player_summary.info()
    headers = ["DISPLAY_FIRST_LAST", "BIRTHDATE", "HEIGHT", "WEIGHT", "SEASON_EXP", "JERSEY", "POSITION", "TEAM_NAME", "FROM_YEAR", "TO_YEAR"]
    data = filter_dataframe(summary, headers)
    birthdate_re = re.compile(r'\d{4}-\d{2}-\d{2}')
    mo = birthdate_re.search(data["BIRTHDATE"])
    match = mo.group(0)
    if match is not None:
        data["BIRTHDATE"] = match
    else:
        data["BIRTHDATE"] = ""
    return data

formatters = {
    "playerlist": [PlayerList, format_playerlist],
    "gamelogs": [PlayerGameLogs, format_gamelogs],
    "shootingsplits": [PlayerShootingSplits, format_shootingsplits],
    "playersummary": [PlayerSummary, format_playersummary],
}

def get_data(formatter, *args, **kwargs):
    if formatter in formatters:
        data_obj = formatters[formatter][0](*args, **kwargs)
        return formatters[formatter][1](data_obj)