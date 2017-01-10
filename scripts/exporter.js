/**
 * Created by harsh on 6/1/17.
 */

function exportData(startDate,endDate,program,ou){
const dateFormat = "YYYY-MM-DD";
var counter = 0;
    var jsonData = {
        trackedEntityInstance : [],
        enrollments : [],
        events: []
    };

    //get all TEI
    getTEIBetweenDateAndProgram(moment(startDate).format(dateFormat),moment(endDate).format(dateFormat),program.id,ou.id)
        .then(function(teis){
            jsonData.trackedEntityInstance = teis;
            counterCallback();
    });

    getEnrollmentsBetweenDateAndProgram(moment(startDate).format(dateFormat),moment(endDate).format(dateFormat),program.id,ou.id).then(function(enrollments){
        jsonData.enrollments = enrollments;
        counterCallback();
    });

    getEventsBetweenDateAndProgram(moment(startDate).format(dateFormat),moment(endDate).format(dateFormat),program.id,ou.id).then(function(events){
        jsonData.events = events;
        counterCallback();
    });

    function counterCallback(){
        counter++;
        if (counter >2){
            download(JSON.stringify(jsonData), 'tracker-'+moment(new Date()).format("YYYY-MM-DD h:mm:ss")+'.json', 'application/json');
        }
    }
}

function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

function getEvent(index,map,teis,program,ou,teiMap){
    if (index == teis.length){
        return;
    }
    var tei = teis[index].trackedEntityInstance;
    teiMap[tei] = teis[index];
    map[tei]={};
    var param = {
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        url: '../../events?trackedEntityInstance='+tei+'&program='+program.id+'&orgUnit='+ou.id+'&ouMode=DESCENDANTS&skipPaging=true',
    };
    request(param,callback);

    function callback(error,response,body){
        if (error){

        }else{
            for (var i=0;i<response.events.length;i++){
                var ev = response.events[i];
                map[tei][ev.event] = ev;
            }
        }
        getEvent(index+1,map,teis,program,ou,teiMap);
    }
}