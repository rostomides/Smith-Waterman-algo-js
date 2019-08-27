from flask import Flask, request, render_template, url_for, redirect, jsonify

#Import Controller
from controllers.aligmentController import *
#-----------------------------------------------------------
#Initialization section
#-----------------------------------------------------------
app = Flask(__name__)



#-----------------------------------------------------------
# load the alignment page
#-----------------------------------------------------------

@app.route('/')
def get_sequences():

    penalty = [
        [9, 9, 9, 9, 9],
        [9, 0, 2, 6, 6],
        [9, 2, 0, 6, 6],
        [9, 6, 6, 0, 2],
        [9, 6, 6, 2, 0],
    ]

    seq1 = 'AATttCCCGGT'
    seq2 = 'CGGTGGGTTTCC'

    dm = None
    dm = Distancematrix(seq1, seq2, penalty)
    dm.fillMatrix()

    mat = dm.printDM()    

    return jsonify(matrix= mat)

    





if __name__ == "__main__":
    app.run(debug=True)

