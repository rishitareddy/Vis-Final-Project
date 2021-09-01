from flask import Flask, render_template, request, jsonify

from sklearn.cluster import KMeans

import numpy as np
import pandas as pd
import math
import io
from collections import Counter
from collections import OrderedDict
import datetime
import json
import csv

app = Flask(__name__)

dataframe = pd.read_csv('templates/PFDataset2.csv')

attributes = ['Geography','Victim_age','Victim_race','Date_of_Incident','State','Encounter_Type','Victim_gender','Year']

df = pd.DataFrame(data=dataframe, columns = attributes)

Police_Killings_By_PD = pd.read_csv('templates/Police_Killings_By_PD.csv')

attributes_by_pd = ['City','Avg_Annual_Police_Homicide_Rate','Violent_Crime_Rate']

df_PdKillings = pd.DataFrame(data=Police_Killings_By_PD, columns = attributes_by_pd)

pf3 = pd.read_csv('templates/PFDataset3.csv')

@app.route('/')
def home():

    return render_template('index.html')

@app.route('/top10states',methods =['GET'])
def  get_states():

    list1 = df['State'].tolist()
    c = Counter(list1)

    popular = c.most_common(10)

    data = {}
    data["data"] = []
    data["states"] = []
    data["killingcount"] = []
    top10_states = [popular[0] for popular in c.most_common(10)]
    data["states"] = top10_states
    top10_killings = [popular[1] for popular in c.most_common(10)]
    data["killingcount"] = top10_killings
    for i in range(len(top10_states)):
        temp = {}
        temp['state'] = top10_states[i]
        temp['killingcount'] = top10_killings[i]
        data["data"].append(temp)

    jsonify(data)
    return(data)

@app.route('/areachart',methods = ['GET'])
def getStackedData():
    groupedData = df.groupby(['Year', 'Victim_race']).size().reset_index(name="Count")
    pivotedData = groupedData.pivot('Year', 'Victim_race', 'Count')
    print(pivotedData)
    print(pivotedData.to_json())
    return pivotedData.to_json()

@app.route("/most_common_states", methods=['GET'])
def getMostCommonStates():
    stateList = df['State'].tolist()
    stateDict = dict(Counter(stateList).most_common(10))
    return stateDict

@app.route("/sorted_killings_by_pd", methods=['GET'])
def getSortedHomicideRates():
    df.columns=df.columns.str.strip()
    sorted_killings_by_pd = df_PdKillings.sort_values(by=['Violent_Crime_Rate'],ascending=False)
    sliced_sorted_killings = sorted_killings_by_pd.head(25).to_dict()
    # sliced_sorted_killings = sliced_sorted_killings.append(sorted_killings_by_pd.tail(10)).to_dict()
    scatterplot_dict = {}
    scatterplot_dict["homicide_rate"] = list(sliced_sorted_killings['Avg_Annual_Police_Homicide_Rate'].values())
    scatterplot_dict["city"] = list(sliced_sorted_killings['City'].values())
    scatterplot_dict["violent_crime_rate"] = list(sliced_sorted_killings['Violent_Crime_Rate'].values())

    print(scatterplot_dict)
    return jsonify(scatterplot_dict)


@app.route("/get_top_pd",methods = ['POST','GET'])
def getTopPD():
    state = ''
    race = ''
    weapon = ''
    t = 0

    if request.method == 'POST':
        val = json.loads(request.data)
        state = val['state']
        race = val['race']
        weapon = val['weapon']

    if state != "":
        print("In state ", state)
        attributes = ['State_Full','Agency_responsible_for_death', 'Year']
        df3 = pd.DataFrame(data=pf3, columns = attributes)
        pdDf = df3.loc[df3['State_Full'] == state]
    elif race != "":
        print("In race ", race)
        attributes = ['Victim_race','Agency_responsible_for_death', 'Year']
        df3 = pd.DataFrame(data=pf3, columns = attributes)
        pdDf = df3.loc[df3['Victim_race'] == race]
    elif weapon != "":
            print("In weapon ", weapon)
            attributes = ['Alleged_Weapon','Agency_responsible_for_death', 'Year']
            df3 = pd.DataFrame(data=pf3, columns = attributes)
            pdDf = df3.loc[df3['Alleged_Weapon'] == weapon]
    else:
        t = 1
        attributes = ['Agency_responsible_for_death', 'Year']
        pdDf = pd.DataFrame(data=pf3, columns = attributes)

    groupedData = pdDf.groupby(['Agency_responsible_for_death']).size().reset_index(name = "Count")
    sortedKillingsByPD = groupedData.sort_values(by=['Count'],ascending=False).head(5)
    topPD = sortedKillingsByPD['Agency_responsible_for_death'].tolist()

    pdDf = pdDf.loc[pdDf['Agency_responsible_for_death'].isin(topPD)]

    print(t)

    if t== 1:
        year = ['2013','2014','2015','2016','2017','2018','2019','2020','2021']
        pdDf['Counter'] =1
        groupedData = pdDf.groupby(['Agency_responsible_for_death','Year'])['Counter'].sum().reset_index()
        counterList = groupedData['Counter'].tolist()
    else:
        groupedData = pdDf.groupby(['Agency_responsible_for_death','Year']).count().unstack(0).fillna(0).reset_index()
        year = groupedData['Year'].tolist()


    # print(groupedData)
    # print(year)
    data = []
    i = 0
    max_count = 0
    k = 0

    for i in range(len(topPD)):
        a_dict = {}
        a_dict["name"] = topPD[i]
        values =  []
        j = 0
        # if t == 0:
        for j in range(len(year)):
            y_dict = {}
            y_dict["date"] = year[j]
            if state != "":
                print(i, " ", j)
                y_dict["count"] = int(groupedData.iloc[j]['State_Full'].iloc[i])
                print(y_dict["count"])
            elif race != "":
                y_dict["count"] = int(groupedData.iloc[j]['Victim_race'].iloc[i])
            elif weapon != "":
                y_dict["count"] = int(groupedData.iloc[j]['Alleged_Weapon'].iloc[i])
            else:
                y_dict["count"] = counterList[k]
                k += 1
            values.append(y_dict)

            if max_count < y_dict["count"]:
                max_count = y_dict["count"]
            j += 1
        a_dict["values"] = values
        data.append(a_dict)
        i += 1



    data_dict = {}
    data_dict["multi"] = data
    data_dict["extent"] = max_count
    if state != "":
        data_dict["variable"] = state
    elif race != "":
        data_dict["variable"] = race
    elif weapon != "":
        data_dict["variable"] = weapon

    return jsonify(data_dict)



