// ------------------------------------------------
// Classes
//------------------------------------------------ 
// The class cell contains the information about every cell in the grid
class Cell {
    constructor(
        seq1Index, // Index of the nucleotide in the first sequence
        seq2Index, // Index of the nucleotide in the second sequence
        prevHorz,  // score of the cell at the left
        prevVert,  // score of the cell at the top
        prevDiag,  // score of the cell at the diagonal
        score,     // score of the current cell
        nucleotides //nucleotide in the current cell
    ) {
        this.seq1Index = seq1Index;
        this.seq2Index = seq2Index;
        this.prevDiag = prevDiag;
        this.prevHorz = prevHorz;
        this.prevVert = prevVert;
        this.score = score;
        this.nucleotides = nucleotides;
    }
}

// ------------------------------------------------
// functions
//-------------------------------------------------
function initializePenaltyTable(container_id) {
    // This function will display the table that contains the penality score of for every pair of nucleotides
    container = document.getElementById(container_id);
    nucleotides = ["-", "A", "C", "G", "T"]
    // Fill the header line
    let hr = document.createElement("tr");
    // add and empty td That will contain the labels of the row
    let td = document.createElement("td");
    hr.appendChild(td);
    for (let i = 0; i < nucleotides.length; i++) {
        let td = document.createElement("td");
        let p = document.createElement("p")
        p.innerText = nucleotides[i]
        p.className = "text-center"
        td.appendChild(p);
        hr.appendChild(td);
    }
    container.appendChild(hr);

    // Fill the rest of the table
    for (let i = 0; i < nucleotides.length; i++) {
        let tr = document.createElement("tr");
        container.append(tr)

        // The first cell of each line corresponds to the nucleotide
        let td = document.createElement("td");
        let p = document.createElement("p")
        p.innerText = nucleotides[i]
        // Adding the classes of the inputs
        p.className = "text-center"
        td.appendChild(p);
        tr.appendChild(td)

        // Fill the rest of the table with input fields that will be modified
        for (let j = 0; j < nucleotides.length; j++) {
            if (j <= i) {
                let td = document.createElement("td");
                let input = document.createElement("input");
                input.setAttribute('type', 'number');
                // Set the id as r + nucletide + c + nucleotide
                input.setAttribute('id', nucleotides[i] + "__" + nucleotides[j]);
                input.setAttribute("value", 1);

                // Add event listener to the newly created input
                input.addEventListener('change', function (event) {
                    let current_elm = event.currentTarget;
                    changePenalityScoreDetailedTable(current_elm);
                });

                // Adding the classes of the inputs
                input.classList.add("form-control");
                input.classList.add("penalty");

                td.appendChild(input);
                tr.appendChild(td)
            } else {
                let td = document.createElement("td");
                td.classList.add("bg-muted");
                let input = document.createElement("input");
                input.setAttribute('disabled', "disabled");
                input.classList.add("form-control");
                td.appendChild(input);
                tr.appendChild(td);
            }

        };
    }
}


function changePenalityScoreDetailedTable(current_elm) {
    // Change the penality score of the corresponding cell in the left or the right of the diagnal    
    let current_value = current_elm.value;

    let current_id = current_elm.id;
    console.log(current_id);

    let nucleotides = current_id.split("__");
    let rcell_id = nucleotides[1] + "__" + nucleotides[0];
    console.log(rcell_id);

    document.getElementById(rcell_id).setAttribute("value", "")
    document.getElementById(rcell_id).setAttribute("value", current_value);
    document.getElementById(current_id).setAttribute("value", current_value);

}


function changePenalityScoreDetailedTableFromGlobalScores(type, score) {

    let match_value = document.getElementById("match-score").value;
    let mismatch_value = document.getElementById("mismatch-score").value;
    let gap_value = document.getElementById("gap-score").value;

    let penalties = document.querySelectorAll(".penalty");

    penalties.forEach(function (item) {
        let id = item.id.split("__");

        if (id[0] == "-" || id[1] == "-" || (id[0] == "-" && id[1] == "-")) {
            item.setAttribute('value', gap_value);
        }
        else if (id[0] == id[1]) {
            item.setAttribute('value', match_value);
        }
        else if (id[0] != id[1]) {
            item.setAttribute('value', mismatch_value);
        }
    });
}





function generate2dGrid(seq1, seq2) {

    // Generate a 2d array filled with zeros. The number of columns correspond to the length of seq2, and the number of lines corresponds to the length of seq2

    let scoreMat = [];
    //Build the score grid
    for (let i = 0; i < seq1.length; i++) {
        // Create a string of zeros of length seq2 than split it to form a list
        scoreMat.push("0".repeat(seq2.length).split(""));
    }
    return scoreMat
}