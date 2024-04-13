/**************************
 * Author: Ehsan Sherkat  *
 * Copyright: 2015        *
 **************************/
// {
//   "subset0": [
//       "syedmbhzi",
//       "lovishagrawal75",...
      
//   ],
//   "subset1": [
//       "ap.amritapritam",
//       "ssshubh97",....
//   ]
// }
const PROPOSED_BOTH = 0;
// const BASELINE_BOTH = 1; no longer needed it
// const BASELINE_LOCAL = 0;
// const BASELINE_GLOBAL = 1;
// const BASELINE_BOTH = 2;
// const PROPOSED_BOTH = 3;
let tutorialGiven = false
let originalParent;
let originalWidth;
let originalHeight;
var maxPositiveAcrossDocument;
var clusterNames = [];
var minNegativeAcrossDocument;
var clusterWords = ""; //the name and the key terms of clusters
var clusterKeyTerms = ""; //the key terms of clusters are here
var clusterDocuments = ""; //the list of documents of cluster
var clusterCloud = ""; //the cloud terms of cluster
var termClusterData = ""; //the term cluster data
var termClusterDataString = ""; //the string of the term cluster data (for changing it later)
var termProbabilitiesString = ""; //the string of the term cluster data (for changing it later)
var documentClusterData = ""; //the document cluster data
var documentClusterDataString = ""; //the string of the document cluster data (for changing it later)
// var allWords = ""; //all words
var sessions = []; //list of sessions name
var sessionsDescription = []; //list of sessions description
var documentsName = []; //list of documents name
var documentsNameString = ""; //list of documents name string
// var documentDocumentSimilarity = new Array(); //document document similarity
// var documentDocumentSimilarityString = ""; //document document similarity string
// var termDocumentSimilarity = new Array(); // term document similarity
var termDocumentSimilarityString = new Array(); // term document similarity string
var generalViewGraph = ""; //general view graph
var generalViewGraph2 = ""; //general view graph
// var removedDocuments = []; //show the list of documents that have been removed (becuase of removing the cluster)
var sessionDescription = "";
// var silhouette = 0;
// var TsneSilhouette = 0;
var tsneResult = new Array();

// var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var clusterKeytermsOriginal;
var clusterDocs;
var fileName = "";
var userDirectory = "";
var userID = "";
var userU = -1; //if it is the first time that the algorithm is running -1:first +1:interaction
var serverData = new Array();
var serverClusetrName = [];
var termClusters = [];
var docClusters = [];
var clusterNumber = -1;
var explanation_details = "";
var userSubsetDetails = null;
var currentSubset = null;
var currentDocumentName = "";
var numberOfDocumnetsVariable = 20;
var termProbabilities = [];
var numberOfDocumentsWithOnlyLocalExplanation = 1;
/**
 * Load the system and clusters
 */
function showNewDocument() {
  /*
  Given:
  1. currentDocumentName ""
  2. documentNames  []

  To do:
  3. get the name of next document
  4. get its content
  5. se doc_content to the content of the document
  */
  //if $("#doc_content") is empty, then load the first document named paper0.txt
  if (document.getElementById("doc_content").innerHTML == "") {
  currentDocumentName = "paper0.txt";
  document.getElementById("doc_content").innerHTML = getDocumentContent(currentDocumentName);
  // #panel3
  localStorage.setItem('visible', 'false'); // Use 'sessionStorage' if you prefer

  $("#panel3").css('visibility', 'hidden');
  $("#panel4").css('visibility', 'hidden');
  $("#panel7").css('visibility', 'hidden');
  $("#panel8").css('visibility', 'hidden');
}
else {
  if (currentDocumentName == "paper"+numberOfDocumentsWithOnlyLocalExplanation+".txt") {
    localStorage.setItem('visible', 'true'); // Use 'sessionStorage' if you prefer
    $("#panel3").css('visibility', 'visible');
    $("#panel4").css('visibility', 'visible');
    $("#panel7").css('visibility', 'visible');
    $("#panel8").css('visibility', 'visible');
    document.dispatchEvent(new CustomEvent('startSecondTutorial'));
    var clusterPannel = document.getElementById("panel4_1");
    $(clusterPannel).on("dblclick", ".clusterTitle", function() {
      var clusterId = $(this).closest(".cluster").attr("id");
      clusterRename(clusterId);
    }); 
    
  }


    var currentDocumentNumber = currentDocumentName
      .substring(5)
      .replace(".txt", "");
    var nextDocumentName =
      "paper" + (parseInt(currentDocumentNumber) + 1).toString() + ".txt";
    // Extract number from text after paper and before .
    if (parseInt(currentDocumentNumber) + 1 >= numberOfDocumnetsVariable) { // remove 18 from here
      link = (currentSubset == PROPOSED_BOTH) ? "https://surveys.dal.ca/opinio/s?s=76083" 
                                              : "https://surveys.dal.ca/opinio/s?s=76510";

      $("#fullpage").html(`
    <iframe scrolling="yes" frameborder="0"
    src="${link}"
    style="width: 100%; height: 100%; border: none;">
    </iframe>`);
    // set fullpage display to block
    $("#fullpage").css("display", "block");
      return;
    }
    nextDocText = getDocumentContent(nextDocumentName);
    $("#doc_content").html(nextDocText);
    currentDocumentName = nextDocumentName;
    console.log("Current Document is : ", currentDocumentName);
    createTermClusterChart();
  }
}

function pageLoad() {
  $("#slider1").slider("disable");
  $("#slider2").slider("disable");
  $("#slider3").slider("disable");
  $("#slider1_Textbox").attr("disabled", "disabled");
  $("#slider2_Textbox").attr("disabled", "disabled");
  $("#slider3_Textbox").attr("disabled", "disabled");

  //promt for the user guide
  // var userGuide = confirm("Would you like to see the userguide page first?");
  // if (userGuide)
  // {
  //   window.open("./userguide.html", '_self');
  // }

  // //get the user id
  // else
  {
    var input = prompt("Please enter your email", "");
    // var input = "baqia";
    // var input = "zehra2989";
    var loadSessionConfirmed = false;

    if (input != null && input.trim() != "") {
      // Convert the email to lowercase
      var emailLower = input.toLowerCase();
  
      // Remove everything after '@'
      var emailBeforeAt = emailLower.split('@')[0];
  
      // Remove special characters except '.'
      input = emailBeforeAt.replace(/[^a-z0-9.]/g, '');
      userID = input;
      getExplanation();

      fileName = "../../users/" + input + "/out" + input + ".Matrix"; /////////////
      // userDirectory = "../../users/" + input + "/"; /////////////

      $("#userName").html("Welcome " + userID + "!");

      $.ajax({
        type: "POST",
        url: "./cgi-bin/pp.py",
        data: {
          user_id: JSON.stringify(input),
          status: JSON.stringify("0"),
        },
        success: function (msg) {
          var status = msg["status"];
          $.ajax({
            type: "POST",
            url: "./cgi-bin/getUserSubset.py",
            data: { userID: JSON.stringify(userID) },
            success: function (msg) {
              userSubsetDetails = msg["userSubset"];
              var found = false;
              for (var key in userSubsetDetails) {
                if (userSubsetDetails[key].indexOf(userID) != -1) {
                  //select last character of key string
                  currentSubset = +key.slice(-1);
                  found = true;
                  break;
                }
              }
              if (found) {
                
              } else {
                alert(
                  "You are not a member of any subset. Please contact the administrator."
                );
              }
            },
          });
          // getExplanation();
          if (status == "yes") {
            alert(
              "Your username does not exist, please enter a valid username! or contact the administrator."
            );
          } else if (status == "no") {
            // getListOfSessions("first");
            if (sessions.length > 0) {
              loadSessionConfirmed = confirm(
                "You have saved sessions. Do you want to load the latest one?"
              );

              if (loadSessionConfirmed) {
                var sessionName = sessions[sessions.length - 1]
                  .substring(
                    sessions[sessions.length - 1].indexOf("#$") + 2,
                    sessions[sessions.length - 1].indexOf(".session")
                  )
                  .replace("_", ":")
                  .replace("_", ":");

                var name = sessionName.substring(
                  sessionName.indexOf(" @ ") + 3
                );
                var date = sessionName.substring(0, sessionName.indexOf(" @ "));
                var sessionValue = name + " @ " + date;

                // loadSession(sessionName);
                // getListOfSessions(sessionValue);
              }
            }
            if (!loadSessionConfirmed) {
              // input = prompt(
              //   "Please enter your initial number of clusters",
              //   ""
              // );
              input = "4";

              if (
                input != null &&
                input.trim() != "" &&
                IsNumeric(input) != false
              ) {
                clusterNumber = Number(input);
                callServer();
                
              } else if (
                input != null &&
                (input.trim() == "" || IsNumeric(input) == false)
              ) {
                alert("Your number of clusters is not valid!");
              }
            }
          }
          
        },
        error: function (msg) {
          document.body.style.cursor = "auto";
          alert("Error in retrieving the last status of your collection!");
        },
      });
      // make the div container named modal-content visible
      
    } else if (input != null && input.trim() == "") {
      alert("Your userID is not valid!");
    }
  }
  

}

/**
 * Checks if the data is numeric or not
 * @param data = input data
 * @return true if it is numeric.
 */
function IsNumeric(data) {
  return parseFloat(data) == data;
}



/*
 * Run the clustering algorithm and get the results
 */
function callServer() {
  saveLog("callServer");

  $("body").css("cursor", "wait");
  //remove zip files
  // removeZip();

  var date01 = new Date();
  var n01 = date01.getTime();

  $.ajax({
    url: "./cgi-bin/main.py",
    type: "POST",
    cache: false,
    traditional: true,
    data: { 
      clusterNumber: clusterNumber,
      userU: userU,
      userID: JSON.stringify(userID),
      serverData: JSON.stringify(serverData),
      serverClusetrName: JSON.stringify(serverClusetrName),
    },

    success: function (msg) {
      $("body").css("cursor", "auto");

      var date02 = new Date();
      var n02 = date02.getTime();

      clusterKeytermsOriginal = eval(msg["termClusters"]);
      // clusterDocs = eval(msg["documentClusters"]);
      // silhouette = eval(msg["silhouette"]);
      clusterDocs = eval(msg["newdocumentClusters"]);
      // console.log("newClusterDocs", newClusterDocs);
      console.log("clusterDocs", clusterDocs);

      // if (silhouette == null) {
      //   silhouette = "Error!";
      // } else {
      //   silhouette = silhouette.toFixed(4);
      // }

      // $("#silhouette").append("Silhouette: " + silhouette);

      if (
        clusterKeytermsOriginal == null ||
        clusterDocs == null //|| ///////////////////////
        // clusterDocs[0].length == 2 ||
        // clusterDocs[1].length == 2
      ) {
        alert(
          "Internal server error in clustering your data collection! Please re-try with a different number of clusters."
        );
        document.body.style.cursor = "auto";
      } else {

        //for cluster names and words (top 5)
        clusterWords = getClusterWords();

        // Modified to use the CGI script for fetching document cluster data
        var asyncRequest = new XMLHttpRequest();
        asyncRequest.open("POST", "./cgi-bin/fetchDocumentMembs.py", false);
        asyncRequest.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        asyncRequest.send("userID=" + encodeURIComponent(userID));

        documentClusterData = d3.csv.parse(asyncRequest.responseText);
        documentClusterDataString = asyncRequest.responseText;

        //for list of documents of cluster
        clusterDocuments = getClusterDocuments();

        // for term cluster data/
        asyncRequest.open("POST", "./cgi-bin/fetchTermMembs.py", false);
        asyncRequest.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        asyncRequest.send("userID=" + encodeURIComponent(userID));

        termClusterData = d3.csv.parse(asyncRequest.responseText);
        termClusterDataString = asyncRequest.responseText;
        clusterNames =  termClusterDataString.substring(
          0,
          termClusterDataString.indexOf("\n")
        ).split(",").slice(1)

        //for the cloud terms of cluster
        clusterCloud = getClusterCloud();

        //for list of clusters key terms
        clusterKeyTerms = getClusterKeyTerms();

        termProbabilities = getTermProbabilities();




        // asyncRequest.open("POST", "./cgi-bin/fetchTerms.py", false);
        // asyncRequest.setRequestHeader(
        //   "Content-Type",
        //   "application/x-www-form-urlencoded"
        // );
        // asyncRequest.send("userID=" + encodeURIComponent(userID));

        // allWords = asyncRequest.responseText.split("\n"); // .split("\r\n")

        //load clusters
        for (var i = 0; i < clusterWords.length; i++) {
          //create cluster
          createCluster(clusterWords[i].cluster);

          //add terms to the cluster
          for (var j = 0; j < clusterWords[i].words.length; j++) {
            x = document.getElementById(clusterWords[i].cluster);

            $(x.getElementsByClassName("sortable")).append(
              "<li class='ui-state-default ui-sortable-handle' onmousedown=\"wordMouseDown(event)\"><span class='terms'>" +
                clusterWords[i].words[j].word +
                "</span></li>"
            );
          }
        }

        //get the list of documents name
        // documentsName = documentsNameString.split("\n"); // .split("\r\n")

        asyncRequest.open("POST", "./cgi-bin/fetchFileList.py", false);
        asyncRequest.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        asyncRequest.send("userID=" + encodeURIComponent(userID));

        documentsNameString = asyncRequest.responseText;
        documentsName = documentsNameString.split("\n"); // .split("\r\n")



        var date2 = new Date();
        var n2 = date2.getTime();

        // get general view graph
        // generalViewGraph = getGeneralViewGraph(0.97);

        var date3 = new Date();
        var n3 = date3.getTime();

        //load General View
        // generalViewLoader(0.7);

        var date4 = new Date();
        var n4 = date4.getTime();

        //refresh tree view
        refreshTreeView();

        //select the first cloud
        clusterClicked(clusterWords[0].cluster);

        $("#slider1").slider("enable");
        $("#slider2").slider("enable");
        $("#slider3").slider("enable");
        $("#slider1_Textbox").removeAttr("disabled");
        $("#slider2_Textbox").removeAttr("disabled");
        $("#slider3_Textbox").removeAttr("disabled");

        //selecte the first session (empty one)
        // getListOfSessions("first");

        //change the mouse icon
        document.body.style.cursor = "auto";
      }
    },
    error: function (msg) {
      document.body.style.cursor = "auto";

      alert("Internal Server Error: unsuccessful load data from server");
    },
  });
}


