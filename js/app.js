/*
Author: Larbi Bedrani
Date: 17 August 2019
Version: 1.9
Licence: MIT (with no garantee)
*/

/*
This is my own implementation of the Smith-Waterman for The web use. The core algorithm performs well but still under testing. Next step is working on the styling. Final version of this work will be available on my portfolio website that will be deployed by the end of June 2018.

*/


// all paths
var allPaths=[];

window.onload = function () {     
    

    // Load penality table
    initializePenaltyTable('penalty-table');

    // Clear the grid and the input fields for new alignment
    document.getElementById("newAlignButton").addEventListener('click', function () {
        window.location.reload();
        let seq1 = document.getElementById("seq1").value = "";
        let seq2 = document.getElementById("seq2").value = "";
    });



    // Change the scoring of the detailed table based on global scores
    let global_scores = document.querySelectorAll("#penalty-global input");
    global_scores.forEach(function (item) {
        item.addEventListener("change", function () {
            changePenalityScoreDetailedTableFromGlobalScores();
        })
    });


    // Get new alignment
    document.querySelector("#alignButton").addEventListener("click", function(){
        
        // Empty error messages div
        document.getElementById("errors").innerText ="";
        
        let seq1 = document.querySelector("#seq1").value.toUpperCase();
        let seq2 = document.querySelector("#seq2").value.toUpperCase();
        // Make sure that the sequences contains the right nucletides codes : ACGT and they are not empty
        let pattern = /[^ACGT]/
        if (pattern.test(seq1) || seq1  == "" || pattern.test(seq2) || seq1 == "") {
            document.getElementById("errors").innerText = "Please provide correct succession of nucleotides (ACGT)";
        } else {

            allPaths=[]
            // Initialize empty matrix
            let score_mat = generate2dGrid(seq1, seq2);

            // Initialize first row and first column
            score_mat = initializeFirstRowAndFirstColumn(seq1, seq2, score_mat);

            // Calculate the rest of the table values
            score_mat = calculateDistance(seq1, seq2, score_mat)
            
            // Create the html grid
            let distancesTab = document.querySelector('#distance-table');
            createVisalGrid(seq1, seq2, score_mat, distancesTab);

            // Get all the best paths
            let paths = getPaths(score_mat);


            return

            let results = document.querySelector('#results');

            for (let i=0; i<paths.length; i++){
                let alignment = constructAlignment(paths[i]);

                let div = document.createElement('div')                
                

                let title = document.createElement('h6');
                title.innerText = "Alignment #" + (i+1);
                title.setAttribute("path", paths[i]);
                // Add listener title: hover show the traceback
                title.addEventListener('click', function(e){
                    document.querySelector(".score").classList.remove("bg-info");
                    let path = e.target.getAttribute('path');
                    highlightPath(path);
                });
               

                let seq1div = document.createElement('div');
                let seq1p = document.createElement('p');
                seq1p.innerText = alignment[0];
                seq1div.appendChild(seq1p);

                let seq2div = document.createElement('div');
                let seq2p = document.createElement('p');
                seq2p.innerText = alignment[1];
                seq2div.appendChild(seq2p);

                div.appendChild(title);
                div.appendChild(seq1div)
                div.appendChild(seq2div)

                results.appendChild(div);
            }            
        }
    });

    


    
    


}



