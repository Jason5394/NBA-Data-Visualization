def format_gamelogs(gamelogs):
    """Expects a pandas DataFrame, i.e. gamelogs, and returns a dict of key-value pairs of 
    statstype : List[entries]"""
    all_data = {}
    #the list of different stats we will choose to pull
    statstypes = ["PTS", "REB", "AST", "STL", "BLK"]
    for statstype in statstypes:
        all_data[statstype] = gamelogs.info()[statstype].tolist()
        all_data[statstype].reverse()
    #init game number list (temporary)
    all_data["labels"] = [i for i in range(0, gamelogs.info().shape[0])]
    return all_data