/**
 * Open Help Page.
 */
function openHelpPage() {
  saveLog("openHelpPage");
  window.open("./userguide.html", "_blank");
}

/**
 * Convert the input data to appropriate format.
 * @return the cloud of the cluster (top 30)
 */
function getClusterCloud() {
  saveLog("getClusterCloud");
  var tempClusterCloud = "[";

  for (var i = 0; i < clusterKeytermsOriginal.length; i++) {
    var temp = eval(clusterKeytermsOriginal[i]);
    tempClusterCloud += '{"cluster":"cluster' + i + '", "cloud": "';

    for (var j = 0; j < temp.length; j++) {
      if (j == 0) {
        tempClusterCloud +=
          temp[j] +
          "|" +
          // Math.floor(getValueOfTerm("cluster" + i, temp[j]) / 10);
          getValueOfTerm("cluster" + i, temp[j]);
      } else {
        tempClusterCloud +=
          "|" +
          temp[j] +
          "|" +
          // Math.floor(getValueOfTerm("cluster" + i, temp[j]) / 10);
          getValueOfTerm("cluster" + i, temp[j]);
      }

      if (j == 30) {
        //only top 30
        break;
      }
    }

    tempClusterCloud += '"}';
    if (i + 1 < clusterKeytermsOriginal.length) {
      tempClusterCloud += ",";
    }
  }

  tempClusterCloud += "]";

  return JSON.parse(tempClusterCloud);
}

/**
 * Convert the input data to appropriate format.
 * @return the sorted list of documents of each cluster
 */
function getClusterDocuments() {
  saveLog("getClusterDocuments");
  var tempClusterDocuments = "[";

  for (var i = 0; i < clusterDocs.length; i++) {
    var temp = eval(clusterDocs[i]);
    sortDocumentByScore(temp, "cluster" + i); //sort documents by score

    tempClusterDocuments += '{"cluster":"cluster' + i + '", "docs": [';

    for (var j = 0; j < temp.length; j++) {
      tempClusterDocuments += '{"ID":"' + temp[j] + '"}';

      if (j + 1 < temp.length) {
        tempClusterDocuments += ",";
      }
    }

    tempClusterDocuments += "]}";
    if (i + 1 < clusterDocs.length) {
      tempClusterDocuments += ",";
    }
  }

  tempClusterDocuments += "]";

  return JSON.parse(tempClusterDocuments);
}

/**
 * Sort the docuemnts by its score related to each cluster
 * @param documents = list of documents
 * @param clusterName = the name of cluster
 */
function sortDocumentByScore(documents, clusterName) {
  for (var i = 0; i < documents.length; i++) {
    var data_i;
    documentClusterData.filter(function (d) {
      if (d.name == documents[i]) {
        data_i = d[clusterName];
      }
    });

    for (var j = i + 1; j < documents.length; j++) {
      var data_j;
      documentClusterData.filter(function (d) {
        if (d.name == documents[j]) {
          data_j = d[clusterName];
        }
      });

      if (parseFloat(data_i) < parseFloat(data_j)) {
        var t = documents[i];
        documents[i] = documents[j];
        documents[j] = t;
        data_i = data_j;
      }
    }
  }
}

/**
 * Convert the input data to appropriate format.
 * @return the top all key terms of each cluster.
 */
function getClusterKeyTerms() {
  saveLog("getClusterKeyTerms");

  var tempClusterKeyTerms = "[";

  for (var i = 0; i < clusterKeytermsOriginal.length; i++) {
    var temp = eval(clusterKeytermsOriginal[i]);
    tempClusterKeyTerms += '{"cluster":"cluster' + i + '", "words": [';

    for (var j = 0; j < temp.length; j++) {
      tempClusterKeyTerms +=
        '{"word":"' +
        temp[j] +
        '", "v1":' +
        getValueOfTerm("cluster" + i, temp[j]) +
        "}";

      if (j + 1 < temp.length) {
        tempClusterKeyTerms += ",";
      }
    }

    tempClusterKeyTerms += "]}";
    if (i + 1 < clusterKeytermsOriginal.length) {
      tempClusterKeyTerms += ",";
    }
  }

  tempClusterKeyTerms += "]";

  return JSON.parse(tempClusterKeyTerms);
}

/**
 * Get the value of a term
 * @param index = the name of the column (cluster)
 * @param term = the term
 * @return the value of the term.
 */
function getValueOfTerm(index, term) {
  //filter the data
  var data = 0;
  termClusterData.filter(function (d) {
    if (d.name == term) {
      data = (d[index] > 0)?d[index]*10:0;//////////////////////////////////////
    }
  });

  return data;
}

/**
 * Convert the input data to appropriate format.
 * @return the top 5 terms of each cluster plus their names.
 */
function getClusterWords() {
  var tempClusterWords = "[";

  for (var i = 0; i < clusterKeytermsOriginal.length; i++) {
    tempClusterNumber = i;
    var temp = eval(clusterKeytermsOriginal[i]);
    tempClusterWords +=
      '{"cluster":"cluster' + tempClusterNumber + '", "words": [';

    for (var j = 0; j < temp.length; j++) {
      tempClusterWords += '{"word":"' + temp[j] + '"}';

      if (j + 1 < temp.length ) {
        //only top 5
        tempClusterWords += ",";
      }

      if (j + 1 == temp.length) {
        //only top 5
        break;
      }
    }

    tempClusterWords += "]}";
    if (i + 1 < clusterKeytermsOriginal.length) {
      tempClusterWords += ",";
    }
  }

  tempClusterWords += "]";

  return JSON.parse(tempClusterWords);
}

/**
 * Bring it to the front of other div (clusters)
 * @param clusterName = the name (ID) of cluster which was clicked
 */
function clusterZIndex(clusterName) {
  var clusters = document.getElementsByClassName("cluster");

  for (var i = 0; i < clusters.length; i++) {
    if ($(clusters[i]).attr("id") == clusterName) {
      $(clusters[i]).css("zIndex", 1);
    } else {
      $(clusters[i]).css("zIndex", 0);
    }
  }
}

/**
 * Load the clicked cluster
 * @param elementID = the name (ID) of cluster which was clicked
 */
function clusterClicked(elementID) {
  //dispatch an event anotherClusterClicked event
  document.dispatchEvent(new CustomEvent("anotherClusterClicked"));
  saveLog("clusterClicked");

  //brign it to front of other div (clusters)
  clusterZIndex(elementID);

  //enable drgagable
  $("#" + elementID).draggable("enable");

  //show cluster nodes
  // showClusterNodes(elementID);

  //check if the cluster is not selected before
  if (
    document.getElementById(elementID).style.borderColor != "rgb(254, 46, 154)"
  ) {
    var clusterColor = $("#" + elementID + " p").css("background-color");

    var clusterBorder = document.getElementsByClassName("cluster");

    for (i = 0; i < clusterBorder.length; i++) {
      clusterBorder[i].style.borderColor = "#cccccc";
      clusterBorder[i].style.borderWidth = "1px";
      clusterBorder[i].style.backgroundColor = "white";
    }

    $("#" + elementID).css("background-color", "Silver");
    document.getElementById(elementID).style.borderColor = "#FE2E9A";
    document.getElementById(elementID).style.borderStyle = "outset";
    document.getElementById(elementID).style.borderWidth = "2px";

    //change the background color of the cluster view pannel to
    //color of the cluster
    // $("#panel2title").css("background-color", clusterColor);
    $("#panel3title").css("background-color", clusterColor);
    $("#panel4title").css("background-color", clusterColor);
    // $("#panel5title").css("background-color", clusterColor);
    $("#panel6title").css("background-color", clusterColor);
    $("#panel7title").css("background-color", clusterColor);
    $("#panel8title").css("background-color", clusterColor);

    //load list of documnets of each cluster
    // docListLoad(elementID);
    if (document.getElementById("doc_content").innerHTML == "") {
    showNewDocument();
    createTermClusterChart();
    }

    //load list of key terms of each cluster
    listLoad(elementID, $("#" + elementID + " p").css("background-color"));

    //load the term cloud
    loadTermCloud(elementID);
  }
}

/**
 * Paralel Cordinator Diagram
 * part of this function is obtained from D3 website
 * @param allData = the data of diagram
 * @param panelName = The pannel name
 * @param ID = the ID of a specific data in Json file
 * @param divName = the division name
 * @param color = color of line
 */
function paralelCordinator(allData, panelName, ID, divName, color) {
  saveLog("paralelCordinator+" + panelName);
  //clear the svg
  $(divName).html("");

  var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background_par_cor,
    foreground_par_cor,
    y = {},
    dragging = {},
    x;

  //filter the data
  var data = allData.filter(function (d) {
    for (var i = 0; i < ID.length; i++) {
      if (d.name == ID[i]) {
        return d;
      }
    }
  });
  // #if panel7 then apply softmax across values to the data except name key
  // if (panelName == "#panel7") {
  //   for (var i = 0; i < data.length; i++) {
  //     var sum = 0;
  //     for (var j = 0; j < Object.keys(data[i]).length; j++) {
  //       if (Object.keys(data[i])[j] != "name") {
  //         sum += parseFloat(data[i][Object.keys(data[i])[j]]);
  //       }
  //     }
  //     for (var j = 0; j < Object.keys(data[i]).length; j++) {
  //       if (Object.keys(data[i])[j] != "name") {
  //         data[i][Object.keys(data[i])[j]] =
  //           (parseFloat(data[i][Object.keys(data[i])[j]]) / sum) * 100;
  //       }
  //     }
  //   }
  // }

  var number_of_clusters = d3.keys(data[0]).length - 1;

  var margin = { top: 10, right: 10, bottom: 20, left: 10 },
    width =
      ($(panelName).width() / 4) * number_of_clusters -
      margin.left -
      margin.right,
    height = $(panelName).height() - margin.bottom - $(panelName).height() / 4;

  x = d3.scale.ordinal().rangePoints([0, width], 1);
  var svg_par_cor = d3
    .select(divName)
    .append("svg")
    .attr("class", "svg_par_cor")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Extract the list of dimensions and create a scale for each.
  x.domain(
    (dimensions = d3.keys(data[0]).filter(function (d) {
      return (
        d != "name" &&
        d != "@!@@@%%@@@@%@@!!!@@" &&
        (y[d] = d3.scale.linear().domain([0, 100]).range([height, 0]))
      );
    }))
  );

  //paralelCordinator related Method
  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  //paralelCordinator related Method
  function transition(g) {
    return g.transition().duration(500);
  }

  //paralelCordinator related Method
  // Returns the path for a given data point.
  function path(d) {
    return line(
      dimensions.map(function (p) {
        return [position(p), y[p](d[p])];
      })
    );
  }

  //check if the number of clusters are more than 1
  if (dimensions.length > 1) {
    // Add grey background lines for context.
    background_par_cor = svg_par_cor
      .append("g")
      .attr("class", "background_par_cor")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path);

    // Add blue foreground lines for focus.
    foreground_par_cor = svg_par_cor
      .append("g")
      .attr("class", "foreground_par_cor")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", function (d, i) {
        return color[d.name];
      });

    // Add a group element for each dimension.
    var g = svg_par_cor
      .selectAll(".dimension")
      .data(dimensions)
      .enter()
      .append("g")
      .attr("class", "dimension")
      .attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      })
      .call(
        d3.behavior
          .drag()
          .origin(function (d) {
            return { x: x(d) };
          })
          .on("dragstart", function (d) {
            dragging[d] = x(d);
            background_par_cor.attr("visibility", "hidden");
          })
          .on("drag", function (d) {
            dragging[d] = Math.min(width, Math.max(0, d3.event.x));
            foreground_par_cor.attr("d", path);
            dimensions.sort(function (a, b) {
              return position(a) - position(b);
            });
            x.domain(dimensions);
            g.attr("transform", function (d) {
              return "translate(" + position(d) + ")";
            });
          })
          .on("dragend", function (d) {
            delete dragging[d];
            transition(d3.select(this)).attr(
              "transform",
              "translate(" + x(d) + ")"
            );
            transition(foreground_par_cor).attr("d", path);
            background_par_cor
              .attr("d", path)
              .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
          })
      );

    // Add an axis and title.
    g.append("g")
      .attr("class", "axis_par_cor")
      .each(function (d) {
        d3.select(this).call(axis.scale(y[d]));
      })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", height + 15)
      .text(function (d) {
        return d;
      });
      
  }
  if (panelName == "#panel7") {
    // First, select all elements you want to attach the event to.
var scrollableElements = document.getElementsByClassName("clusterwordlist");

// Loop through all elements and attach the scroll event listener to each one.
for (var i = 0; i < scrollableElements.length; i++) {
    scrollableElements[i].addEventListener('scroll', function() {
      // Dispatch the custom event whenever the scroll event is triggered.
      // Use 'this' to refer to the current element in the loop that the event is attached to.
      this.dispatchEvent(new CustomEvent('customScrollEvent', { bubbles: true }));
    });
}

  }
}

/**
 * Show the word clouds
 * @param cloudWords = words of cloud
 * @param cloudSize = size of words of cloud
 * @param divisionName = the division name
 * @param parentDivisionName = name of the parrent division
 * @param color = true: colorfull cloud
 * @param title = the title of the pannel
 */
