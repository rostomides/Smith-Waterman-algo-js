#-----------------------------------------------------------------
# Create a Cell Class that will serve for dynamic programming
#-----------------------------------------------------------------
class Cell():
    def __init__(
        self, 
        value= None, # Score
        comesFromHorz=None, # If the score comes from the left cell
        comesFromVert=None, # If the score comes from the vertical cell
        comesFromDiag=None, # If the score comes from the diagonal cell     
        position=None       # Position in the matrix
    ):
        
        self.value = value
        self.comesFromHorz = comesFromHorz
        self.comesFromDiag = comesFromDiag
        self.comesFromVert = comesFromVert          
        self.position = position


#-----------------------------------------------------------------
# Distance matrix class
#-----------------------------------------------------------------

import re
class Distancematrix():
    dm = None    # Stores the scores   
    chars = ['-','A', 'C', 'G', 'T']   
    
    ##########################################
    def __init__(self, 
                 seq1=None, # First sequence as string
                 seq2=None, # Second sequence as string
                 penalty=None, # Penalty matrix    
                 allPaths= []  # Stores the paths 
                ):
        
        self.seq1 = "-" + seq1.upper()
        self.seq2 = "-" + seq2.upper()
        self.penalty = penalty 
        self.allPaths = allPaths        
        
    
    ##########################################
    def _createEmptyDistanceMatrix(self):
        '''
        Initializes an empty matrix of shape (length seq1, length seq2)
        length seq1, length seq2 because the first line and colums will be initialzed with regard to the skip character "-"
        '''
        self.dm = [[0]*len(self.seq2) for i in range(len(self.seq1))]
        
    ##########################################        
    def _fillFirstRowAndFirstColumn(self):
        # Define Cell at index [0][0]
        cell00 = Cell()
        cell00.value = 0
        cell00.position = [0, 0]
        self.dm[0][0] = cell00

        #Fill first column
        for i in range(1, len(self.seq1)):
            cell = Cell()
            cell.value = self.dm[i-1][0].value + self.penalty[self.chars.index(self.seq1[i])][self.chars.index("-")]
            cell.comesFromVert = self.dm[i-1][0]
            cell.position = [str(i), 0]
            self.dm[i][0] = cell

        #Fill first row
        for i in range(1, len(self.seq2)):
            cell = Cell()
            cell.value = self.dm[0][i-1].value + self.penalty[self.chars.index("-")][self.chars.index(self.seq2[i])]
            cell.comesFromHorz = self.dm[0][i-1]
            cell.position = [0, i]
            self.dm[0][i] = cell
            
    ##########################################       
    def _fillBodyOfEditDistanceMatrix(self):        
        
        for i in range(1, len(self.seq1)):
            for j in range(1, len(self.seq2)):
                
                # Get the scores from the top, diagonal and left cells
                vertScore = self.dm[i-1][j].value + self.penalty[self.chars.index(self.seq1[i])][self.chars.index("-")]
                horzScore = self.dm[i][j-1].value + self.penalty[self.chars.index("-")][self.chars.index(self.seq2[j])]
                diagScore = self.dm[i-1][j-1].value + self.penalty[self.chars.index(self.seq1[i])][self.chars.index(self.seq2[j])]
                
                # Calculate minimum score
                minimumScore = min(vertScore, horzScore, diagScore)
                                
                cell = Cell()
                cell.value = minimumScore
                cell.position = [i, j] 
                
                # Depending on the minimum score define from where the minimu score comes
                if vertScore == minimumScore:
                    cell.comesFromVert = self.dm[i-1][j]
                if horzScore == minimumScore:
                    cell.comesFromHorz = self.dm[i][j-1]
                if diagScore == minimumScore:
                    cell.comesFromDiag = self.dm[i-1][j-1]                
                
                self.dm[i][j] = cell
                
    ##########################################        
    def fillMatrix(self):
        self._createEmptyDistanceMatrix()
        self._fillFirstRowAndFirstColumn()
        self._fillBodyOfEditDistanceMatrix()
        
        
    ###########################################
    def returnPaths(self):        
        '''
        Returns all the possible paths using indecies of the edit distance matrix
        '''
#         allPaths = []       
        

        def traceBack(cell, dm, path):  
            if (cell.comesFromVert is None and cell.comesFromDiag is None and cell.comesFromHorz is None) \
            or cell.position ==[0,0]:
                path.append ( '__'.join([str(i) for i in cell.position]) )