@app.route("/get_choro_data",methods = ['POST','GET'])
def getChoroData():

    attributes = ['State_Full','Victim_race']
    dfChoro = pd.DataFrame(data=pf3, columns = attributes)

    actualStateList = dfChoro['State_Full'].tolist()

    if request.method == 'POST':
        val = json.loads(request.data)
        race = val['race']
        weapon = val['weapon']
        if race != '':
            dfChoro = dfChoro.loc[dfChoro['Victim_race'] == race]
        elif weapon != '':
            attributes = ['State_Full','Alleged_Weapon']
            dfChoro = pd.DataFrame(data=pf3, columns = attributes)
            dfChoro = dfChoro.loc[dfChoro['Alleged_Weapon'] == weapon]


    filteredStateList = dfChoro['State_Full'].tolist()
    stateDict = dict(Counter(filteredStateList))

    remainingStates = list(set(actualStateList) - set(filteredStateList))

    stateCsv = open("static/statesdata.csv", "w",newline='')

    writer = csv.writer(stateCsv)

    writer.writerow(['state','value'])
    for key, value in stateDict.items():
        writer.writerow([key, value])

    for state in remainingStates:
        writer.writerow([state,0])

    stateCsv.close()

    return "boop"


@app.route("/get_abbreviation", methods = ['POST'])
def getabbreviatedState():
    stateName = (request.data).decode("utf-8")
    print("stateName is ", stateName)
    attributes = ['State_Full','State']
    dfState = pd.DataFrame(data=pf3, columns = attributes)
    abbreviation = dfState.loc[dfState['State_Full'] == stateName, 'State'].iloc[0]

    return abbreviation


@app.route("/get_death_count", methods = ['POST'])
def getDeathCount():
    state = ''
    race = ''
    weapon = ''

    if request.method == 'POST':
        val = json.loads(request.data)
        state = val['state']
        race = val['race']
        weapon = val['weapon']

    attributes = ['State_Full','Victim_race', 'Alleged_Weapon','Encounter_Type']
    df3 = pd.DataFrame(data=pf3, columns = attributes)

    if state != "":
        print("In state ", state)
        totalDeaths = (df3['State_Full'] == state).sum()
        df3 = df3.loc[df3['State_Full'] == state]
    elif race != "":
        print("In race ", race)
        totalDeaths = (df3['Victim_race'] == race).sum()
        df3 = df3.loc[df3['Victim_race'] == race]
    elif weapon != "":
        print("In weapon ", weapon)
        totalDeaths = (df3['Alleged_Weapon'] == weapon).sum()
        df3 = df3.loc[df3['Alleged_Weapon'] == weapon]
    else:
        totalDeaths = df3.shape[0]

    avoidableDeaths = (df3['Encounter_Type'] == 'Welfare Check').sum()

    data_dict = {}
    data_dict["totalDeaths"] = int(totalDeaths)
    data_dict["avoidableDeaths"] = int(avoidableDeaths)
    print(data_dict)

    return data_dict






@app.route("/get_geography_multiline",methods = ['GET','POST'])
def getMultiGeography():

    attributes = ['Geography', 'Year']
    pdDf = pd.DataFrame(data=pf3, columns = attributes)
    pdDf = pdDf.loc[pdDf['Geography'] != "Rural"]


    groupedData = pdDf.groupby(['Geography']).size().reset_index(name = "Count")
    sortedKillingsByPD = groupedData.sort_values(by=['Count'],ascending=False)
    topPD = groupedData['Geography'].tolist()
    topPD[topPD.index('Undetermined')] = 'Rural'
    pdDf['Counter'] =1
    groupedData = pdDf.groupby(['Geography','Year'])['Counter'].sum().reset_index()
    counterList = groupedData['Counter'].tolist()

    suburban = counterList[:8]
    rural = counterList[9:17]
    urban = counterList[18:26]

    print("Geography ",groupedData)

    data_dict = {}

    suburban[:] = [x / 50 for x in suburban]

    urban[:] = [x/25 for x in urban]

    print(suburban)
    print(rural)
    print(urban)

    data_dict["suburban"] = suburban
    data_dict["rural"] = rural
    data_dict["urban"] = urban

    return jsonify(data_dict)


if __name__ == '__main__':
    app.run(debug=True, port = 5529)