var division;
var parentDivision;
function wordCloud(
  cloudWords,
  cloudSize,
  divisionName,
  parentDivisionName,
  title
) {
  saveLog("wordCloud");
  try {
    //change the title of pannel
    $("#panel8title").text(title);

    division = divisionName;
    parentDivision = parentDivisionName;

    fill = d3.scale
      .linear()
      .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
      .range([
        "#222",
        "#333",
        "#444",
        "#555",
        "#666",
        "#777",
        "#888",
        "#999",
        "#aaa",
        "#bbb",
        "#ccc",
        "#ddd",
      ]);

    //reset words
    var parrentHight = $("#" + parentDivision).height();
    var heightSVG = parrentHight - 0.25 * parrentHight;
    var widthSVG = $("#" + parentDivision).width();
    d3.layout.cloud().size([widthSVG, heightSVG]).words();
    document.getElementById(division).innerHTML = "";
    scalingFactor = (currentSubset == PROPOSED_BOTH) ? 3 : 9;
    d3.layout
      .cloud()
      .size([widthSVG, heightSVG])
      .words(
        cloudWords.map(function (d) {
          return { text: d, size: Math.log(cloudSize[d]) * scalingFactor }; //20 + Math.random() * 30)};
        })
      )
      .padding(0)
      .rotate(function () {
        return ~~(Math.random() * 1) * 90;
      }) //for horizontal only
      //{return ~~(Math.random() * 5) * 30 - 60;}) // for all directions
      //{return ~~(Math.random() * 2) * 90; }) //for horizontal and verticall
      .font("Impact")
      .fontSize(function (d) {
        return d.size;
      })
      .on("end", draw)
      .start();
  } catch (e) {
    // TODO: handle exception
    window.alert(e.toString());
  }
}

/**
 * Draw the cloud in the specific division
 * @param words = words of cloud
 */
