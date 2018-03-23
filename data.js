function loadData(){
	d3.queue()
		//.defer(d3.json, "16-17.json")
		//.defer(d3.json, "17-18.json")
		.defer(d3.json, "term6.json")
		.defer(d3.csv, "member.csv")
		.await(ready);

	function ready(error, dataTerm6, memberList){
		console.log("Merge data: all votes in legco term 6 so far (up tp March 22th 2018)");
		console.log(dataTerm6);

		stats(dataTerm6, memberList);
	}
}

function stats(data, memberList){
	//meeting date list
	var meetingDates = [];
	var choiceOfMotion;
	data["legcohk-vote"]['meeting'].forEach(function(d){
		meetingDates.push(d['_start-date']);
	})
	console.log(meetingDates);


	var numberOfVotes = 0;
	data["legcohk-vote"]['meeting'].forEach(function(d){
		//console.log(d);
		numberOfVotes += d['vote'].length;
	})
	console.log("numberOfVotes: " + numberOfVotes);

	//try absent times of lam cheuck ting
	var memberName_en = "Tony TSE";

	function createRecord(__name){//function to iterate record

	var count = 0;
	var abstainCount = 0;
	var yesCount =0;
	var noCount =0;
	var absentCount =0;
	var presentCount= 0;
	var memberVotes = []; // to store one member's all vote
	var memberRecord = {"_name-en":"", "_name-ch":"", "yes":0, "no":0, "absent":0, "abstain":0, "present":0, "count":0, "party_division": 0};
	data["legcohk-vote"]['meeting'].forEach(function(d){
		//meeting
		d['vote'].forEach(function(d){
			//vote
			d["individual-votes"]["member"].forEach(function(d){
				//member
				/* general analysis
				count++; // count every vote

				if (d['vote'][0] === "Yes"){yesCount ++;}
				else if (d['vote'][0] === "No"){noCount ++;}
				else if (d['vote'][0] === "Absent"){absentCount ++;}
				else if (d['vote'][0] === "Abstain"){abstainCount ++;}
				else if (d['vote'][0] === "Present"){presentCount ++;}
				else {console.log(d['vote'][0])}
				*/
				//console.log(d["_name-en"] + "," + d["_name-ch"]);
				if (d["_name-en"] === __name){
					memberVotes.push(d);
				}
				
			})
		})
	})

	//console.log(memberVotes); see the member's all votes
	memberRecord["_name-en"] = __name;
	memberVotes.forEach(function(d){
		if (d['vote'][0] === "Yes"){memberRecord["yes"] +=1;}
		else if (d['vote'][0] === "No"){memberRecord["no"] +=1;}
		else if (d['vote'][0] === "Absent"){memberRecord["absent"] +=1;}
		else if (d['vote'][0] === "Abstain"){memberRecord["abstain"] +=1;}
		else if (d['vote'][0] === "Present"){memberRecord["present"] +=1;}
		memberRecord["count"] +=1;
	});
	//console.log(memberRecord);
	return memberRecord;
	/*
	console.log("count: " + count);
	console.log("yesCount: " + yesCount);
	console.log("noCount: " + noCount);
	console.log("abstainCount: " + abstainCount);
	console.log("absentCount: " + absentCount);
	console.log("presentCount: " + presentCount);
	*/
	}//function to iterate record

	var recordList = [];
	memberList.forEach(function(d){
		recordList.push(createRecord(d["_name-en"]));
	});
	console.log(recordList);
	//stringify json object
	//console.log(JSON.stringify(recordList));

}