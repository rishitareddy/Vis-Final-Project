from flask import Flask, render_template, request, jsonify

from sklearn.cluster import KMeans

import numpy as np
import pandas as pd
import math
from collections import Counter
from collections import OrderedDict

app = Flask(__name__)

dataframe = pd.read_csv('templates/PFDataset2.csv')

attributes = ['Geography','Victim_age','Victim_race','Date_of_Incident','State','Encounter_Type','Victim_gender','Year']

df = pd.DataFrame(data=dataframe, columns = attributes)

Police_Killings_By_PD = pd.read_csv('templates/Police_Killings_By_PD.csv')

attributes_by_pd = ['City','Avg_Annual_Police_Homicide_Rate','Violent_Crime_Rate']

df_PdKillings = pd.DataFrame(data=Police_Killings_By_PD, columns = attributes_by_pd)

@app.route('/')
def home():
    return render_template('index.html')
#
# @app.route('/kmeans-labels', methods=['GET'])
# def getKmeansClusters():
#     clusterDict={}
#     kmLabels = KMeans(n_clusters = 3).fit(df).labels_
#     clusterDict["clusters"] = kmLabels.tolist()
#     return jsonify(clusterDict)

# @app.route('/areachart',methods = ['GET'])
# def getStackedData():

@app.route("/most_common_states", methods=['GET'])
def getMostCommonStates():
    stateList = df['State'].tolist()
    stateDict = dict(Counter(stateList).most_common(10))
    return stateDict

@app.route("/sorted_killings_by_pd", methods=['GET'])
def getSortedHomicideRates():
    df.columns=df.columns.str.strip()
    sorted_killings_by_pd = df_PdKillings.sort_values(by=['Violent_Crime_Rate'],ascending=False).head(int(df.shape[0]*.2)).to_dict()
    scatterplot_dict = {}
    scatterplot_dict["homicide_rate"] = list(sorted_killings_by_pd['Avg_Annual_Police_Homicide_Rate'].values())
    scatterplot_dict["city"] = list(sorted_killings_by_pd['City'].values())
    scatterplot_dict["violent_crime_rate"] = list(sorted_killings_by_pd['Violent_Crime_Rate'].values())

    print(scatterplot_dict)

    return jsonify(scatterplot_dict)

@app.route('/mds-correlation',methods = ['GET'])
def getCorrelationMds():

    corrmat = df.corr()

    corr_dmatrix = 1 - abs(corrmat)
    mdsCorrelation = MDS(n_components=2,dissimilarity='precomputed').fit(corr_dmatrix).embedding_

    xcoord = []
    ycoord = []
    for sublist in mdsCorrelation:
        xcoord.append(sublist[0])
        ycoord.append(sublist[1])

    mdsCorrelation_dict = {}
    mdsCorrelation_dict["xcoord"] = xcoord
    mdsCorrelation_dict["ycoord"] = ycoord
    mdsCorrelation_dict["attributes"]=attributes

    return jsonify(mdsCorrelation_dict)

if __name__ == '__main__':
    app.run(debug=True, port = 5031)