function draw(words) {
  try {
    var parrentHight = $("#" + parentDivision).height();
    var heightSVG = parrentHight - 0.25 * parrentHight;
    var widthSVG = $("#" + parentDivision).width();

    d3.select("#" + division)
      .append("svg")
      .attr("width", widthSVG)
      .attr("height", heightSVG)
      .append("g")
      .attr(
        "transform",
        "translate(" + widthSVG / 2 + "," + heightSVG / 2 + ")"
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .transition()
      .delay(function (d, i) {
        return i * 10;
      })
      .duration(0)
      .ease("elastic")
      .style("font-size", function (d) {
        return d.size + "px";
      }) //5*Math.log(d.size)
      .style("font-family", "Impact")
      .style("fill", function (d, i) {
        return fill(i);
      })
      .attr("text-anchor", "middle")
      .attr("transform", function (d) {
        // //check if the word is not out of the boundary
        // if(d.y < (-1 * (heightSVG/2 - 10))) {
        //   d.y = d.y + 10;
        // }
        // if(d.y > (heightSVG/2 - 10)) {
        //   d.y = d.y - 10;
        // }

        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) {
        return d.text;
      });
  } catch (e) {
    // TODO: handle exception
    window.alert(e.toString());
  }
}

/**
 * Get the text of words of cloud
 * @param cloudWords = two dimensional array contains words and weights
 * @returns {Array} list of words
 */
function wordText(cloudWords) {
  //sample
  //  var words = ["data minining", "information reterival", "art", "data", "ehsan", "sherkat",
  //              "human", "dataset", "database", "that", "before", "weka", "classification",
  //              "cluster", "skew", "nlp", "natural language processing", "bioinformatic",
  //              "statistics", "book", "processor", "pooling",
  //             ];

  var words = new Array();
  var count = 0;

  for (var i = 0; i < cloudWords.length; i++) {
    words[count] = cloudWords[i];
    count++;
    i++;
  }

  return words;
}

/**
 * get the size of words of cloud
 * @param cloudWords = cloud words
 * @returns hashMap of words count
 */
function sizeOfText(cloudWords) {
  var hashMap = {};

  for (var i = 0; i < cloudWords.length; i++) {
    hashMap[cloudWords[i]] = cloudWords[i + 1];
    i++;
  }

  return hashMap;
}

/**
 * Load the list of terms
 * @param clusterID = the ID of cluster
 * @param color = the color of barcharts
 */
function listLoad(clusterID, color) {
  saveLog("listLoad");

  //clear the list
  $("#barcharts").html("");
  $("#selectable").html("");
  $("#TermClusterView").html("");

  //read json file
  var json = clusterKeyTerms;
  var part3Data; // input data

  for (var i = 0; i < json.length; i++) {
    if (json[i].cluster == clusterID) {
      part3Data = json[i].words;

      //create the list of terms
      for (var i = 0; i < part3Data.length; i++) {
        if (i == 0) {
          //load paralel cordinator view for the first word
          $("#selectable").append(
            '<li draggable="true" ' +
              "class='ui-widget-content ui-selectee ui-selected' onclick=\"termClick(event)\"" +
              "style=\"background-color: rgb(135, 135, 135);\"><span class='termListSpan'>" +
              part3Data[i].word +
              "</span></li>"
          );

          //highlight the first term in the document view (if exists)
          $("#doc_content").removeHighlight(); //remove previous highlights
          // word = "/\b"+ word + "/\b";
          var re = new RegExp("\\b" + part3Data[i].word + "\\b", "gi"); //only find the word boundary
          $("#doc_content").highlight(re, "#767676");

          //load the parallecordinator view of the first term
          var words = new Array(1);
          var colors = {};
          words[0] = part3Data[i].word;
          colors[part3Data[i].word] = "#767676";
          paralelCordinator(
            // termClusterData,
            termProbabilities,
            "#panel7",
            words,
            "#TermClusterView",
            colors
          );
          document.querySelectorAll('.termListSpan').forEach(span => {
            span.addEventListener('click', function(event) {
              // This checks for the function in the parent <li> and calls it
              this.parentNode.onclick(event);
            });
          });

          //higlight the docuemnts that have the first word in general view graph
          // highlightDocuments(words);
        } else {
          $("#selectable").append(
            '<li draggable="true" " ' +
              "class='ui-widget-content' onclick=\"termClick(event)\"><span class='termListSpan'>" +
              part3Data[i].word +
              "</span></li>"
          );
        }
      }

      var bar_width = ($(panel3).width() * 30) / 100;
      var bar_height = $("#selectable").height() / part3Data.length;

      var picture1 = d3
        .select("#barcharts")
        .append("svg")
        .attr("width", bar_width)
        .attr("height", $("#selectable").height());

      //for scaling the size of data to the size of screen for the bar charts
      var linearScale = d3.scale
        .linear()
        .domain([0, 100])
        .range([0, bar_width]);

      //The right bars
      picture1
        .selectAll("rect.v2")
        .data(part3Data)
        .enter()
        .append("rect")
        .attr("height", bar_height - 4)
        .attr("width", bar_width)
        .attr("y", function (d, i) {
          return i * bar_height + 4;
        })
        .attr("x", 0)
        .style("stroke-width", "1px")
        .style("stroke", "DimGray")
        .style("fill", "none");

      //the left bars
      // part3Data =       [
    //     {
    //         "word": "delta air lines",
    //         "v1": 0.26991
    //     },
    //     {
    //         "word": "petroleum",
    //         "v1": -0.24218
    //     },
    //     ...BASELINE_BOTH.toExponential.apply.
    // ]
    // if item(dict) of part3Data has value v1 change the vi value to 0

    for (var i = 0; i < part3Data.length; i++) {///////////////////////////////////hope nothing breaks///// donte for error : Error: <rect> attribute width: A negative value is not valid. ("-0.30797217000000005")
      if (part3Data[i].v1 < 0) {
        part3Data[i].v1 = 0;
      }
    }
      picture1
        .selectAll("rect.v1")
        .data(part3Data)
        .enter()
        .append("rect")
        .attr("height", bar_height - 6)
        .attr("width", function (d, i) {
          temp = (currentSubset == PROPOSED_BOTH) ? 1 : 3;
          return linearScale((d.v1 - part3Data[part3Data.length - 1].v1) * temp);
        })
        .attr("y", function (d, i) {
          return i * bar_height + 5;
        })
        .attr("x", 1)
        .style("fill", "#b8b8b9"); //color); on comment for having similar color to clusters header color
    }
  }
}

/**
 * Load the load document
 * @param index = the index of document in the listbox
 */
function loadDoc(index) {
  saveLog("loadDoc");

  //get the ID (name) of selected cluster
  var selectedClusterName = getSelectedClusterID();

  //read doc content
  var json = clusterDocuments;
  var docJson;

  for (var i = 0; i < json.length; i++) {
    if (json[i].cluster == selectedClusterName) {
      docJson = json[i].docs;

      for (var j = 0; j < docJson.length; j++) {
        if (docJson[j].ID == index) {
          //show the doc content in paragraph tag of pannel 2
          document.getElementById("doc_content").innerHTML = getDocumentContent(
            docJson[j].ID
          );

          //Or
          // d3.select("#doc_content")
          //   .append("text")
          //   .text(docData);
          //Or
          // $("#doc_content").html(docData);

          //highlight the selceted term in the new document
          //highlight the term in the document view if exists
          $("#doc_content").removeHighlight(); //remove previous highlights

          var selectedTerms = document.getElementsByClassName(
            "ui-widget-content ui-selectee ui-selected"
          );
          var words = new Array(selectedTerms.length);
          var colors = {};

          for (var k = 0; k < selectedTerms.length; k++) {
            var word = $(selectedTerms[k]).text();
            var color = $(selectedTerms[k]).css("background-color");
            // word = "/\b"+ word + "/\b";
            var re = new RegExp("\\b" + word + "\\b", "gi"); //only find the word boundary
            $("#doc_content").highlight(re, color);
          }
        }
      }
    }
  }
}


/**
 * For right click of clusters in tree view
 */
$(function () {
  $.contextMenu({
    selector: ".context-menu-one",
    callback: function (key, options) {
      //for fetching the cluster name
      var clusterName = $(this).text();
      if ($(this).children().children().text().length > 0) {
        clusterName = clusterName.substring(
          0,
          clusterName.indexOf($(this).children().children().text())
        );
      }


      if (key == "Rename") {
        clusterRename(clusterName);
      }
    },
    items: {
      Rename: { name: "Rename", icon: "paste" }
    },
  });
});
/**
 * Renaming a cluster
 * @param oldName = the name of selected cluster
 */
function clusterRename(oldName) {
  saveLog("clusterRename");

  var clusterName = prompt('Please input a meaningful name of "' + oldName + '":');

  if (clusterName != null) {
    if (nameIsValid(clusterName)) {
      if (!nameExists(clusterName)) {

        saveLog("clusterRename", "oldName: " + oldName, "newName: " + clusterName);

        //rename the name of cluster in cluster view
        while (clusterName.includes(" ")) {
          clusterName = clusterName.replace(" ", "_"); //for space character
        }

        var cluster = "#" + oldName;
        $(cluster + " p").html(clusterName);

        //rename the ID of cluster
        $(cluster).attr("onclick", "clusterClicked('" + clusterName + "')");
        $(cluster).attr("id", clusterName);

        //rename the cluster in json data files
        renameClusterNameInJson(clusterKeyTerms, oldName, clusterName);
        renameClusterNameInJson(clusterCloud, oldName, clusterName);
        renameClusterNameInJson(clusterWords, oldName, clusterName);
        renameClusterNameInJson(clusterDocuments, oldName, clusterName);

        const index = clusterNames.indexOf(oldName);
        // Check if the oldName exists in the array
        if (index !== -1) {
            // Replace the old name with the new name
            clusterNames[index] = clusterName;
        }
        updateClusterName(oldName, clusterName)
        //rename the cluster in csv data files
        renameClusterNameInCSV("data2", oldName, clusterName);
        renameClusterNameInCSV("data1", oldName, clusterName);
        renameClusterNameInCSV("data3", oldName, clusterName);

        //rename the name of cluster in tree view
        refreshTreeView();
        createTermClusterChart();

        //rename the name of cluster in paralel cordinator views
        if (getSelectedClusterID() != "") {
          //check if the cluster is selected or not

          if (!isEmpty(clusterName)) {

            var selectedTerms = document.getElementsByClassName(
              "ui-widget-content ui-selectee ui-selected"
            );
            var words = new Array(selectedTerms.length);
            var colors = {};

            for (var i = 0; i < selectedTerms.length; i++) {
              words[i] = $(selectedTerms[i]).text();
              colors[$(selectedTerms[i]).text()] = $(selectedTerms[i]).css(
                "background-color"
              );
            }

            //load the parallecordinator view of the term
            paralelCordinator(
              // termClusterData,
              termProbabilities,
              "#panel7",
              words,
              "#TermClusterView",
              colors
            );
          }
        }

        //rename the name of the cluster in its tooltip
        // clusterToolTip(clusterName);

        //rename the name of cluster in general view graph
        // renameClusterNameInGraph(oldName, clusterName);
      } else {
        //if name exsits
        alert("This name has already been assigned to a cluster!");
      }
    } else {
      //if name is invalid
      alert(
        "The name should start with [A-Za-z].\r\n" +
          "[0-9] and '_' and '-' and [A-Za-z] are allowed for other characters."
      );
    }
  }
}

function updateClusterName(oldName, newName) {
  var input = {
    oldName: oldName,
    newName: newName
  };

  $.ajax({
    type: "POST",
    url: "./cgi-bin/update_cluster.py", // Ensure this is the correct path to your CGI script
    data: {
      userID: userID,
      cluster_name_update: JSON.stringify(input),
    },
    success: function (msg) {
      console.log(msg);
    }
  });
}



/**
 * Check if the cluste is empty or not
 * @param clusterName = the name of cluster to be checked
 * @return = true if empty
 */
function isEmpty(clusterName) {
  var empty = true;

  for (var i = 0; i < clusterWords.length; i++) {
    if (clusterWords[i].cluster == clusterName) {
      return false;
      break;
    }
  }

  return empty;
}

/**
 * Rename Cluster Name In Json file
 * @param jsonFile = the name of a json file
 * @param oldName = the old name of cluster
 * @param newName = the new name of cluster
 */
function renameClusterNameInJson(jsonFile, oldName, newName) {
  for (var i = 0; i < jsonFile.length; i++) {
    if (jsonFile[i].cluster == oldName) {
      jsonFile[i].cluster = newName;
    }
  }
}

/**
 * Rename cluster name in CSV file
 * @param data = the name of a csv file
 * @param oldName = the old name of cluster
 * @param newName = the new name of cluster
 */
function renameClusterNameInCSV(data, oldName, newName) {
  if (data == "data1") {
    //for documnet cluster data
    var header = documentClusterDataString.substring(
      0,
      documentClusterDataString.indexOf("\n")
    );
    var tail = documentClusterDataString.substring(
      documentClusterDataString.indexOf("\n") + 1
    );
    header = header.replace("," + oldName, "," + newName);

    documentClusterDataString = header + "\n" + tail;
    // alert(csvFileString);
    documentClusterData = d3.csv.parse(documentClusterDataString);
  } else if (data == "data2") {
    //for term cluster data
    var header = termClusterDataString.substring(
      0,
      termClusterDataString.indexOf("\n")
    );
    var tail = termClusterDataString.substring(
      termClusterDataString.indexOf("\n") + 1
    );
    header = header.replace("," + oldName, "," + newName);

    termClusterDataString = header + "\n" + tail;
    // alert(csvFileString);
    termClusterData = d3.csv.parse(termClusterDataString);
  }
  else if(data == "data3"){
    //data3 is the data for the term probabilities
    var header = termProbabilitiesString.substring(
      0,
      termProbabilitiesString.indexOf("\n")
    );
    var tail = termProbabilitiesString.substring(
      termProbabilitiesString.indexOf("\n") + 1
    );
    header = header.replace("," + oldName, "," + newName);

    termProbabilitiesString = header + "\n" + tail;

    termProbabilities = d3.csv.parse(termProbabilitiesString);
}
}

/**
 * Get Selected Cluster ID
 * @return the ID
 */
function getSelectedClusterID() {
  var clusters;
  var ID = "";
  clusters = document.getElementsByClassName("cluster");
  var i;
  for (i = 0; i < clusters.length; i++) {
    //get the ID of seleceted cluster by its border color
    if (clusters[i].style.borderColor == "rgb(254, 46, 154)") {
      ID = $(clusters[i]).attr("ID");
      break;
    }
  }

  return ID;
}


/**
 * Set top position of cluster (4 cluster in each row)
 */
function setTop() {
  var clusters = document.getElementsByClassName("cluster");
  var lengthOfCluster = Math.floor((clusters.length - 1) / 4);

  // return lengthOfCluster * 260 + 10;
  // return lengthOfCluster * ($('.cluster').height() + 10 ) + 10;
  return lengthOfCluster * 52 + 2;
}

/**
 * Set left position of cluster (4 cluster in each row)
 */
function setleft() {
  var clusters = document.getElementsByClassName("cluster");

  return (
    (((clusters.length - 1) % 4) + 1) * 0.12 +
    ((clusters.length - 1) % 4) * 24.5 +
    0.5
  );
}

/**
 * Create cluster
 * @param clusterName = the cluster name
 */
function createCluster(clusterName) {
  //add new cluster
  var clusterPannel = document.getElementById("panel4_1");

  $(clusterPannel).append(
    '<div class="cluster context-menu-two box menu-1 " id="' +
      clusterName +
      '" onclick="clusterClicked(\'' +
      clusterName +
      "')\"" +
      'ondrop="drop(event)" ondragover="allowDrop(event)" ondrag="clusterDrag(this)">' +
      '<p class="clusterTitle" title="Double click to rename this cluster" id="'+clusterName+"_title" + '"> ' +
      clusterName +
      "</p>" +
      '<div class="clusterwordlist">' +
      '<ul id="Terms' +
      clusterName +
      '" class="sortable ui-sortable">' +
      "</ul>" +
      "</div>" +
      "</div>"
  );

  //for styling the cluster
  $("#" + clusterName).css("background-color", "White");
  document.getElementById(clusterName).style.borderColor = "#cccccc";
  document.getElementById(clusterName).style.height = "93%";
  document.getElementById(clusterName).style.borderStyle = "outset";
  document.getElementById(clusterName).style.borderWidth = "1px";
  $("#" + clusterName + " p").css("background-color", setBackGroundColor());
  $("#" + clusterName).css("top", setTop() + "%");
  $("#" + clusterName).css("left", setleft() + "%");

  //for draging new cluster
  $(function () {
    var draggableDiv = $("#" + clusterName).draggable({
      obstacle: "#panel4title, #button12, #spliter1",
      distance: 10,
      containment: "#panel4",
      opacity: 0.55,
      preventCollision: true,
      scroll: true,
    });
    // disable the dragable for the word list
    // in order to be selectable
    $("#Terms" + clusterName, draggableDiv)
      .mousedown(function (ev) {
        draggableDiv.draggable("disable");
      })
      .mouseup(function (ev) {
        draggableDiv.draggable("enable");
      });
  });

  //for moving terms inside new cluster
  $(function () {
    $(".sortable").sortable({
      axis: "y",
      cancel: ".sortable li span",
    });
    $(".sortable").disableSelection();
  });

}




/**
 * When a cluster is draging
 * @param clusterID = cluster ID
 */
function clusterDrag(clusterID) {
  saveLog("clusterDrag");
  //enable the dragablity of the cluster
  $(clusterID).draggable("enable");

  //brign it to front of other div (clusters)
  clusterZIndex($(clusterID).attr("id"));
}

/**
 * When a panel is draging
 * @param panelID = panel ID
 */
function panelDrag(panelID) {
  saveLog("panelDrag");

  $("#panel2").css("zIndex", 0);
  $("#panel3").css("zIndex", 0);
  $("#panel4").css("zIndex", 0);
  $("#panel5").css("zIndex", 0);
  $("#panel6").css("zIndex", 0);
  $("#panel7").css("zIndex", 0);
  $("#panel8").css("zIndex", 0);
  // $("#panel9").css("zIndex", 0);//////////////

  $("#" + $(panelID).attr("id")).css("zIndex", 1);
  // $(panelID).draggable("enable");
}

/**
 * allowDrop for adding term to cluster
 * @param event = the event
 */
function allowDrop(event) {
  event.preventDefault();

  return false;
}

function dragTerm(event) {
  event.dataTransfer.setData("text", $(event.target).text());
}

/**
 * Drop for adding term to cluster
 * @param event = the event
 */
function drop(event) {
  saveLog("drop");

  event.preventDefault();

  var term = event.dataTransfer.getData("text").trim();

  if (term == "") {
    //for draging term from term list
    term = event.dataTransfer.getData("text/html").trim();
  }

  var clusterName;
  var className = $(event.target).attr("class");

  if (className == "clusterTitle") {
    clusterName = $(event.target).parent().attr("id");
  } else if (className == "clusterwordlist") {
    clusterName = $(event.target).parent().attr("id");
  } else if (className == "cluster context-menu-two box menu-1  ui-draggable") {
    clusterName = $(event.target).attr("id");
  } else if (className == "terms") {
    clusterName = $(event.target)
      .parent()
      .parent()
      .parent()
      .parent()
      .attr("id");
  } else if (className == "ui-state-default ui-sortable-handle") {
    clusterName = $(event.target).parent().parent().parent().attr("id");
  }

  if (clusterName != null) {
    var terms = document
      .getElementById(clusterName)
      .getElementsByClassName("sortable");

    if (!termExists($(terms).children(), term)) {
      var cluster = document.getElementById(clusterName);

      $(cluster.getElementsByClassName("sortable")).append(
        "<li class='ui-state-default ui-sortable-handle' onmousedown=\"wordMouseDown(event)\"><span class='terms'>" +
          term +
          "</span></li>"
      );
    } else {
      alert('This cluster already have "' + term + '"');
    }
  }

  return false;
}

function wordMouseDown(event) {
  //select term content
  selectTermContent(event.target);

  //highlight the term in key terms and the document content
  termInsideClusterClicked($(event.target).text());
}

/**
 * Refresh tree view
 */
function refreshTreeView() {
  var clusters = document.getElementsByClassName("cluster");
  var treeHtml =
    "<ul>" +
    '<li data-jstree=\'{ "opened" : true }\' class="context-menu-zero box menu-1"> ' +
    '<ul id="new_cluster_tree_view">';

  for (var i = 0; i < clusters.length; i++) {
    treeHtml =
      treeHtml +
      "<li onclick = \"clusterClicked('" +
      $(clusters[i]).attr("id") +
      "')\"" +
      ' class="context-menu-one box menu-1">' +
      $(clusters[i]).attr("id") +
      getFiles($(clusters[i]).attr("id")) +
      "</li>";
  }

  treeHtml = treeHtml + "</ul>" + "</li>";

  $.jstree.destroy();
  // $("#cluster_tree_view").html("");
  $("#cluster_tree_view").append(treeHtml);
  $("#cluster_tree_view").jstree();
}

/**
 * Get the list of files of the cluster
 * @param clusterName = get the name of the cluster
 * @return list of files of a cluster
 */
function getFiles(clusterName) {
  var files = "";

  // for (var i = 0; i < clusterDocuments.length; i++) {
  //   if (clusterDocuments[i].cluster == clusterName) {
  //     files += "<ul>";
  //     for (var j = 0; j < clusterDocuments[i].docs.length; j++) {
  //       files +=
  //         '<li data-jstree=\'{"icon":"img/pdf.gif"}\' onclick = "fileClicked(this)" class="context-menu-three box menu-1">' +
  //         clusterDocuments[i].docs[j].ID +
  //         "</li>";
  //     }
  //     files += "</ul>";
  //   }
  // }
  for (var i = 0; i < clusterDocuments.length; i++) {
    if (clusterDocuments[i].cluster === clusterName) {
      files += "<ul>";
      for (var j = 0; j < clusterDocuments[i].docs.length; j++) {
        var docId = clusterDocuments[i].docs[j].ID;
        files +=
          '<li data-jstree=\'{"icon":"img/pdf.gif"}\' ' +
          'data-docid="' + docId + '" ' +
          'onmouseenter="showDocText(this, \'' + docId + '\')" ' +
          'onmouseleave="hideDocText()" ' +
          'class="context-menu-three box menu-1">' +
          docId +
          "</li>";
      }
      files += "</ul>";
    }
  }

  return files;
}

function fetchDocumentText(docId) {
  return getDocumentContent(docId);
}

function showDocText(element, docId) {
  // issue event hoverdone
  document.dispatchEvent(new CustomEvent('waitandnext'));
  console.log(element)
  var docText = fetchDocumentText(docId);
  var popup = document.getElementById('docText');
  popup.textContent = docText; // Set the text for the popup
  popup.style.display = 'block'; // Show the popup

  // Position the popup near the element
  var rect = element.getBoundingClientRect();
  popup.style.position = 'absolute';
  popup.style.left = (rect.left + window.scrollX + 120) + 'px'; // 20px for slight offset
  popup.style.top = (rect.top + window.scrollY) + 'px';
}

function hideDocText() {
  var popup = document.getElementById('docText');
  popup.style.display = 'none'; // Hide the popup
}

/**
 * Check if the color is selected or not
 * @param color = color
 * @return hex value
 */
function colorIsSelected(color) {
  var result = false;

  var clusters = document.getElementsByClassName("clusterTitle");

  for (var i = 0; i < clusters.length; i++) {
    if (rgb2hex($(clusters[i]).css("background-color")) == color) {
      return true;
    }
  }

  return result;
}

/**
 * Convert rgb to hex
 * @param rgb = rgb
 * @return hex value
 */
function rgb2hex(rgb) {
  if (
    rgb != "rgba(0, 0, 0, 0)" && //for null color in chorme and opera
    rgb != "transparent"
  ) {
    //for null color in IE and Mozilla
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  } else {
    return "#"; //for null color
  }
}

/**
 * Return hex value of a digit
 * @param x = a digit
 * @return hex value
 */
function hex(x) {
  var hexDigits = "0123456789ABCDEF".split("");
  return isNaN(x) ? "00" : hexDigits[(x - (x % 16)) / 16] + hexDigits[x % 16];
}

/**
 * Choose the background color of clusters
 * @return a color code
 */
function setBackGroundColor() {
  //these are the constant colors of the first 28 clusters
  var colors = [
    "#9E1CDA",
    "#D95F02",
    "#995500",
    "#EEADAA",
    "#002395",
    "#FFA500",
    "#FFA500",
    "#FFCC00",
    "#0033FF",
    "#666699",
    "#BBBBBB",
    "#ED92FD",    
    "#2CA25F",
    "#55E8C9",
    "#A19404",
  ];

  // var colors = ["#138808", "#1E90FF", "#FFA500", "#FF9999",
  //               "#B9632C", "#2F4F4F", "#BDB76B", "#002395",
  //               "#AFEEEE", "#FFA500", "#FFE4E1", "#602F6B",
  //               "#8A2BE2", "#00FF00", "#4B0082", "#DDA0DD",
  //               "#808000", "#FFA07A", "#2F4F4F", "#FF8C00",
  //               "#00FA9A", "#006400", "#00FFFF", "#556B2F",
  //               "#0000CD", "#000080", "#FFDAB9", "#FF00FF",
  //               "#BA55D3", "#FAEBD7"];

  // var colors = ["#00FFFF", "#0000FF", "#A52A2A", "#FF1493",
  //               "#FF00FF", "#808080", "#FFFF00", "#8A2BE2",
  //               "#008000", "#FFFACD", "#ADD8E6", "#32CD32",
  //               "#00FF00", "#191970", "#808000", "#FFA500",
  //               "#800080", "#FA8072", "#D2B48C", "#008080",
  //               "#EE82EE"];

  for (var i = 0; i < colors.length; i++) {
    if (!colorIsSelected(colors[i])) {
      return colors[i];
    }
  }

  //if the number of clusters are more than the defual colors
  //choose a random color
  var extraColor = randomColor();
  while (colorIsSelected(extraColor)) {
    extraColor = randomColor();
  }

  return extraColor;
}

/**
 * Choose a random color
 * @return a color code
 */
function randomColor() {
  var letters = "0123456789ABCDEF".split("");
  var first = "56789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    if (i == 0) {
      color += first[Math.floor(Math.random() * 9)];
    } else {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }

  return color;
}

