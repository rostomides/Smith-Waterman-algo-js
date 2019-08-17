/*
Author: Larbi Bedrani
Date: 25 May 2018
Version: 1.9
Licence: MIT (with no garantee)
*/

/*
This is my own implementation of the Smith-Waterman for The web use. The core algorithm performs well but still under testing. Next step is working on the styling. Final version of this work will be available on my portfolio website that will be deployed by the end of June 2018.

*/

window.onload = function () {
    let gap = -2,
        match = 1,
        miss = -1;


    initializePenaltyTable('penalty-table');




    // Clear the grid and the input fields for new alignment
    document.getElementById("newAlignButton").addEventListener('click', function () {
        window.location.reload();
        let seq1 = document.getElementById("seq1").value = "";
        let seq2 = document.getElementById("seq2").value = "";
    });



    // Change the scoring of the detailed table based on global scores
    let elmt = document.querySelectorAll("#penalty-global input");
    elmt.forEach(function (item) {
        item.addEventListener("blur", function () {
            // let type = null;
            // if (item.id == "match-score") {
            //     type = "match";
            // } else if (item.id == "mismatch-score") {
            //     type = "mismatch";
            // } else if (item.id == "gap-score") {
            //     type = "gap";
            // }

            changePenalityScoreDetailedTableFromGlobalScores();
        })
    })






}



