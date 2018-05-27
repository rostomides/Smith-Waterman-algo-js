/*
Author: Larbi Bedrani
Date: 25 May 2018
Version: 1.9
Licence: MIT (with no garantee)
*/

/*
This is my own implementation of the Smith-Waterman for The web use. The core algorithm performs well but still under taseting. Next step is working on the styling. Final version of this work will be available in my portfolio website that will be deployed by the end of June 2018.

*/

window.onload = function(){
    let gap = -2,
    match = 1,
    miss = -1;
    document.getElementById("newAlignButton").addEventListener('click', function(){
        window.location.reload();
        let seq1 = document.getElementById("seq1").value = "";
        let seq2 = document.getElementById("seq2").value = "";
    })

    let buttonAlign = document.getElementById('alignButton');

    buttonAlign.addEventListener("click", function(){
        let seq1 = document.getElementById("seq1").value;
        let seq2 = document.getElementById("seq2").value;
        let pattern = /[^ACGTUagctu]/
        if(pattern.test(seq1) || seq1 == "" || pattern.test(seq2) || seq2 == ""){
            alert("Please provide correct succession of nucleotides (ACGT)")
        }else{
            //Create the scoring matrix       
            seq1 = "_" + seq1.toUpperCase();
            seq2 = "_" + seq2.toUpperCase(); 
            //********************************************************* */
            //Initialize empty 2d array
            let scoreMat =[];
            //Build the score grid
            for(let i=0;i<seq1.length;i++){
            scoreMat.push("0".repeat(seq2.length).split(""));
            }

            class Cell{    
                constructor(seq1Index,seq2Index, 
                    prevHorz, prevVert, prevDiag,        
                    score, nucleotides){
                    this.seq1Index = seq1Index;
                    this.seq2Index = seq2Index;
                    this.prevDiag = prevDiag;
                    this.prevHorz = prevHorz;
                    this.prevVert = prevVert;           
                    this.score = score;
                    this.nucleotides = nucleotides;   
                }
            }

            //********************************************************* */
            //Create an empty table 
            let score = document.getElementById("scores")
            for(let i=0; i<=seq1.length; i++){
                //Setting the first line    
                if(i ==0){        
                    let tr = document.createElement("tr");
                    score.appendChild(tr)
                    for(let j=0; j<=seq2.length; j++){ 
                        if(i == 0 && j == 0){
                            // If both i and j are equal to zero insert an empty td
                            let td = document.createElement("td");
                            td.id = "empty";
                            tr.appendChild(td);
                        }else{
                            // Fill the first line with the Nucleotides of Sequence2
                            let td = document.createElement("td");                                                
                            td.id = "firstLine_" + String(i) + String(j);
                            td.innerText = seq2[j-1]
                            tr.appendChild(td);
                        }           
                    }
                }else{
                    let tr = document.createElement("tr");
                    score.appendChild(tr)      
                    for(let j=0; j<=seq2.length; j++){  
                        if (j ==0){ //Filling the first column
                            let td = document.createElement("td");
                            td.id = "first_column" + String(i) + String(j); 
                            td.innerText = seq1[i-1];
                            tr.appendChild(td);
                        }  
                        else{// Filling the rest of the grid
                            let td = document.createElement("td");
                            td.id = "r" + String(i-1) + "c" + String(j-1);                
                            //Set a class for td to target it
                            let div = document.createElement("div")
                            div.setAttribute("class", "cell");

                            // Create the 4 divs in the td
                            let diag = document.createElement("div");
                            diag.setAttribute("class","diagonal");
                            let horz = document.createElement("div");
                            horz.setAttribute("class","horizontal");
                            let vert = document.createElement("div");
                            vert.setAttribute("class","vertical");
                            let score = document.createElement("div");
                            score.setAttribute("class","score");
                            //Append the elements to td
                            div.appendChild(diag);
                            div.appendChild(horz);
                            div.appendChild(vert);
                            div.appendChild(score);
                            //Append the div to the td
                            td.appendChild(div);
                            //Append the td to the tr
                            tr.appendChild(td);

                            div.querySelector(".score").innerText = "empty";
                        }         
                    }

                }     
            }
            //********************************************************* */

            //********************************************************* */
            //Initialize first column
            for(let i=0;i<seq1.length;i++){   
                let cell = new Cell(i, 0, null, null, null,  0,["-","-"]);
                let domCell = document.getElementById("r" + String(i) + "c" + String(0))
                    domCell.querySelector(".score").innerText = 0;
                if(i!==0){
                    cell.prevVert = scoreMat[i-1][0];        
                    cell.score = scoreMat[i-1][0].score + gap;
                    cell.nucleotides = [seq1[i], "-"];
                    let domCell = document.getElementById("r" + String(i) + "c" + String(0))
                    domCell.querySelector(".score").innerText = cell.score;
                    domCell.querySelector(".vertical").innerText =  scoreMat[i-1][0].score + gap;
                }    
                scoreMat[i][0]=cell;
                
            }
            // Initialize first line
            for(let j=0;j<seq2.length;j++){   
                let cell = new Cell(0, j, null, null, null, 0, ["-","-"]);
                if(j!==0){
                    cell.prevHorz = scoreMat[0][j-1];
                    cell.score = scoreMat[0][j-1].score + gap;
                    cell.nucleotides = ["-", seq2[j]];
                    let domCell = document.getElementById("r" + String(0) + "c" + String(j))
                    domCell.querySelector(".score").innerText = cell.score;
                    domCell.querySelector(".horizontal").innerText =  scoreMat[0][j-1].score + gap;
                }
                scoreMat[0][j]=cell;
            }

            //********************************************************* */
            //Fill the rest of the table
            for(let i=1; i<seq1.length;i++){    
                for(let j=1; j<seq2.length;j++){                   
                        //Score coming from the left add the gap value
                        let horz = Number(scoreMat[i][j-1].score) + gap;
                        //Score coming from down add the gap value
                        let vert = Number(scoreMat[i-1][j].score) + gap;
                        //If the score coming from diagnal: if match add match score if miss add miss score
                        let diag = seq1[i] === seq2[j] ? Number(scoreMat[i-1][j-1].score) + match : Number(scoreMat[i-1][j-1].score) + miss;
                
                        const maxScore = Math.max(horz, vert, diag)    
                        //prevHor, prevVert, prevDiag, score
                        let cell = new Cell(i, j, null, null, null, 0, ["-","-"]);
                        let domCell = document.getElementById("r" + String(i) + "c" + String(j));
                        if (horz === maxScore) {
                            cell.prevHorz = scoreMat[i][j-1];
                            cell.nucleotides = ["-", seq2[j]];
                            domCell.querySelector(".horizontal").style.color = "red";
                        }
                        if (vert === maxScore) {
                            cell.prevVert = scoreMat[i-1][j];
                            cell.nucleotides =[seq1[i], "-"];
                            domCell.querySelector(".vertical").style.color = "red";
                        }
                        if (diag === maxScore) {
                            cell.prevDiag = scoreMat[i-1][j-1];
                            cell.nucleotides = [seq1[i], seq2[j]]; 
                            domCell.querySelector(".diagonal").style.color = "red";                               
                        }
                        
                        domCell.querySelector(".vertical").innerText =  vert;
                        domCell.querySelector(".horizontal").innerText = horz; 
                        domCell.querySelector(".diagonal").innerText =  diag;
                        domCell.querySelector(".score").innerText = maxScore;
                        cell.score = maxScore; 
                        cell.seq1Index = i;
                        cell.seq2Index = j;
                        scoreMat[i][j]=cell;
                } 
            }
            //********************************************************* */

            //********************************************************* */
            //Traceback

            let currentPaths = [[scoreMat[seq1.length-1][seq2.length-1]]]
            let final_paths = []            
            compt = 0

            mainLoop: while(compt<20){
                compt++;
                for(let i = 0; i<currentPaths.length; i++){        
                    //Create a copy of the current objects in the sequence
                    let current = Object.assign([],currentPaths[i]);
                    
                    //Get the last element of the current sequence since it will define the next object to add to the sequence
                    let lastElement = current[current.length-1];       
                    //Check if the last element in the sequence has object directly related to him
                    if(lastElement.prevDiag !==null){
                        let intermed = Object.assign([],current);    
                        let intermedLastElm = intermed[intermed.length-1];
                        let nextElm = Object.assign({},
                            scoreMat[intermedLastElm.seq1Index-1][intermedLastElm.seq2Index-1]);
                        nextElm.nucleotides = [seq1[intermedLastElm.seq1Index-1], seq2[intermedLastElm.seq2Index-1]]            
                        intermed.push(nextElm);            
                        if(!currentPaths.includes(intermed)){
                            currentPaths.push(intermed);
                        }            
                    }
                    if(lastElement.prevHorz !==null){
                        let intermed = Object.assign([],current);    
                        let intermedLastElm = intermed[intermed.length-1];
                        let nextElm = Object.assign({},
                            scoreMat[intermedLastElm.seq1Index][intermedLastElm.seq2Index-1]);
                        nextElm.nucleotides = ["-", seq2[intermedLastElm.seq2Index-1]]            
                        intermed.push(nextElm);            
                        if(!currentPaths.includes(intermed)){
                            currentPaths.push(intermed);
                        }
                    }
                    if(lastElement.prevVert !==null){
                        let intermed = Object.assign([],current);    
                        let intermedLastElm = intermed[intermed.length-1];
                        let nextElm = Object.assign({},
                            scoreMat[intermedLastElm.seq1Index-1][intermedLastElm.seq2Index]);
                        nextElm.nucleotides = [seq1[intermedLastElm.seq1Index-1], "-"]            
                        intermed.push(nextElm);            
                        if(!currentPaths.includes(intermed)){
                            currentPaths.push(intermed);
                        }
                    }  
                    currentPaths.shift();           
                }    

                if(currentPaths.length === 0){
                    break
                }
                final_paths = Object.assign([],currentPaths);
                
            }

            //********************************************************* */
            //Get best alignments

            for (let i =0; i<final_paths.length; i++){
                let current = final_paths[i]
                sequence = ["",""]
                for(let k =0; k< current.length - 1; k++){
                    sequence[0]+= current[k].nucleotides[0];
                    sequence[1]+= current[k].nucleotides[1];
                }
                
                //Create div to contain the best alignment
                let div = document.createElement("div")
                div.id = i;
                div.setAttribute("class", "sequence");
                div.innerHTML = `<p> ${sequence[0].split("").reverse().join("")}</p>
                <p> ${sequence[1].split("").reverse().join("")}</p>`;

                document.getElementById("results").innerHTML = `<h3>Best alignment (mouse over to see the traceback in the table)</h3>`
                document.getElementById("results").appendChild(div);
                
            }

            //********************************************************* */
            //Add event listeners
            let formerId=""
            document.querySelector(".sequence").addEventListener("mouseenter", function(e){
                let id = Number(e.target.id);
                if(formerId !==id){
                    let current = final_paths[id];        
                    for(let k=0; k< current.length; k++){
                        let cell = document.getElementById("r" + String(current[k].seq1Index) + "c" + String(current[k].seq2Index))
                        cell.querySelector(".score").style.backgroundColor = "blue";
                        
                    }
                    formerId= id;
                }    
            })

            document.querySelector(".sequence").addEventListener("mouseleave", function(e){   
                
                let cells = Array.from(document.querySelectorAll(".score"));
                cells.forEach((cell)=>{
                    cell.style.backgroundColor = "";
                })
                formerId="";       
            })

        
            //********************************************************* */
            buttonAlign.disabled = true;        
        }
    })

}


