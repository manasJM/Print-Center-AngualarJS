
(function(){

	    "use strict";

	    var myApp = angular.module('printFile', []);

	    myApp.controller('PrintFileController', PrintFileController);


	    PrintFileController.$inject = ['$scope', '$http'];

	    function PrintFileController($scope, $http){

	    	//variable to sore the form data
	    	$scope.printForm = {};
	    	//Array to store the files to print
	    	$scope.fileList = [];
	    	var printJobID = "";

	    	//call to the server to get the files for printing
	    	$http.get('https://demo3662581.mockable.io/documents').then(function(response){
	    				console.log("server response", response);
	    				$scope.files = response.data.documents.filename;
	    				for(var i=0;i<$scope.files.length;i++){

	    					$scope.fileList[i] = {

	    						fileName : $scope.files[i]
	    					};

	    				}

	    	});

	    	//function to submit the files to print as selected by the user
	    	$scope.submitPrint = function(){
	    			//selected files to print
	    			var printFiles = [];
	    			var fileCount = -1;
					for(var j=0; j<$scope.fileList.length; j++){

						if($scope.fileList[j].isPrintChecked === true){
							fileCount++;
							 printFiles[fileCount] = {
							 	
							 	filename : $scope.fileList[j].fileName,
							 	color : $scope.fileList[j].isColorChecked
							 }
							 if($scope.fileList[j].notes){
							 	printFiles[fileCount].notes = $scope.fileList[j].notes;
							 }
						}
					}

					makeJSON(printFiles);
				

	    	};

 			
	    	var makeJSON = function(printFiles){
	    		var finalObject = {

	    			printRequest : {
	    				deliverTo : $scope.printForm.delivery,
	    				instructions : $scope.printForm.instructions,
	    				documents : {
	    					document : printFiles
	    				}
	    			}
	    		};
	    		//server call to send the print job 
	    		$http.put('https://demo3662581.mockable.io/print_jobs', JSON.stringify(finalObject)).then(function(response){
	    					printJobID = response.data.requestConfirmation.printJobId;
	    					console.log("dfssf", printJobID);
							
					});

	    	};

	    	$scope.cancelPrint = function(){

	    		var cancelJob = {

	    			cancel : {
	    				printJobId : printJobID
	    			}
	    		};
	    		$http.delete('https://demo3662581.mockable.io/print_jobs', JSON.stringify(cancelJob)).then(function(response){
							
					});

	    	};

	    	
	    }



})();

