def filter_dataframe(dataframe, headers):
    """returns a dict of lists based on the headers of the pandas dataframe"""
    data = {}
    for header in headers:
        data[header] = dataframe[header].tolist()
    return data

def format_gamelogs(gamelogs):
    """Expects a pandas DataFrame, i.e. gamelogs, and returns a dict of key-value pairs of 
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

def format_shootingchart(shooting_splits):
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