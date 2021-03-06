
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
            // Fill the first half of the table (below diagonal) with functional cells
            if (j <= i) {
                let td = document.createElement("td");
                let input = document.createElement("input");
                input.setAttribute('type', 'number');
                // Set the id as r + nucletide + c + nucleotide
                input.setAttribute('id', nucleotides[i] + "__" + nucleotides[j]);
                input.value = 1;                

                // Adding the classes of the inputs
                input.classList.add("form-control");
                input.classList.add("penalty");

                td.appendChild(input);
                tr.appendChild(td)
            } else {
                // Fill the second half with placeholder cells
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


// function changePenalityScoreDetailedTable(current_elm) {
//     // Change the penality score of the corresponding cell in the left or the right of the diagnal    
//     let current_value = current_elm.value;

//     let current_id = current_elm.id;
//     console.log(current_id);

//     let nucleotides = current_id.split("__");
//     let rcell_id = nucleotides[1] + "__" + nucleotides[0];
//     console.log(rcell_id);

//     document.getElementById(rcell_id).setAttribute("value", "")
//     document.getElementById(rcell_id).setAttribute("value", current_value);
//     document.getElementById(current_id).setAttribute("value", current_value);

// }


function changePenalityScoreDetailedTableFromGlobalScores(type, score) {

    let match_value = document.getElementById("match-score").value;
    let mismatch_value = document.getElementById("mismatch-score").value;
    let gap_value = document.getElementById("gap-score").value;

    let penalties = document.querySelectorAll(".penalty");

    penalties.forEach(function (item) {
        let id = item.id.split("__");

        if (id[0] == "-" || id[1] == "-" || (id[0] == "-" && id[1] == "-")) {
            item.value =  gap_value;
        }
        else if (id[0] == id[1]) {
            item.value = match_value;
        }
        else if (id[0] != id[1]) {
            item.value = mismatch_value;
        }
    });
}


function generate2dGrid(seq1, seq2) {
    // Generate a 2d array filled with zeros. 
    // The number of columns correspond to the length of seq2, and the number of lines corresponds to the length of seq2
    // Before filling the 2d array, add - to the start of both sequences
    seq1 = "-" + seq1;
    seq2 = "-" + seq2;

    let score_mat = [];
    //Build the score grid
    for (let i = 0; i < seq1.length; i++) {
        // Create a string of zeros of length seq2 than split it to form a list
        score_mat.push("0".repeat(seq2.length).split(""));
    }
    return score_mat
}




// Cell class will contain all the information for each cell in the table
class Cell {
        constructor (
            value= null, 
            comesFrom=null,
            horizScore=null,
            vertScore=null,
            diagScore=null, 
            position=null,           
        ){
            this.value = value;
            this.comesFrom = comesFrom;
            this.horizScore = horizScore;
            this.vertScore = vertScore;
            this.diagScore = diagScore;  
            this.position = position;              
        }
    }


 
function initializeFirstRowAndFirstColumn(seq1, seq2, score_mat){ 

    // initialize the value of the cell[0][0]
    let cell00 = new Cell();
    cell00.value = 0;    
    score_mat[0][0] = cell00;
    allPaths.push({'key': 0 + "-" + 0, 'parent':'none'});

    // filling the column line
    for(let i=0; i<seq1.length; i++){   
        // Select the penalty  
        let penalty = document.querySelector("#" +  seq1[i] + "__-").value;
        // Create the cell
        let cell = new Cell();
        cell.value = parseInt(score_mat[i][0].value) + parseInt(penalty);
        cell.comesFrom = i + "-" + 0;
        cell.vertScore = parseInt(score_mat[i][0].value) + parseInt(penalty);        
        score_mat[i+1][0] = cell;

        allPaths.push({'key': (i+1) + "-" + 0, 'parent': i + "-" + 0});

    }

    // filling first row
    for(let i=0; i<seq2.length; i++){  
        // Select the penalty       
        let penalty = document.querySelector("#" +  seq2[i] + "__-").value;

        let cell = new Cell();
        cell.value = parseInt(score_mat[0][i].value) + parseInt(penalty);
        cell.comesFrom = 0 + "-" + i;
        cell.horizScore = parseInt(score_mat[0][i].value) + parseInt(penalty);;
        score_mat[0][i+1] = cell; 
        allPaths.push({'key': 0 + "-" + (i+1), 'parent': 0 + "-" + i});
    }
    return(score_mat);
}


function calculateDistance(seq1, seq2, score_mat){
    seq1 = "-" + seq1;
    seq2 = "-" + seq2; 
    for(let i=1; i<seq1.length; i++){
        for(let j=1; j<seq2.length; j++){
            // create a new cell
            let cell = new Cell();

            // get penalty for horizontal
            let penalty_horizontal = document.querySelector("#" +  seq1[i] + "__-").value; 
            let horiz_val= score_mat[i][j-1].value + parseInt(penalty_horizontal);  
            cell.horizScore = horiz_val;

            // get penalty for vertical
            let penalty_vertical = document.querySelector("#" +  seq2[j] + "__-").value;
            let vert_val = parseInt(score_mat[i][j-1].value) + parseInt(penalty_vertical);
            cell.vertScore = vert_val;

            // get penalty diag
            let penalty_diag = null;
            try{
                penalty_diag = document.querySelector("#" + seq1[i] + "__" + seq2[j]).value;
            }catch{
                penalty_diag = document.querySelector("#" +seq2[j]  + "__" + seq1[i]).value;
            } 

            let diag_val = parseInt(score_mat[i-1][j-1].value) + parseInt(penalty_diag);
            cell.diagScore = diag_val;            
            
            let minimum = Math.min(horiz_val, vert_val, diag_val);

            if(minimum === horiz_val){
                cell.comesFrom = i + "-" + (j-1);
                allPaths.push({'key': i + "-" + j, 'parent': i + "-" + (j-1)});
            }
            if (minimum === vert_val){
                cell.comesFrom = (i-1) + "-" + j;
                allPaths.push({'key': i + "-" + j, 'parent': (i-1) + "-" + j});
            }
            if (minimum === diag_val){
                cell.comesFrom = (i-1) + "-" + (j-1);
                allPaths.push({'key': i + "-" + j, 'parent': (i-1) + "-" + (j-1)});
            }
            cell.value = minimum;
            score_mat[i][j] = cell;
        }    
    }
    return score_mat
}



function createVisalGrid(seq1, seq2, score_mat, container){

    // Empty container
    while(container.firstChild){
        container.removeChild( container.firstChild );
    }

    seq1 = "-" + seq1;
    seq2 = "-" + seq2;

    // Initialze first line with seq2 nucleotides
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    tr.appendChild(td);
    for(let i=0; i<seq2.length; i++){
        let td = document.createElement('td');
        let p =  document.createElement('p');
        p.innerText = seq2[i];
        td.appendChild(p);
        tr.appendChild(td);
    }
    container.appendChild(tr);

    // fill the table
    for(let i=0; i<seq1.length; i++){
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let p =  document.createElement('p');
        p.innerText = seq1[i];
        td.appendChild(p);
        tr.appendChild(td);

        for(let j=0; j<seq2.length; j++){

            let td= document.createElement('td');
            //Set a class for td to target it
            let div = document.createElement("div")
            div.setAttribute("class", "cell");

            // Create the 4 divs in the td
            let diag = document.createElement("div");
            diag.classList.add("diagonal");
            

            let horz = document.createElement("div");
            horz.classList.add("horizontal");
            

            let vert = document.createElement("div");
            vert.classList.add("vertical");
            

            let score = document.createElement("div");
            score.classList.add("score");
            score.setAttribute('id', "grid__" + i + "__" + j)

            // add event listener to score
            score.addEventListener('click', function(e){
                let score = e.target
// ----------------------------------------------------------------------------------------
                try{
                     document.querySelectorAll('.information-formula').forEach(function(item){
                        item.remove();
                     });
                }catch{
                    console.log('nothing to remove')
                }
// ----------------------------------------------------------------------------------------
               

                let rec = score.getBoundingClientRect(); 
                console.log(Math.round(rec.x + 0.5) + " - " + Math.round(rec.y + 0.5));
                
                let div = document.createElement('div');
                div.classList.add('information-formula');

                let top = Math.round(rec.x - window.scrollX);                
                console.log(top);
                Object.assign(div.style,{top: top + "px",
                    left:Math.round(rec.y + 0.5) + "px"});
                score.appendChild(div);

                // Assign multiple css
                // Object.assign(div.style,{fontsize:"12px",left:"200px",top:"100px"}); 
            });



                        
            //Append the elements to td
            div.appendChild(diag);
            div.appendChild(horz);
            div.appendChild(vert);
            div.appendChild(score);
            //Append the div to the td
            td.appendChild(div);
            //Append the td to the tr
            tr.appendChild(td);

            let diagp = document.createElement("p");
            diagp.innerText = score_mat[i][j].diagScore;
            diag.appendChild(diagp);

            let horizp = document.createElement("p");
            horizp.innerText = score_mat[i][j].horizScore;
            horz.appendChild(horizp);

            let vertp = document.createElement("p");
            vertp.innerText = score_mat[i][j].vertScore;
            vert.appendChild(vertp);

            let scorep = document.createElement("p");
            scorep.innerText = score_mat[i][j].value;          

            score.appendChild(scorep);            
        }
        container.appendChild(tr);        
    }
}

function highlightPath(res){ 
    document.querySelectorAll(".score").forEach(function(item){
        item.classList.remove("bg-info");
    });
    
    let str = res.split("->");

    str.forEach(function(item){
        let r = item.split("-")[0];
        let c = item.split("-")[1];
        let id = "grid__" + r + "__" + c
        document.querySelector(".score#" + id).classList.add("bg-info");
    });
}


function constructAlignment(res){
    // Format the sequences
    let seq1 = "-" + document.querySelector("#seq1").value.toUpperCase();
    seq1 = seq1.split("");
    let seq2 = "-" + document.querySelector("#seq2").value.toUpperCase();
    seq2 = seq2.split("");
    // Initialize an array that will contain the alignments
    let alignment = ["-", "-"];
    // Create an array of the path
    let str = res.split('->');
    // Initialize indecies for the sequences: the length of the path is not the same a the one of sequences
    let indexseq1 = 1;
    let indexseq2 = 1;
    
    for(let i=1; i<str.length;i++){
        let prev = str[i-1].split("-");
        let current= str[i].split("-");
        
        if((parseInt(current[0]) == parseInt(prev[0]) + 1) && (parseInt(current[1]) == parseInt(prev[1]) + 1)){ 
            // We come from the diagonal
            alignment[0] = alignment[0] + seq1[indexseq1];
            alignment[1] = alignment[1] + seq2[indexseq2];
            // Increment both counters
            indexseq1 ++;
            indexseq2 ++;

        }else if((parseInt(current[0]) == parseInt(prev[0])) && (parseInt(current[1]) == parseInt(prev[1]) + 1)){
            // We come from the horizontal
            alignment[0] += "-";
            alignment[1] += seq2[indexseq2];   
            //  Increment the index of the second sequence only
            indexseq2 ++;
        }else if((parseInt(current[0]) == parseInt(prev[0]) + 1) && (parseInt(current[1]) == parseInt(prev[1]))){
            // We come from vertical
            alignment[0] += seq1[indexseq1];
            alignment[1] += "-";    
            // Increment the index of the first sequence only
            indexseq1 ++;
        }
    }
    return alignment;
} 



function getPaths(){ 
    let seq1 = document.querySelector("#seq1").value.toUpperCase();
    let seq2 = document.querySelector("#seq2").value.toUpperCase();

    var result = []

    function buildStrings(arr, parent, c) {
        return arr.reduce(function(r, e) {
            if (e.parent == parent) {
            var children = buildStrings(arr, e.key, c + e.key + '->')
            if (!children.length) result.push(c + e.key)
            r.push(e)
            }
            return r;
        }, [])
    }
    buildStrings(allPaths, 'none', '')
    result = [...new Set(result)]   

    var res = [];

    result.forEach(function(item){
        if(item.endsWith(seq1.length + "-" + seq2.length)){
            res.push(item);               
        }
    });

    // get min length
    var length= 999999;
    res.forEach(function(item){
        if(item.split("->").length<length){
            length = item.split("->").length;
        }
    });

    res = res.filter(function(item){
        return item.split("->").length == length;
    });   
    
    return res;        
}