#                 nonlocal allPaths
                self.allPaths.append( "->".join(path))
                return

            else:
                path.append ( '__'.join([str(i) for i in cell.position]) )
                
                if not cell.comesFromVert is None:
                    prevCell = cell.comesFromVert.position                    
                    traceBack(self.dm[prevCell[0]][prevCell[1]], self.dm, path)
                if not cell.comesFromDiag is None:
                    prevCell = cell.comesFromDiag.position
                    traceBack(self.dm[prevCell[0]][prevCell[1]], self.dm, path)
                if not cell.comesFromHorz is None:
                    prevCell = cell.comesFromHorz.position          
                    traceBack(self.dm[prevCell[0]][prevCell[1]], self.dm, path)

        traceBack(self.dm[len(self.dm)-1][len(self.dm[0])-1], self.dm, [])

#         print(self.allPaths)
#         return allPaths
    
    ###########################################
    def returnAlignment(self):        
        '''
        Returns the aligned sequences starting from the found paths
        '''
        
        # Create all paths
        self.allPaths = []
        self.returnPaths()
        
       
        
        for p in self.allPaths:
            
            path = p.split('->')
            path.reverse()
#             print(path)
            alignment = ['', '']
            # Intialize the index for seq1 this index will be incremented each time a nucleotide from seq1 is added to the alignment. in case of gap this variable is not incremented
            indexSeq1 = 1 
            # Intialize the index for seq2 this index will be incremented each time a nucleotide from seq2 is added to the alignment. in case of gap this variable is not incremented
            indexSeq2 = 1 


            for i in range(1, len(path)): 
                # Get the indicies of the current and previous cells in the path
                indeciesCurrent = [int(i) for i in path[i].split('__')]
                indeciesPrevious = [int(i) for i in path[i-1].split('__')]

                # Depending on the path, add Nucleotides or gaps accordingly
                if ((indeciesCurrent[0]-1) == (indeciesPrevious[0])) and ((indeciesCurrent[1]-1) == (indeciesPrevious[1])):
                    
                    #If we go beyond the length of seq1 that means that the the remaining spots in seq1 alignement are gaps
                    if indexSeq1 < len(self.seq1):
                        alignment[0] += self.seq1[indexSeq1]
                        indexSeq1 += 1
                    else:
                        alignment[0] += "-"
                    #If we go beyond the length of seq2 that means that the the remaining spots in seq2 alignement are gaps
                    if indexSeq2 < len(self.seq2):
                        alignment[1] += self.seq2[indexSeq2]
                        indexSeq2 += 1
                    else:
                        alignment[1] += "-"                   
                    
                    

                elif ((indeciesCurrent[0]) == (indeciesPrevious[0])) and ((indeciesCurrent[1]-1) == (indeciesPrevious[1])):
                    alignment[0] += '-'
                    
                    if indexSeq2 < len(self.seq2):
                        alignment[1] += self.seq2[indexSeq2]
                        indexSeq2 += 1
                    else:
                        alignment[1] += "-"

                elif ((indeciesCurrent[0]-1) == (indeciesPrevious[0])) and ((indeciesCurrent[1]) == (indeciesPrevious[1])):
                    
                    alignment[1] += "-"
                    
                    if indexSeq1 < len(self.seq1):
                        alignment[0] += self.seq1[indexSeq1]
                        indexSeq1 += 1
                    else:
                        alignment[0] += "-"
                    
            
                if indexSeq1 >= len(self.seq1) and indexSeq2 >= len(self.seq2):                       
                    break
            
            print(alignment)            
           
            
    ########################################## 
    def printDM(self):
        print("|  | -|" + " |".join(list(self.seq2)) + "|" )
        if self.dm is not None:
            mat = [[0]*len(self.seq2) for i in range(len(self.seq1))]
            for i in range(len(self.seq1)):
                print("|", end= "") 
                if i == 0:
                    print("- |" , end="")
                else:
                    print(str(self.seq1[i]) + " |" , end="")
                        
                for j in range(len(self.seq2)):                   
                    try:
                        mat[i][j] = self.dm[i][j].value
                        print(str(mat[i][j]) + "|" if len(str(mat[i][j])) ==2 else str(mat[i][j]) + " |" , end= "")
                    except:
                        mat[i][j] = None
                        print(str(mat[i][j]) + "|" if len(str(mat[i][j])) ==2 else str(mat[i][j]) + " |" , end= "")
                print("")
            return mat
            
    ##########################################     
    def dump(self):
        return self.dm
                    
        

