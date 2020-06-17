
const N3 = require("n3");

const parser = new N3.Parser({ format: "Turtle" });
  
document.querySelector("#read-button").addEventListener('click', function() {
	if(document.querySelector("#file-input").files.length == 0) {
		alert('Error : No file selected');
		return;
	}

	// first file selected by user
	var file = document.querySelector("#file-input").files[0];

	// perform validation on file type & size if required

	// read the file
	var reader = new FileReader();

	// file reading started
	reader.addEventListener('loadstart', function() {
	    console.log('File reading started');
	});

	// file reading finished successfully
	reader.addEventListener('load', function(e) {
	   // contents of file in variable     
        var content = e.target.result;
        
        console.log(content);

        var data = {}
    
        parser.parse(content, function(error, quad, prefixes) {
            if (quad) {
                var current = {source: quad.subject.id, target: quad.object.id, label: quad.predicate.id}
                if (typeof data[current.source] === "undefined"){
                    data[current.source] = {isSourceIn:[], isTargetIn: [], degree: 0, }
                }
                if (typeof data[current.target] === "undefined"){
                    data[current.target] = {isSourceIn:[], isTargetIn: [], degree: 0};
                }
                data[current.source].isSourceIn.push(current);
                data[current.source].degree += 1;
                data[current.target].isTargetIn.push(current);
                data[current.target].degree += 1;
    
            }
            else {
                //PREFIXES
                data.prefixes = {label: Object.keys(prefixes), 
                    regex: Object.values(prefixes).map(function(str){
                        return new RegExp("^"+str)
                    })
                };
    
                var txtFile = "%temp%/test.txt";
                var file = new File(txtFile,"write");
                var str = JSON.stringify(JsonExport);
    
                log("opening file...");
                file.open(); 
                log("writing file..");
                file.writeline(str);
                file.close();
    
            }
        });      
    });

	// file reading failed
	reader.addEventListener('error', function() {
	    alert('Error : Failed to read file');
	});

	// file read progress 
	reader.addEventListener('progress', function(e) {
	    if(e.lengthComputable == true) {
	    	var percent_read = Math.floor((e.loaded/e.total)*100);
	    	console.log(percent_read + '% read');
	    }
	});

	// read as text file
	reader.readAsText(file);
});
    