/**
 * Check if the name of cluster exists or not
 * @param name = the name of cluster
 */
function nameExists(name) {
  var clusters = document.getElementsByClassName("cluster");

  for (var i = 0; i < clusters.length; i++) {
    if ($(clusters[i]).attr("id") == name) {
      return true;
    }
  }

  return false;
}

/**
 * For right click of clusters
 */
$(function () {
  $.contextMenu({
    selector: ".context-menu-two",
    callback: function (key, options) {
      saveLog("clusterRightClick");   
      if (key == "RenameCluster") {
        clusterRename($(this).closest("div").attr("id"));
      }
    },
    items: {
      RenameCluster: { name: "RenameCluster", icon: "paste" },
    },
  });
});



/**
 * Checks if the term exists in the selected cluster or not
 * @param clusterTerms = the list of terms of selected cluster
 * @param term = the term
 * @return true: if exists, false: in not exists
 */
function termExists(clusterTerms, term) {
  var exists = false;

  for (var i = 0; i < clusterTerms.length; i++) {
    if ($(clusterTerms[i]).text() == term) {
      exists = true;
      break;
    }
  }

  return exists;
}

/**
 * load list of documets of selected cluster
 * @param clusterName = the name of cluster
 */
function docListLoad(clusterName) {
  $("#doc_content").html("");
  $("#doc_select").html("");
  $("#DocumentClusterView").html("");

  var json = clusterDocuments;
  var Data; // input data

  for (var i = 0; i < json.length; i++) {
    if (json[i].cluster == clusterName) {
      Data = json[i].docs;

      //clear the previes list
      $("#doc_select").html("");
      // $("#doc_content").html("");

      for (var j = 0; j < Data.length; j++) {
        $("#doc_select").append(
          '<option value="' + Data[j].ID + '" >' + Data[j].ID + "</option>"
        );

        //load the first document if it is for the first time
        if (j == 0) {
          $("#doc_content").html(getDocumentContent(Data[j].ID));

          //show the parallel cordinator view of the first document
          var words = new Array(1);
          var colors = {};
          words[0] = Data[j].ID;
          colors[words[0]] = $("#" + clusterName + " p").css(
            "background-color"
          ); //"Blue";
          paralelCordinator(
            documentClusterData,
            "#panel6",
            words,
            "#DocumentClusterView",
            colors
          );

          //higlight the first document in general view
          // highlightDocGeneralView(Data[j].ID);
          // createTermClusterChart();
        }
      }
    }
  }

  //change the color of selected doc to red
  $("#doc_select").css("color", "red");
  var options = document.getElementById("doc_select").children;
  var selected = $("#doc_select").val();
  for (var k = 0; k < options.length; k++) {
    if (options[k].value == selected) options[k].style.color = "red";
    else options[k].style.color = "black";
  }
}

/**
 * get the content of the documnet
 * @param docName = the name of the document
 * @return the content of the document
 */
function getDocumentContent(docName) {
  var content = "";

  // create request object
  var asyncRequest = new XMLHttpRequest();

  //for documet cluster data
  // asyncRequest.open("POST", "./" + userID + "/" + docName, false);
  // asyncRequest.send(); // send the request
  // content = asyncRequest.responseText;

  var params =
    "userID=" +
    encodeURIComponent(userID) +
    "&docName=" +
    encodeURIComponent(docName);
  asyncRequest.open("POST", "./cgi-bin/fetchDoc.py", false);
  asyncRequest.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  asyncRequest.send(params);
  content = asyncRequest.responseText;

  return content;
}
function reassignSelectedClass(term) {
  // Remove the ui-selected class from all elements
  $("#selectable .ui-widget-content").removeClass("ui-selected");

  // Find the element containing the specified term and add the ui-selected class to it
  $("#selectable .ui-widget-content").each(function() {
    if ($(this).text() === term) {
      $(this).addClass("ui-selected");
      return false; // Exit the loop once the term is found
    }
  });
}
/**
 * On each term click in term list
 */
function termClick(event) {
  saveLog("termClick");
  document.dispatchEvent(new CustomEvent('termInKeytermClicked'));
   // Determine if the target of the click is the span inside the li
   var targetElement = event.target;

   // Check if the target is the span and find the parent li if so
   if (targetElement.className.includes('termListSpan')) {
      reassignSelectedClass(targetElement.textContent);
      targetElement = targetElement.closest('li');
   }

  //highlight the term in the document view, if exists
  var selectedTerms = document.getElementsByClassName(
    "ui-widget-content ui-selectee ui-selected"
  );

  var color = setTermColor(targetElement);

  $("#doc_content").removeHighlight(); //remove previous highlights

  var words = new Array(selectedTerms.length);
  var colors = {};

  for (var i = 0; i < selectedTerms.length; i++) {
    var wordRegEx = new RegExp(
      "\\b" + $(selectedTerms[i]).text() + "\\b",
      "gi"
    ); //only find the word boundary
    words[i] = $(selectedTerms[i]).text();
    color = $(selectedTerms[i]).css("background-color");
    colors[$(selectedTerms[i]).text()] = color;
    $("#doc_content").highlight(wordRegEx, color);
  }

  //load the paralelcordinator view of the term
  if (selectedTerms.length > 0) {
    paralelCordinator(
      // termClusterData,
      termProbabilities,
      "#panel7",
      words,
      "#TermClusterView",
      colors
    );
  }
  $("#selectable").selectable({
    selected: function (event, ui) {
      // if(event.shiftKey){
      //   alert("");
      // }

      //highlight the term in the document view if exists
      var selectedTerms = document.getElementsByClassName(
        "ui-widget-content ui-selectee ui-selected"
      );

      var color = setTermColor(ui.selected);

      $("#doc_content").removeHighlight(); //remove previous highlights

      var words = new Array(selectedTerms.length);
      var colors = {};

      for (var i = 0; i < selectedTerms.length; i++) {
        var wordRegEx = new RegExp(
          "\\b" + $(selectedTerms[i]).text() + "\\b",
          "gi"
        ); //only find the word boundary
        words[i] = $(selectedTerms[i]).text();
        color = $(selectedTerms[i]).css("background-color");
        colors[$(selectedTerms[i]).text()] = color;
        $("#doc_content").highlight(wordRegEx, color);
      }

      //load the parallecordinator view of the term
      if (selectedTerms.length > 0) {
        paralelCordinator(
          // termClusterData,
          termProbabilities,
          "#panel7",
          words,
          "#TermClusterView",
          colors
        );
      }
    },
  });

  //remove the color of span
  $(".termListSpan").removeAttr("style");

  //highlight documents that have this term, inside general view graph
  // highlightDocuments(words);
}


/**
 * Set the background color of term
 * @param element = the selected term
 * @return a color code
 */
function setTermColor(element) {
  var wordList = document.getElementsByClassName(
    "ui-widget-content ui-selectee"
  );

  for (var i = 0; i < wordList.length; i++) {
    if (
      $(wordList[i]).attr("class") !=
      "ui-widget-content ui-selectee ui-selected"
    ) {
      //if it is not selected
      $(wordList[i]).removeAttr("style");
    }
  }

  var color = selectBackGroundColorOfTerm($(element).index());

  $(element).css("background-color", color);

  return color;
}

/**
 * Choose the background color of term
 * @param termIndex = the index of term in list of document terms
 * @return a color code
 */
function selectBackGroundColorOfTerm(termIndex) {
  //these are the constant colors of the first 30 selected terms
  // var colors = ["#F39814", "#9ACD32", "#FFFF00", "#EE82EE", "#00FF7F",
  //               "#87CEEB", "#006400", "#FA8072", "#FF0000", "#DDA0DD",
  //               "#FFC0CB", "#7B68EE", "#FFE4E1", "#48D1CC", "#00FF00",
  //               "#E6E6FA", "#778899", "#CD5C5C", "#DAA520", "#FF69B4",
  //               "#FFD700", "#FF1493", "#00BFFF", "#FA8072", "#FF8C00",
  //               "#00FFFF", "#7FFFD4", "#FF6347", "#F0F8FF", "#9ACD32"];

  var colors = [
    "#767676",
    "#878787",
    "#989898",
    "#A9A9A9",
    "#B2B2B2",
    "#BABABA",
    "#C3C3C3",
    "#CBCBCB",
    "#D4D4D4",
    "#DDDDDD",
    "#E5E5E5",
    "#3D3D1F",
    "#474724",
    "#525229",
    "#5C5C2E",
    "#666633",
    "#757547",
    "#85855C",
    "#949470",
    "#A3A385",
    "#B2B299",
    "#C2C2AD",
    "#472400",
    "#522900",
    "#5C2E00",
    "#663300",
    "#754719",
    "#855C33",
    "#94704D",
    "#A38566",
    "#B29980",
    "#C2AD99",
    "#D1C2B2",
    "#995C00",
    "#B26B00",
    "#CC7A00",
    "#E68A00",
    "#FF9900",
    "#FFA319",
    "#FFAD33",
    "#FFB84D",
    "#FFC266",
    "#FFCC80",
    "#FFD699",
    "#300000",
    "#400000",
    "#480000",
    "#500000",
    "#580000",
    "#680000",
    "#700000",
    "#780000",
    "#800000",
    "#880000",
    "#900000",
  ];

  var selectedTerms = document.getElementsByClassName(
    "ui-widget-content ui-selectee ui-selected"
  );
  if (selectedTerms.length > colors.length) {
    //if the number of clusters are more than the default colors
    //choose a random color
    var extraColor = randomColor();
    while (colorIsSelected(extraColor)) {
      extraColor = randomColor();
    }

    return extraColor;
  }

  if (selectedTerms.length == 1) {
    return colors[0];
  }

  if (termIndex <= colors.length) {
    return colors[termIndex];
  } else {
    termIndex =
      termIndex - Math.floor(termIndex / colors.length) * colors.length;

    var termColor = colors[termIndex];
    var index = termIndex;
    while (colorIsSelected(termColor)) {
      index++;
      if (index > colors.length - 1) {
        index = 0;
      }
      termColor = colors[index];
    }

    return termColor;
  }
}

/**
 * Check if the color is selected or not
 * @param color = color
 * @return hex value
 */
function colorIsSelectedForTerm(color) {
  var result = false;

  var wordList = document.getElementsByClassName(
    "ui-widget-content ui-selectee ui-selected"
  );

  for (var i = 0; i < wordList.length; i++) {
    if (rgb2hex($(wordList[i]).css("background-color")) == color) {
      return true;
    }
  }

  return result;
}

/**
 * load term cloud
 * @param elementID = the ID of cluster
 */
function loadTermCloud(elementID) {
  saveLog("loadTermCloud");

  //clear the cloud
  $("#panel8_2").html("");

  //read json file
  var json = clusterCloud;
  for (var i = 0; i < json.length; i++) {
    if (json[i].cluster == elementID) {
      var words = json[i].cloud.split("|");
      var x = document.getElementById("cloudColor");
      var title = "Term Cloud (selected cluster)";
      wordCloud(
        wordText(words),
        sizeOfText(words),
        "panel8_2",
        "panel8",
        title
      );
    }
  }
}





/**
 * Clear cloud
 */
function clearCloud() {
  $("#panel8title").text("Term Cloud");
  $("#panel8_2").html("");
}

/**
 * Load the cloud again
 */
function loadCloudAgain() {
  loadTermCloud(getSelectedClusterID());
}

/**
 * Check the validity of the name of the cluster
 * This function checks if the name has the invalid characters
 * inside or not.
 * The name should start with [A-Za-z].
 * "[0-9] and '_' and '-' and [A-Za-z] are allowed for other characters.
 *
 * @param name = the name of the cluster
 * @return true: valid, false: invalid
 */
function nameIsValid(name) {
  var valid = true;
  //if name is empty it is invalid
  if (name == "") {
    valid = false;
  }

  for (var i = 0; i < name.length; i++) {
    if (i == 0) {
      //check if the first char is [A-Za-z]
      var re = new RegExp("[A-Za-z]");
      if (name.charAt(i).match(re) == null) {
        valid = false;
        break;
      }
    } else {
      var re = new RegExp("[A-Za-z0-9_-\\s]");
      if (name.charAt(i).match(re) == null) {
        valid = false;
        break;
      }
    }
  }

  return valid;
}

/*
 * For single and double click on a term inside cluster
 */
var DELAY = 300, //the delay between clicks
  clicks = 0, //numbr of clicks
  timer = null; //timer
$(document).delegate(".ui-sortable-handle", "click", function () {
  // alert('you clicked me again!');
  //
  clicks++; //count clicks

  if (clicks == 1) {
    saveLog("termInsideClusterClicked");

    var temp = this;

    timer = setTimeout(function () {
      //select term content
      selectTermContent(temp);

      //highlight the term in key terms and the document content
      termInsideClusterClicked($(temp).text());

      clicks = 0; //after action performed, reset counter
    }, DELAY);
  } else {
    clearTimeout(timer); //prevent single-click action

    var confirmed = confirm("Are you sure about deleting this term?");
    if (confirmed) {
      saveLog("Term Remove");
      $(this).remove(); //Remove the item form the cluster
    }

    clicks = 0; //after action performed, reset counter
  }
});

