// A $( document ).ready() block.
// var dateElapsedTitle = [
//   "56 days ago","55 days ago","54 days ago","53 days ago","52 days ago","51 days ago","50 days ago",
//   "49 days ago","48 days ago","47 days ago","46 days ago","45 days ago","44 days ago","43 days ago","6 weeks ago","41 days ago","40 days ago",
//   "39 days ago","38 days ago","37 days ago","36 days ago","5 weeks ago","34 days ago","33 days ago","32 days ago","31 days ago","30 days ago",
//   "29 days ago","4 weeks ago","27 days ago","26 days ago","25 days ago","24 days ago","23 days ago","22 days ago","3 weeks ago","20 days ago",
//   "19 days ago","18 days ago","17 days ago","16 days ago","15 days ago","2 weeks ago","13 days ago","12 days ago","11 days ago","10 days ago",
//   "9 days ago","8 days ago","1 week ago","6 days ago","5 days ago","4 days ago","3 days ago","2 days ago","1 day ago","Today"
// ];

var datesElapsedTitle = [];

var table;
var countryFullList = [];
var countryDataJSON = [];
var covidJSONData;
var ellipseSize;
var colorListDark = [];
var colorListLight = [];

var origin;
var w;
var h;
var i = 0;
var horizontal = 0;

var dayCounter = 0;
var delayDayChange = 0;
var totalDays;
var renderNumeralsVisible = false;
var renderLabelsVisible = false;
var playActive = true;
var toggleInfoVisible = false;

var monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function preload() {
  table = loadTable(
    "countries-long-lat.csv",
    'csv', 
    'header'
  );

  covidJSONData = loadJSON("https://pomber.github.io/covid19/timeseries.json");
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  colorMode(HSB,360,100,100,100);
  background(232,18,10);
  rectMode(CENTER);

  countryFullList = Object.keys(covidJSONData);
  totalDays = covidJSONData[countryFullList[0]].length;
  
  dayCounter = 0;
  
  $(document).ready(function() {
    for(var i = 0; i < totalDays; i++){
      var d = new Date(covidJSONData[countryFullList[0]][i].date);
      var month = monthNames[d.getMonth()];
      var jsonString = d.getDate() + " " + month + " " + d.getFullYear();
      datesElapsedTitle.push(jsonString);
    }

    console.log(datesElapsedTitle);
    $("#circles-slider")
        .slider({
          max: totalDays-1,
          value: 0,
          step: 1
        })
        .slider("pips", {
          first: "pip",
          last: "pip",
          step: 7
        })
        .slider("float", {    
          labels: datesElapsedTitle 
        })
  });

  for (let r = 0; r < table.getRowCount(); r++){
    var countryName = table.getString(r, "name");
    var country = {
      "longitude": table.getString(r, "longitude"),
      "latitude": table.getString(r, "latitude")
    };

    if(covidJSONData[countryName] != undefined){
      countryDataJSON[countryName] = country;
    }
  }
  noStroke();

  colorListDark = [
    color('hsb(240,18%,11%)'),
    color('hsb(192,13%,11%)'),
    color('hsb(282,14%,11%)'),
    color('hsb(259,17%,10%)'),
    color('hsb(219,17%,10%)'),
    color('hsb(263,13%,10%)')
  ];

  colorListLight = [
    color('hsb(240,28%,14%)'),
    color('hsb(195,19%,14%)'),
    color('hsb(285,12%,13%)'),
    color('hsb(264,26%,9%)'),
    color('hsb(216,22%,9%)'),
    color('hsb(255,27%,10%)')
  ];
}

