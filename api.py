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

@app.route('/')
def home():
    list1 = df['State'].tolist()
    c = Counter(list1)
    print(c.most_common(10))
    return render_template('index.html')

@app.route('/kmeans-labels', methods=['GET'])
def getKmeansClusters():
    clusterDict={}
    kmLabels = KMeans(n_clusters = 3).fit(df).labels_
    clusterDict["clusters"] = kmLabels.tolist()
    return jsonify(clusterDict)

# @app.route('/areachart',methods = ['GET'])
# def getStackedData():




    return render_template('index.html', )

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
    app.run(debug=True)