/*
 * For selecting the term content
 * @param term = clicked term
 */
function selectTermContent(term) {
  var range = document.createRange();
  range.selectNodeContents(term);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

/*
 * For single click on a term inside cluster
 * @param term = clicked term
 */
function termInsideClusterClicked(term) {
  //highlight the term in the document view if exists
  $("#doc_content").removeHighlight(); //remove previous highlights
  var re = new RegExp("\\b" + term + "\\b", "gi"); //only find the word boundary
  $("#doc_content").highlight(re, "#767676");

  //find the word in cluster key terms and highlight it
  var words = $(".ui-selectable").children();

  var wordList = $("#selectable .ui-widget-content");

  //remove all selected terms
  for (var i = 0; i < wordList.length; i++) {
    $(wordList[i]).removeAttr("style");
    if (i == 0) {
      $(wordList[i]).attr("class", "ui-widget-content ui-selectee ui-selected");
    } else {
      $(wordList[i]).attr("class", "ui-widget-content ui-selectee");
    }
  }

  for (var i = 0; i < words.length; i++) {
    //unselect the selected word in cluster term list
    $(words[i]).removeClass("ui-selected");

    if ($(words[i]).text() == term) {
      //if the term exists

      //select the word in cluster term list
      $(words[i]).addClass("ui-selected");

      //show the paralel cordinator of the term
      var words = new Array(1);
      var colors = {};
      words[0] = term;
      colors[words[0]] = "#767676";
      paralelCordinator(
        termProbabilities,
        "#panel7",
        words,
        "#TermClusterView",
        colors
      );

      //highlight documents that have this term, inside general view graph
      // highlightDocuments(words);
    }
  }
}

/*
 * select text of searchBox
 * @param term = clicked term
 */
function selectText() {
  var searchBox = document.getElementById("textbox1");
  searchBox.select();

  //or
  // $("#textbox1").select();
}

/*
 * Enable dragable for panel4 (Clusters view)
 */
function enableDrag() {
  //enabel drgagable
  // $("#panel4").draggable("enable");

  $("#panel2").css("zIndex", 0);
  $("#panel3").css("zIndex", 0);
  $("#panel4").css("zIndex", 1);
  $("#panel5").css("zIndex", 0);
  $("#panel6").css("zIndex", 0);
  $("#panel7").css("zIndex", 0);
  $("#panel8").css("zIndex", 0);
  // $("#panel9").css("zIndex", 0);/////////////////
}

/*
 * If MindMap Clicked
 */
function MindMapClicked() {
  if (userID != "") {
    window.open("./" + userID + "/docClusters.mm");
  }
}

/*
 * Show the cloud of the selected terms by the user.
 */
function showMyCloud() {
  saveLog("showMyCloud");

  var selectedCluster = getSelectedClusterID();

  if (selectedCluster != "") {
    var terms = $(
      document
        .getElementById(selectedCluster)
        .getElementsByClassName("sortable")
    ).children();

    var wordsTemp = "";
    for (var j = 0; j < terms.length; j++) {
      if (j == 0) {
        wordsTemp +=
          $(terms[j]).text() +
          "|" +
          // Math.floor(getValueOfTerm(selectedCluster, $(terms[j]).text()) / 10); //Math.floor(1*Math.log(getValueOfTerm(selectedCluster, $(terms[j]).text())));
          getValueOfTerm(selectedCluster, $(terms[j]).text());
      } else {
        wordsTemp +=
          "|" +
          $(terms[j]).text() +
          "|" +
          // Math.floor(getValueOfTerm(selectedCluster, $(terms[j]).text()) / 10); //Math.floor(1*Math.log(getValueOfTerm(selectedCluster, $(terms[j]).text())));
          getValueOfTerm(selectedCluster, $(terms[j]).text());
      }
    }

    //clear the cloud
    $("#panel8_2").html("");

    if (wordsTemp != "") {
      var words = wordsTemp.split("|");
      var x = document.getElementById("cloudColor");
      var title = "Term Cloud (User Terms)";
      wordCloud(
        wordText(words),
        sizeOfText(words),
        "panel8_2",
        "panel8",
        title
      );
    }
  }
}

/*
 * Add zero for numbers less than 10
 * @param num = number
 * @return number with zero if it is less than 10
 */
function twoDigitNumber(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
}


/**
 * Get the new list of clusters words.
 * @return the new list of terms of each clusterd determined by the user.
 */
function getNewClusterWords() {
  var tempClusterWords = "[";

  var clusters = document.getElementsByClassName("cluster");

  for (var i = 0; i < clusters.length; i++) {
    var clusterName = $(clusters[i]).attr("id");
    var terms = $(
      document.getElementById(clusterName).getElementsByClassName("sortable")
    ).children();

    tempClusterWords += '{"cluster":"' + clusterName + '", "words": [';

    for (var j = 0; j < terms.length; j++) {
      tempClusterWords += '{"word":"' + $(terms[j]).text() + '"}';

      if (j + 1 < terms.length) {
        tempClusterWords += ",";
      }
    }

    tempClusterWords += "]}";
    if (i + 1 < clusters.length) {
      tempClusterWords += ",";
    }
  }

  tempClusterWords += "]";

  return JSON.parse(tempClusterWords);
}



/*
 * On page close.
 */
function pageClose() {
  return "Did you saved your session?";
}


//varibales for contorling general view graph
var svg, //for T-SNE
  link, // T-SNE
  node, // T-SNE
  g, // T-SNE
  g2, //for force layout
  svg2, //for force layout
  link2, //for force layout
  node2, //for force layout
  r = 4; //r of circles
var linkedByIndex = new Array();
var linkedByIndex2 = new Array();
var gravity = 0.3;
var linkDistance = 20;
var highlight_trans = 0.25;


/*
 * Focus on the selected nodes
 * @param d = node
 */
function set_focus(d) {
  if (event.ctrlKey) {
    // for the keep functionality
    if (highlight_trans < 1) {
      saveLog("keepFunction");

      node2.style("opacity", function (o, i) {
        return isConnected(d, o) || $($(".node2")[i]).css("opacity") == 1
          ? 1
          : highlight_trans;
      });

      link2.style("opacity", function (o, i) {
        return o.source.index == d.index ||
          o.target.index == d.index ||
          $($(".link2")[i]).css("opacity") == 1
          ? 1
          : 0;
      });

      node.style("opacity", function (o, i) {
        return isConnected(d, o) || $($(".node")[i]).css("opacity") == 1
          ? 1
          : highlight_trans;
      });

      link.style("opacity", function (o, i) {
        return o.source.index == d.index ||
          o.target.index == d.index ||
          $($(".link")[i]).css("opacity") == 1
          ? 1
          : 0;
      });
    }
  } else if (event.altKey) {
    // for un-keep
    saveLog("unKeepFunction");
    //get the opacity of the clicked node
    var d_index = 0;
    node2.filter(function (o, i) {
      if (o.na == d.na) {
        d_index = i;
      }
    });

    node.filter(function (o, i) {
      if (o.na == d.na) {
        d_index = i;
      }
    });

    if ($($(".node2")[d_index]).css("opacity") == 1) {
      //remove the opacity of the node and its isolated neighbors
      var degree = {};
      link2.style("opacity", function (o, i) {
        if (o.source.index == d.index) {
          degree[o.target.index] = 0;
          return 0;
        } else if (o.target.index == d.index) {
          degree[o.source.index] = 0;
          return 0;
        } else {
          return $($(".link2")[i]).css("opacity") == 1 ? 1 : 0;
        }
      });

      //get neighbor nodes degree
      link2.filter(function (o, i) {
        if ($($(".link2")[i]).css("opacity") == 1) {
          if (o.target.index in degree) {
            degree[o.target.index]++;
          } else if (o.source.index in degree) {
            degree[o.source.index]++;
          }
        }
      });

      node2.style("opacity", function (o, i) {
        if (o.na == d.na) {
          return highlight_trans;
        } else if (isConnected(d, o) && degree[o.index] == 0) {
          return highlight_trans;
        } else {
          return $($(".node2")[i]).css("opacity");
        }
      });
    }

    if ($($(".node")[d_index]).css("opacity") == 1) {
      //remove the opacity of the node and its isolated neighbors
      var degree = {};
      link.style("opacity", function (o, i) {
        if (o.source.index == d.index) {
          degree[o.target.index] = 0;
          return 0;
        } else if (o.target.index == d.index) {
          degree[o.source.index] = 0;
          return 0;
        } else {
          return $($(".link")[i]).css("opacity") == 1 ? 1 : 0;
        }
      });

      //get neighbor nodes degree
      link.filter(function (o, i) {
        if ($($(".link")[i]).css("opacity") == 1) {
          if (o.target.index in degree) {
            degree[o.target.index]++;
          } else if (o.source.index in degree) {
            degree[o.source.index]++;
          }
        }
      });

      node.style("opacity", function (o, i) {
        if (o.na == d.na) {
          return highlight_trans;
        } else if (isConnected(d, o) && degree[o.index] == 0) {
          return highlight_trans;
        } else {
          return $($(".node")[i]).css("opacity");
        }
      });
    }
  } else {
    if (highlight_trans < 1) {
      node2.style("opacity", function (o) {
        return isConnected(d, o) ? 1 : highlight_trans;
      });

      link2.style("opacity", function (o) {
        return o.source.index == d.index || o.target.index == d.index ? 1 : 0;
      });

      node.style("opacity", function (o) {
        return isConnected(d, o) ? 1 : highlight_trans;
      });

      link.style("opacity", function (o) {
        return o.source.index == d.index || o.target.index == d.index ? 1 : 0;
      });
    }
  }
}

/*
 * check if two nodes are connected togather or not
 * @param a = node
 * @param b = node
 * @return true if connected
 */
function isConnected(a, b) {
  return (
    linkedByIndex[a.index + "," + b.index] ||
    linkedByIndex[b.index + "," + a.index] ||
    a.index == b.index
  );
}

/*
 * Create list of documents clusters name
 * @param clustersNames = the list of clusters name (comma separated)
 * @parm documentName = the name of the document
 * @return list of document clusters name.
 */
function createListOfDocumentClustersName(clustersNames, documentName) {
  var clusters = clustersNames.split(",");

  var list = "";

  for (var i = 0; i < clusters.length; i++) {
    list +=
      '<span style="font-size:20px;color:' +
      getClusterColor(clusters[i]) +
      ';">&#9679; </span><u class="hyperLink clusterNameInGraph" onclick=loadDocInCluster("' +
      documentName +
      '","' +
      clusters[i] +
      '")>' +
      clusters[i] +
      "</u><br>";
  }

  return list;
}




/*
 * Load document in the cluster
 * @param clusterName = cluster name
 * @parm documentName = the name of the document
 */
function loadDocInCluster(documentName, clusterName) {
  clusterClicked(clusterName);

  //load the document
  document.getElementById("doc_content").innerHTML = "";
  loadDoc(documentName);
  // createTermClusterChart();
  // highlightDocGeneralView(documentName);

  //show the paralel cordinator view
  var words = new Array(1);
  var colors = {};
  words[0] = documentName;
  colors[words[0]] = $("#" + clusterName + " p").css("background-color"); //"Blue";
  paralelCordinator(
    documentClusterData,
    "#panel6",
    words,
    "#DocumentClusterView",
    colors
  );

  //change the selected list of documents
  var docSelect = document.getElementById("doc_select");
  for (var i = 0; i < docSelect.options.length; i++) {
    if (docSelect.options[i].innerHTML == documentName) {
      docSelect.selectedIndex = i;
      break;
    }
  }
}

/*
 * Get cluster color
 * @param clusterName = cluster Name
 * @return color of the cluster
 */
function getClusterColor(clusterName) {
  if (clusterName != "") {
    return rgb2hex($("#" + clusterName + " p").css("background-color"));
  } else {
    return "#FF0000";
  }
}

/*
 * Get name of clusters that the document belongs to
 * @param documentName = document Name
 * @return the list of clusters seperated with comma
 */
function getDocumentClustersName(documentName) {
  var clusterList = "";

  for (var i = 0; i < clusterDocuments.length; i++) {
    for (var j = 0; j < clusterDocuments[i].docs.length; j++) {
      if (clusterDocuments[i].cluster != "@!@@@%%@@@@%@@!!!@@") {
        if (clusterDocuments[i].docs[j].ID == documentName) {
          if (clusterList == "") {
            clusterList = clusterDocuments[i].cluster;
          } else {
            clusterList += "," + clusterDocuments[i].cluster;
          }
        }
      }
    }
  }

  return clusterList;
}


/**
 * show the cluster nodes in general view graph
 * @param clusterName = neme of cluster
 */
function showClusterNodes(clusterName) {
  node.style("opacity", function (o) {
    if (o.co != "black") {
      return o.cl == clusterName ? 1 : highlight_trans;
    } else {
      var temp = o.cl.split(",");
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] == clusterName) {
          return 1;
        }
      }

      return highlight_trans;
    }
  });

  link.style("opacity", function (o) {
    if (o.source.co != "black" && o.target.co != "black") {
      return o.source.cl == clusterName && o.target.cl == clusterName
        ? 1
        : highlight_trans;
    } else {
      var tempSource = o.source.cl.split(",");
      var sourceCluster = "";
      for (var i = 0; i < tempSource.length; i++) {
        if (tempSource[i] == clusterName) {
          sourceCluster = clusterName;
          break;
        }
      }

      var tempTarget = o.target.cl.split(",");
      var targetCluster = "";
      for (var i = 0; i < tempTarget.length; i++) {
        if (tempTarget[i] == clusterName) {
          targetCluster = clusterName;
          break;
        }
      }

      return sourceCluster == clusterName && targetCluster == clusterName
        ? 1
        : highlight_trans;
    }
  });

  node2.style("opacity", function (o) {
    if (o.co != "black") {
      return o.cl == clusterName ? 1 : highlight_trans;
    } else {
      var temp = o.cl.split(",");
      for (var i = 0; i < temp.length; i++) {
        if (temp[i] == clusterName) {
          return 1;
        }
      }

      return highlight_trans;
    }
  });

  link2.style("opacity", function (o) {
    if (o.source.co != "black" && o.target.co != "black") {
      return o.source.cl == clusterName && o.target.cl == clusterName
        ? 1
        : highlight_trans;
    } else {
      var tempSource = o.source.cl.split(",");
      var sourceCluster = "";
      for (var i = 0; i < tempSource.length; i++) {
        if (tempSource[i] == clusterName) {
          sourceCluster = clusterName;
          break;
        }
      }

      var tempTarget = o.target.cl.split(",");
      var targetCluster = "";
      for (var i = 0; i < tempTarget.length; i++) {
        if (tempTarget[i] == clusterName) {
          targetCluster = clusterName;
          break;
        }
      }

      return sourceCluster == clusterName && targetCluster == clusterName
        ? 1
        : highlight_trans;
    }
  });
}
/**
 * Save log of user operations.
 * @param command = The number related to a command
 */