function draw() {
  if(playActive){
    $('#circles-slider').slider("value",dayCounter);
  } else {
    var sliderValue = $('#circles-slider').slider("option", "value");
    dayCounter = sliderValue;
  }

  translate(-windowWidth/30,windowHeight/20);
  for(let c = 0; c < countryFullList.length; c++){
    var wr = random(-1,1);
    var hr = random(-1,1); 

    rotate(wr);
    //var mostRecentIndex = covidJSONData[countryFullList[c]].length-dayCounter;
    var mostRecentIndex = dayCounter;    
    //console.log(covidJSONData[countryFullList[c]][mostRecentIndex].date);
    
    if(covidJSONData[countryFullList[c]][mostRecentIndex] != undefined){
      var mostRecentConfirmed = covidJSONData[countryFullList[c]][mostRecentIndex].confirmed;
    } else {
      var mostRecentConfirmed = 0;
    }
    
    var location = createVector(
      map(countryDataJSON[countryFullList[c]].longitude, -180, 180, 0, windowWidth),
      map(countryDataJSON[countryFullList[c]].latitude, 90, -90, 0, windowHeight)
    );
    
    ellipseSize = map(mostRecentConfirmed,0,100000,0,50);
    
    rectMode(CORNERS);
    var rNum = int(random(0,6));
    colorListDark[rNum].setAlpha(random(2,6));
    fill(colorListDark[rNum]);
    w = random(windowWidth/3);
    h = random(windowHeight/5);
    rect(location.x,location.y,location.x - w*wr,location.y - h*hr);
    
    rNum = int(random(0,6));
    colorListDark[rNum].setAlpha(random(2,5));
    fill(colorListDark[rNum]);
    fill(0,10,10,random(1,3));
    rect(location.x,location.y,location.x - w*wr,location.y - h*hr);

    rotate(-wr);
    rectMode(CENTER);
    rNum = int(random(0,6));
    colorListLight[rNum].setAlpha(random(0,20));
    fill(colorListLight[rNum]);
    rect(location.x,location.y,ellipseSize - w*wr,ellipseSize - h*hr);
    
    rNum = int(random(0,6));
    colorListLight[rNum].setAlpha(random(10,30));
    fill(hue(colorListLight[rNum]),saturation(colorListLight[rNum])+5,brightness(colorListLight[rNum])+5,alpha(colorListLight[rNum]));
    rect(location.x+random(-ellipseSize/20,ellipseSize/20),location.y+random(-ellipseSize/20,ellipseSize/20),ellipseSize,ellipseSize); 
      
    textAlign(CENTER,CENTER);

    
    if((mostRecentConfirmed > 0)&&(renderNumeralsVisible)){
      fill(0,70,80,50);
      textSize(8);
      text(mostRecentConfirmed,location.x,location.y); 
    } else {
      fill(0,70,80,30);
      rect(location.x,location.y,1,1); 
    }

    if(renderLabelsVisible){
      fill(0,70,80,40);
      textSize(8);
      text(countryFullList[c],location.x,location.y-8);    
    }
  }

  if(playActive){
    delayDayChange++;

    if (delayDayChange%20==0){
      if (dayCounter > totalDays){
        dayCounter = 0;
      } else {
        dayCounter++;
      }
    }
  }
}

function toggleInfo(){
  if(toggleInfoVisible){
    toggleInfoVisible = false;
    document.getElementById("info-paragraph").style.display = "none";
    document.getElementById("info-chev-down").style.display = "inline";
    document.getElementById("info-chev-up").style.display = "none";
  } else{
    toggleInfoVisible = true;
    document.getElementById("info-paragraph").style.display = "inline";
    document.getElementById("info-chev-down").style.display = "none";
    document.getElementById("info-chev-up").style.display = "inline";
  }
}

function playTimeline(){
  if(playActive){
    playActive = false;
    document.getElementById("button-play").style.backgroundColor = "rgb(59,10,0)";
    document.getElementById("p-button-on").style.display = "none";
    document.getElementById("p-button-off").style.display = "inline";
    document.getElementById("timeline-title").innerHTML = "Auto-play"
  } else {
    playActive = true;
    document.getElementById("button-play").style.backgroundColor = "rgb(224,41,0)";
    document.getElementById("p-button-on").style.display = "inline";
    document.getElementById("p-button-off").style.display = "none";
    document.getElementById("timeline-title").innerHTML = "Pause"
  }
}

function renderNumerals(){
  if(renderNumeralsVisible){
    renderNumeralsVisible = false;
    document.getElementById("button-numbers").style.backgroundColor = "rgb(59,10,0)";
    document.getElementById("n-button-on").style.display = "none";
    document.getElementById("n-button-off").style.display = "inline";
  } else {
    renderNumeralsVisible = true;
    document.getElementById("button-numbers").style.backgroundColor = "rgb(224,41,0)";
    document.getElementById("n-button-on").style.display = "inline";
    document.getElementById("n-button-off").style.display = "none";
  }
}

function renderCountryLabels(){
  if(renderLabelsVisible){
    renderLabelsVisible = false;
    document.getElementById("button-countries").style.backgroundColor = "rgb(59,10,0)";
    document.getElementById("c-button-on").style.display = "none";
    document.getElementById("c-button-off").style.display = "inline";
  } else {
    renderLabelsVisible = true;
    document.getElementById("button-countries").style.backgroundColor = "rgb(224,41,0)";
    document.getElementById("c-button-on").style.display = "inline";
    document.getElementById("c-button-off").style.display = "none";
  }
}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }