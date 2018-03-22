function loadData(){
	d3.queue()
		.defer(d3.json, "16-17.json")
		.defer(d3.json, "17-18.json")
		.defer(d3.json, "term6.json")
		.await(ready);

	function ready(error, data1617, data1718, dataTerm6){
		console.log("legco vote of 2016-2017");
		console.log(data1617);
		console.log("legco vote of 2017-2018");
		console.log(data1718);

		console.log("Merge data: all votes in legco term 6 so far (up tp March 22th 2018)");
		console.log(dataTerm6);
	}
}