function saveLog(command) {
  $.ajax({
    url: "./cgi-bin/saveLog.py",
    type: "POST",
    cache: false,
    traditional: true,
    data: {
      userID: JSON.stringify(userID),
      command: JSON.stringify(command),
    },
  });
}

function getExplanation() {
  $.ajax({
    type: "POST",
    url: "./cgi-bin/explanation_details.py",
    data: {
      userID: JSON.stringify(userID),
    },
    success: function (msg) {
      explanation_details = msg["explanation_details"];
    },
  });
}
function transformData_relative_value(data, scalingFactor) {
  var transformed = [];
  var clusters = Object.keys(data);
  var numClusters = data[clusters[0]].length;
  var featureAverages = {};

  // Calculate feature averages
  clusters.forEach(function (key) {
    var total = 0;
    for (var i = 0; i < numClusters; i++) {
      total += data[key][i];
    }
    featureAverages[key] = total / numClusters;
  });

  // Calculate scaled relative differences
  for (var i = 0; i < numClusters; i++) {
    var clusterData = { cluster: clusterNames[i] };
    clusters.forEach(function (key) {
      var relativeDifference = data[key][i] - featureAverages[key];
      clusterData[key] = relativeDifference * scalingFactor;
    });
    transformed.push(clusterData);
  }
  return transformed;
}
function findMaxPositiveMinNegativeAggregates(documentExplanation) {
  let maxPositiveWithinDocument = 0;
  let minNegativeWithinDocument = 0;
  // [
  //   {
  //       "cluster": "Cluster 0",
  //       "Suicide": -0.20518726710123725,
  //       "Turkey": -0.2154713310387213,
  //       "Al-Qaeda": -0.3674422400032201,
  //       "United States": -0.181117468301637
  //   },
  //   {
  //       "cluster": "Cluster 1",
  //       ...
  for (let cluster in documentExplanation) {
    let positive = 0;
    let negative = 0;
    for (let key in documentExplanation[cluster]) {
      if (key == "cluster") {
        continue;
      }
      value = documentExplanation[cluster][key];
      if (value > 0) {
        positive += value;
      } else {
        negative += value;
      }
    }
    if (maxPositiveWithinDocument < positive) {
      maxPositiveWithinDocument = positive;
    }
    if (minNegativeWithinDocument > negative) {
      minNegativeWithinDocument = negative;
    }
  }
  return { maxPositiveWithinDocument, minNegativeWithinDocument };
}
function calculateYScale(explanation_details) {
  let maxPositiveAcrossDocument = 0;
  let minNegativeAcrossDocument = 0;
  for (let i in explanation_details) {
    let tempDoc_data = explanation_details[i];
    tempDoc_data = transformData_relative_value(tempDoc_data, 10);
    const { maxPositiveWithinDocument, minNegativeWithinDocument } =
      findMaxPositiveMinNegativeAggregates(tempDoc_data);
    if (maxPositiveWithinDocument > maxPositiveAcrossDocument) {
      maxPositiveAcrossDocument = maxPositiveWithinDocument;
    }
    if (minNegativeWithinDocument < minNegativeAcrossDocument) {
      minNegativeAcrossDocument = minNegativeWithinDocument;
    }
  }
  return { maxPositiveAcrossDocument, minNegativeAcrossDocument };
}
function getTopFeatures(doc_data, numberOfFeatures) {
  // Create an object to hold the sum of each feature's contributions across clusters
  let featureSums = doc_data.reduce((accumulator, current) => {
    // Go through each feature in the current cluster data
    Object.keys(current).forEach((key) => {
      if (key !== "cluster") {
        // Initialize if the feature hasn't been added to the accumulator yet
        if (!accumulator[key]) accumulator[key] = 0;
        // Add the feature's value to the sum
        accumulator[key] += Math.abs(current[key]); // Use absolute value if negative contributions are also 'important'
      }
    });
    return accumulator;
  }, {});

  // Convert the sums object into an array and sort by the sum values
  let sortedFeatures = Object.keys(featureSums)
    .map((key) => ({ feature: key, sum: featureSums[key] }))
    .sort((a, b) => b.sum - a.sum);

  // Return the names of the top 'numberOfFeatures' features
  return sortedFeatures.slice(0, numberOfFeatures).map((f) => f.feature);
}
function createTermClusterChart() {
  if(currentDocumentName=="paper6.txt"){
  }
  var panel9 = document.getElementById("panel9");
  var computedStyle = window.getComputedStyle(panel9);

  // Get the computed width and height from the CSS properties
  var panelWidth = parseFloat(computedStyle.width);
  var panelHeight = parseFloat(computedStyle.height);

  // Define margins as an object, you can adjust these values as needed
  var margin = { top: 0, right: 20, bottom: 100, left: 40 };

  // Calculate the actual width and height of the SVG canvas
  var width = panelWidth - margin.left - margin.right;
  var height = panelHeight - margin.top - margin.bottom;
  doc = getDocumentContent(currentDocumentName).replace(/\n$/, "");
  // doc = document.getElementById("doc_content").innerHTML.replace(/\n$/, "");
  // remove extra spaces within the document
  documentExplanation = explanation_details[doc.replace(/\s+/g, " ")];
  // var documentExplanation = {
  //   "Michael Fincke": [0.269, 0.268, 0.304, 0.290], feature: cluster 1, cluster 2, cluster 3, cluster 4
  //   "Astronaut": [0.217, 0.272, 0.278, 0.313],feature: cluster 1, cluster 2, cluster 3, cluster 4
  // };
  //loop through explanation_details and find out the heighest aggregate value possible:

  var scalingFactor = 10; // Choose a suitable scaling factor
  var doc_data = transformData_relative_value(
    documentExplanation,
    scalingFactor
  );
  //   doc_data = [
  //     {
  //         "cluster": "Cluster 0",
  //         "Iraq": 5.0265,
  //         "United Arab Emirates": 2.9354999999999998,
  //         "Arab world": -1.051525
  //     },
  //     {
  //         "cluster": "Cluster 1",
  //         "Iraq": 1.5460000000000003,
  //         "United Arab Emirates": 2.9354999999999998,
  //        ...
  //     },
  //     ...
  // ]

  var width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

  var svg = d3.select("#chart").select("svg");

  // If SVG is already present, remove it before creating a new one
  if (!svg.empty()) {
    svg.remove();
  }
  var svg = d3
    .select("#chart") //<div id="chart"></div>
    .append("svg") //<div id="chart"><svg></svg></div>
    .attr("width", width + margin.left + margin.right) //<div id="chart"><svg width="1000"></svg></div>
    .attr("height", height + margin.top + margin.bottom) //<div id="chart"><svg width="1000" height="500"></svg></div>
    .append("g") //<div id="chart"><svg width="1000" height="500"><g></g></svg></div>
    // This is useful for applying a single transformation to a group of elements, like translating (moving) all elements of the chart at once.
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //<div id="chart"><svg width="1000" height="500"><g transform="translate(30,20)"></g></svg></div>
  var x = d3.scale
    .ordinal()
    .rangeRoundBands([0, width], 0.3)
    .domain(
      doc_data.map(function (d) {
      return d.cluster;
    })
      
    );
    

  let topFeatures = getTopFeatures(doc_data, 5);

  // Update the domain of your color scale to use only the top features

  var color = d3.scale
    .ordinal()
    .range([
      "#8dd3c7",
      "#ffffb3",
      "#bebada",
      "#fb8072",
      "#80b1d3",
      "#fdb462",
      "#b3de69",
      "#fccde5",
    ])
    .domain(topFeatures);
  if (!maxPositiveAcrossDocument) {
    ({ maxPositiveAcrossDocument, minNegativeAcrossDocument } =
      calculateYScale(explanation_details));
  }
  var aggregateValues = doc_data.map(function (d) {
    return {
      cluster: d.cluster,
      aggregateValue: d3.sum(
        color.domain().map(function (name) {
          return d[name];
        })
      ),
    };
  });
  var highestAggregateCluster = aggregateValues.reduce(function (
    prev,
    current
  ) {
    return prev.aggregateValue > current.aggregateValue ? prev : current;
  }).cluster;



  var y = d3.scale
    .linear()
    .rangeRound([height, 0])
    .domain([minNegativeAcrossDocument, maxPositiveAcrossDocument]);

  //X axis
  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text") // Select all text elements for the x-axis // set text size to be 13px
    .style("font-size", "13px")
    .style("font-weight", function(d) { 
      return d == highestAggregateCluster ? "bold" : "normal"; 
    }); // Make only the specific label bold

  //Y axis
  var yAxis = d3.svg.axis().scale(y).orient("left");
    svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left) // Move the text to the left of the y-axis
    .attr("x", 0 - (height / 2)) // Center the text vertically
    .attr("dy", "1.4em") // Adjust distance from the y-axis
    .style("text-anchor", "middle") // Center align the text // make it bold
    // .style("font-weight", "bold") //make size  of text be bigger
    .style("font-size", "13px")

    .text("Document Belongingness to cluster");

  // #draw horizontal line at y=0

  var cluster = svg
    .selectAll(".cluster")
    .data(doc_data)
    .enter()
    .append("g")
    .attr("class", "g")
    .attr("transform", function (d) {
      return "translate(" + x(d.cluster) + ",0)";
    });


  cluster
    .selectAll("rect")
    .data(function (d) {
      var posAccumulator = 0; // Accumulator for positive values
      var negAccumulator = 0; // Accumulator for negative values
      return color.domain().map(function (name) {
        var value = d[name];
        var y0, y1;
        if (value >= 0) {
          y0 = posAccumulator;
          y1 = posAccumulator += value; // Add positive value to the accumulator
        } else {
          y0 = negAccumulator;
          y1 = negAccumulator += value; // Subtract negative value from the accumulator
        }
        return { name: name, y0: y0, y1: y1, cluster: d.cluster };
      });
    })
    .enter()
    .append("rect")
    .attr("width", x.rangeBand())
    .attr("y", function (d) {
      if (d.y1 > 0) {
        return y(d.y1); // Top edge for positive values
      } else {
        return y(d.y0); // Top edge for negative values
      }
    })
    .attr("height", function (d) {
      return Math.abs(y(d.y0) - y(d.y1));
    })
    .style("fill", function (d) {
      return color(d.name);
    })
    .style("stroke", function (d) {
      // Apply a special stroke to the cluster with the highest aggregate value
      if (d.cluster === highestAggregateCluster) {
        return "black"; // Example: gold border for emphasis
      }
      return null; // No special stroke for other clusters
    })
    .style("stroke-width", function (d) {
      // Apply a stroke width if this is the highest aggregate cluster
      return d.cluster === highestAggregateCluster ? 2 : 0;
    })

    .each(function (d) {
      var bar = d3.select(this);
      var barHeight = Math.abs(y(d.y0) - y(d.y1));

      if (barHeight > 20) {
        // Only add text if the bar is tall enough
        var barWidth = x.rangeBand();
        var barX = x(d.cluster) + barWidth / 2; // Center of the bar
        var barY;

        if (d.y1 > 0) {
          // Positive value: place the annotation inside the bar, near the top
          barY = y(d.y1) + barHeight / 2;
        } else {
          // Negative value: place the annotation inside the bar, near the bottom
          barY = y(d.y0) + barHeight / 2; // Change from minus to plus
        }

        svg
          .append("text")
          .attr("x", barX)
          .attr("y", barY)
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(d3.format(".2f")(d.y1 - d.y0))
          .style("fill", "black") // Consider changing the text color to white for better contrast
          .style("font-size", "10px"); // Adjust font size based on the bar height
      }
    });

  var line = d3.svg
    .line()
    .x(function (d) {
      return x(d.cluster) + x.rangeBand() / 2;
    }) // Center the line in the middle of the band
    .y(function (d) {
      return y(d.aggregateValue);
    })
    .interpolate("monotone"); // Smooth line

  svg
    .append("path")
    .datum(aggregateValues)
    .attr("class", "aggregate-line")
    .attr("d", line)
    .style("fill", "none")
    .style("stroke", "steelblue")
    .style("stroke-width", "2px");

  // Assuming 'aggregateValues' contains your aggregated data points
  svg
    .selectAll(".point")
    .data(aggregateValues)
    .enter()
    .append("circle") // Appends a new circle for each data point in 'aggregateValues'
    .attr("class", "point")
    .attr("cx", function (d) {
      return x(d.cluster) + x.rangeBand() / 2;
    }) // Centers the circle in the middle of the band
    .attr("cy", function (d) {
      return y(d.aggregateValue);
    }) // Sets the y position based on the aggregated value
    .attr("r", 5) // Sets the radius of the circle
    .style("fill", "black") // Sets the fill color of the circle, change as needed
    .style("stroke", "black") // Sets the stroke color of the circle, change as needed
    .style("stroke-width", "1px"); // Sets the stroke width of the circle, change as needed

  // Updated Legend Configuration
  var legendPadding = 20; // Padding around the text, if you want padding inside the legend item
  var legendSpacing = 0; // Space between legend items, adjust as needed
  var legendRectSize = 18; // The size of the legend color boxes
  var legendRectX = 0; // X position of the legend color boxes
  var font = "13px sans-serif"; // This should be the actual font size and style you're using in your legend
  var font2 = "29px ariel";
  var legendTextX = legendRectSize + 4;

  // Updated getTextWidth function
  function getTextWidth(text, font) {
    var canvas =
      getTextWidth.canvas ||
      (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font; // Ensure this matches the font size and style of the legend text
    var metrics = context.measureText(text);
    return metrics.width; // Only return the width of the text itself
  }

  // Calculate the width of each legend item with the correct font
  var legendItemWidths = color.domain().map(function (d) {
    return getTextWidth(d, font) + legendRectSize + 2 * legendPadding;
  });
  // Set the font here to match what is used in getTextWidth
  // Calculate the legend item offsets by accumulating widths and wrapping to new lines
  var legendItemOffsets = [];
  var accumWidth = 0; // Accumulator for the widths
  var lineHeight = 20; // Height of the legend line, adjust as needed
  var currentLine = 0; // Keep track of current line (y offset)

  color
    .domain()
    .slice()
    .reverse()
    .forEach(function (d, i) {
      if (accumWidth + legendItemWidths[i] > width) {
        // Check if adding the next legend item would exceed the chart width
        currentLine++; // Move to the next line
        accumWidth = 0; // Reset the width accumulator for the new line
      }
      legendItemOffsets.push({ x: accumWidth, y: currentLine * lineHeight }); // Push the position for the legend item
      accumWidth += legendItemWidths[i]; // Add the current item width to the accumulator
    });

  // Bind the legend data in the same order as it was calculated
  var legend = svg
    .selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      var pos = legendItemOffsets[i];
      return (
        "translate(" +
        pos.x +
        "," +
        (height + margin.bottom - currentLine * lineHeight - 20 + pos.y) +
        ")"
      );
    });

  legend
    .append("rect")
    .attr("x", legendRectX)
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .style("font", font)
    .text(function (d) {
      return d.replace(/\s+/g, " ");
    });

  svg
    .append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", y(0))
    .attr("y2", y(0))
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("stroke-dasharray", "5,5")
    .style("fill", "none");

  $.ajax({
    type: "POST",
    url: "./cgi-bin/getSupport.py",
    data: {
        doc: JSON.stringify(doc),
    },
    success: function (msg) {
      queryResults = msg["response"]
      buildText(queryResults);
      applyHighlighting(queryResults,topFeatures,color);
        
    },
    error: function (msg) {
        alert("Error in getting Support!");
    },
});
document.getElementById("feedbackFormContent").style.display = "block";
// #get content of paragraph with id question1
//extract first 76 characters and append the highestAggregateCluster
document.getElementById("question1").innerHTML = document.getElementById("question1").innerHTML.substring(0, 81) + highestAggregateCluster + "?";
// #get currrent cluster number
currentCluster = highestAggregateCluster.split(" ")[1]

// Append a text element to the SVG to display the assigned cluster
svg.append("text")
  .attr("x", width / 2) // Position at the center of the SVG
  .attr("y", height -10) // Increase y value to move the text lower
  .attr("text-anchor", "middle") // Center the text
  .style("font-size", "16px") // Set the font size // color grey
  .style("fill", "grey")
  .text(`Document is assigned to ${highestAggregateCluster}.`);

// console.log("tutorial given bahar", tutorialGiven)
if (tutorialGiven == false){
  // console.log("tutorial given", tutorialGiven)
  tutorialGiven = true;
  // console.log("tutorial given", tutorialGiven)
  document.dispatchEvent(new CustomEvent('FirstTutorial'));
}

}
function buildText(queryResults) {
  const textElt = $("#doc_content");
  textElt.empty();
  const elementsToAdd = [];
  const spaces = queryResults.spaces;
  const words = queryResults.words;

  spaces.forEach((spaceText, index) => {
    // add border top and botttom only of 4 px color white
    const spaceSpan = $("<span/>", { "class": "space", "id": `s${index}`, "style": "background-color: white; border-top: 3px solid white; border-bottom: 3px solid white; box-sizing: border-box; position: relative; z-index: 100;" }).text(spaceText);
    // spaceSpan.click(() => onSpanClick(index, true));
    elementsToAdd.push(spaceSpan);

    if (index < words.length) {
      const wordSpan = $("<span/>", { "class": "word", "id": `w${index}`, "style": "background-color: white; border-top: 3px solid white; border-bottom: 3px solid white; box-sizing: border-box; position: relative; z-index: 100;" }).text(words[index]);
      // wordSpan.click(() => onSpanClick(index, false));
      elementsToAdd.push(wordSpan, $("<wbr/>"));
    }
  });

  textElt.append(elementsToAdd);
}
// Function to apply highlighting based on annotations
// Function to apply highlighting and border based on annotations
// Function to apply highlighting, border, and pattern-like effect based on annotations
// Function to apply highlighting, alternating border widths, and opacity adjustment based on annotations
// Utility function to darken a color
function darkenColor(color, amount) {
  let r, g, b;

  // Check if the color is in HEX format
  if (color.startsWith('#')) {
    // Convert HEX to RGB
    const hex = color.slice(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    // Extract RGB components
    const result = color.match(/\d+/g);
    if (!result) {
      console.error('Invalid color format:', color);
      return color; // Return the original color if the format is invalid
    }
    [r, g, b] = result.map(Number);
  }

  // Darken the color
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  return `rgb(${r}, ${g}, ${b})`; // Return the darkened color
}


// Function to apply highlighting, alternating border widths, and opacity adjustment based on annotations
function applyHighlighting(queryResults, topFeatures, color) {
  const annotations = queryResults.annotations;
  annotations.sort((a, b) => a.support[0].wFrom - b.support[0].wFrom);

  annotations.forEach((ann, annIndex) => {
    if (topFeatures.includes(ann.title)) {
      const featureColor = color(ann.title);
      const borderWidth = '3px';
 
      ann.support.forEach(support => {
        for (let index = support.wFrom; index <= support.wTo; index++) {
          const wordSelector = `#w${index}`;
          const $wordElement = $(wordSelector);

          if (!$wordElement.hasClass("highlighted")) {
            // Apply initial styles and store the border color in a data attribute
            const borderColor = featureColor; // Use original color for borders
            $wordElement.css({
              'background-color': featureColor,
              'border-top': `${borderWidth} solid ${borderColor}`,
              'border-bottom': `${borderWidth} solid ${borderColor}`,
              'box-sizing': 'border-box',
              'position': 'relative',
              'z-index': 100 - annIndex,
            }).addClass("highlighted").data('original-border-color', borderColor);
          } else {
            // Retrieve the original border color from the data attribute
            const originalBorderColor = $wordElement.data('original-border-color');
            // Reapply styles without changing the border
            $wordElement.css({
              'background-color': featureColor,
              'border-top': `${borderWidth} solid ${originalBorderColor}`,
              'border-bottom': `${borderWidth} solid ${originalBorderColor}`,
              'z-index': 100 - annIndex,
            });
          }
        }
      });
    }
  });
}



















function getTermProbabilities(){
  var asyncRequest = new XMLHttpRequest();
  asyncRequest.open("POST", "./cgi-bin/FetchTermMembsProbabilities_baseline.py", false);
        asyncRequest.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        asyncRequest.send("userID=" + encodeURIComponent(userID));
        termProbabilitiesString = asyncRequest.responseText;

        termProbabilites = d3.csv.parse(asyncRequest.responseText);
        return termProbabilites;

}

function submitFeedback() {
  temp = numberOfDocumentsWithOnlyLocalExplanation + 1;
  if (currentDocumentName == "paper"+temp+".txt"){
    //check if cluster names are different from default cluster0, cluster1, cluster2, cluster3
    var defaultClusterNames = ["cluster0", "cluster1", "cluster2", "cluster3"];
    var clusterNamesList = [];
    for (var i = 0; i < clusterWords.length; i++) {
      clusterNamesList.push(clusterWords[i].cluster);
    }
    var clusterNamesSet = new Set(defaultClusterNames.concat(clusterNamesList));
    if (clusterNamesSet.size < 8) {
      //find intersection of defaultClusterNames and clusterNamesList
      var unchangedNames =defaultClusterNames.filter(name => clusterNamesList.includes(name));

      introJs().setOptions({
        exitOnOverlayClick: false, // Prevent closing the tutorial when clicking outside
        exitOnEsc: false, // Prevent closing the tutorial when pressing the Escape key
          steps: [
              {
                  element: document.querySelector('#'+unchangedNames[0]+'_title'),
                  intro: "Please examine the representative concepts of each cluster to choose appropriate names, including the currently highlighted cluster (" + unchangedNames[0] + "). Rename it by double-clicking on its name (" + unchangedNames[0] + ")."
              }
          ]
      }).start();
      return;
    }
    //exit the function
    
  }
  // Attempt to retrieve the checked radio button for the "support" question
  var supportRadioChecked = document.querySelector('input[name="support"]:checked');
  var support = supportRadioChecked ? supportRadioChecked.value : null;

  // Get the value of the textual feedback for the "support" question
  var reasonForSupport = document.getElementById("reasonForSupport").value.trim();

  // Get the value of the textual feedback for the "satisfaction" question
  var reasonForSatisfaction = document.getElementById("reasonForSatisfaction").value.trim();
  

  // Attempt to retrieve the checked radio button for the "satisfaction" question
  var satisfactionRadioChecked = document.querySelector('input[name="satisfaction"]:checked');
  var satisfaction = satisfactionRadioChecked ? satisfactionRadioChecked.value : null;

  // Get the value of the textual feedback if "No" is selected
  // var feedbackText = document.getElementById("feedbackText").value.trim();

  // Validate that both scales are responded to
  if (!support) {
    alert("Please respond to question 1");
    return; // Stop the function execution here
  } else if (!satisfaction) {
    alert("Please repond to question 2");
    return; // Stop the function execution here
  }

  // Validate the textual response for neutral or lower ratings
  if (support <= 3 && !reasonForSupport) { // Checks if the support rating is neutral or lower without a reason
    alert("Please provide a reason for question 1 rating.");
    return; // Stop the function execution here
  }

  if (satisfaction <= 3 && !reasonForSatisfaction) { // Checks if the satisfaction rating is neutral or lower without a reason
    alert("Please provide a reason for question 2 rating.");
    return; // Stop the function execution here
  }
  document.dispatchEvent(new CustomEvent('submitButtonevent'));
  // Use AJAX to send all feedback to the Python CGI script
  $.ajax({
    type: "POST",
    url: "/cgi-bin/userFeedback.py",
      data: { 
          supportReason: reasonForSupport,
          satisfactionReason: reasonForSatisfaction,
          // feedback: feedbackText,
          support: support,
          satisfaction: satisfaction,
          userID: userID,
          documentname: currentDocumentName,
          datetime: new Date().toISOString(),

      },
      success: function(response) {
          // Handle success
          // Close the modal and clear the form
          // document.getElementById("feedbackText").value = "";
          var radios = document.querySelectorAll('input[type="radio"]');
          radios.forEach(radio => radio.checked = false); // Uncheck all radio buttons
      },
      error: function(xhr, status, error) {
          // Handle error
          console.log("Error submitting feedback");
      }
  });
  // Unselect all selected radio buttons
  var supportRadios = document.querySelectorAll('input[name="support"]');
  supportRadios.forEach(function(radio) {
      radio.checked = false;
  });

  var satisfactionRadios = document.querySelectorAll('input[name="satisfaction"]');
  satisfactionRadios.forEach(function(radio) {
      radio.checked = false;
  });

  // Clear the textual response
  // document.getElementById("feedbackText").value = "";
  document.getElementById("reasonForSupport").value = "";
  document.getElementById("reasonForSatisfaction").value = "";
  
  showNewDocument();
  // introJs().exit();
}
popupdisplayed = false
function showPopup() {
  // document.dispatchEvent(new CustomEvent('waitandnext'));
    if(popupdisplayed == false){
      popupdisplayed = true
    const panel = document.getElementById("panel5");
    originalParent = panel.parentNode; // Store the original parent for later restoration

    const computedStyle = window.getComputedStyle(panel);
    originalWidth = computedStyle.width; // Store original width
    originalHeight = computedStyle.height; // Store original height

    // Set the panel size for the popup
    panel.style.width = "50vw";
    panel.style.height = "70vh";

    // Move the panel to the popup
    document.getElementById("popupContent").appendChild(panel);
    document.getElementById("popupWindow").style.zIndex = 1000000;

    // Show the popup
    document.getElementById("popupWindow").style.display = "flex"; // Use 'flex' to center the content
    }
}

function closePopup() {
    popupdisplayed = false
    const panel = document.getElementById("panel5");

    // Restore the panel size
    panel.style.width = originalWidth;
    panel.style.height = originalHeight;

    // Move back the panel to its original parent
    if (originalParent.hasChildNodes()) {
        originalParent.insertBefore(panel, originalParent.firstChild);
    } else {
        originalParent.appendChild(panel);
    }

    // Hide the popup
    document.getElementById("popupWindow").style.display = "none";
}


