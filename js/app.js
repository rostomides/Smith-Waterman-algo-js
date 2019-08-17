/*
Author: Larbi Bedrani
Date: 17 August 2019
Version: 1.9
Licence: MIT (with no garantee)
*/

/*
This is my own implementation of the Smith-Waterman for The web use. The core algorithm performs well but still under testing. Next step is working on the styling. Final version of this work will be available on my portfolio website that will be deployed by the end of June 2018.

*/

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
            // Initialize empty matrix
            let scoreMat = generate2dGrid(seq1, seq2);

            // Initialize first row and first column
            scoreMat = initializeFirstRowAndFirstColumn(seq1, seq2, scoreMat);            
        }
    });

    // generate2dGrid(seq1, seq2)


}



