// Get the endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Set variable for dataset
var bellydata;

// Initialize the function 
function init() {

// Use D3 to get the options for drop down Menu
  d3.json(url).then((data) => {
    bellydata = data; 
    console.log(data) 

// fill drop down
fillDrowpDown(bellydata);

  });
};

function fillDrowpDown(data){
  let dropdownMenu = d3.select("#selDataset");
    
// Set a variable for the sample names
  let samples = data.names;

  // Add  samples to dropdown menu
  samples.forEach((id) => {

  // Log the value of id 
      console.log(id);

      dropdownMenu.append("option")
      .text(id)
      .property("value",id);
  });

  // Set the first sample from the list
  let sample_one = samples[0];
  buildDashboard(sample_one, data);
}
// Function that populates metadata info
function buildMetadata(sample, data) {

  // Retrieve all metadata
  let metadata = data.metadata;

  // Filter based on the value of the sample
  let value = metadata.filter(result => result.id == sample);

  console.log(value)

  // Get the first index from the array
  let firstvalue = value[0];

  // Clear out metadata
  d3.select("#sample-metadata").html("");

  // Use Object.entries to add each key/value pair to the panel

  Object.entries(firstvalue).forEach(([key,value]) => {

      // Log the individual key/value pairs as they are being appended to the metadata panel
      console.log(key,value);

      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  });

};

// Function that builds the bar chart
function buildBarChart(sample, data) {


  let samplevalue = data.samples;

  // Filter based on the value of the sample
  let value = samplevalue.filter(result => result.id == sample);

  // Get the first index from the array
  let firstsample = value[0];

  // Get the otu_ids, lables, and sample values
  let otu_ids = firstsample.otu_ids;
  let otu_labels = firstsample.otu_labels;
  let sample_values = firstsample.sample_values;

  // Log the data to the console
  console.log(otu_ids,otu_labels,sample_values);

  // Set top ten items to display in descending order
  let yaxis = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
  let xaxis = sample_values.slice(0,10).reverse();
  let labels = otu_labels.slice(0,10).reverse();
  
  // Set up the trace for the bar chart
  let trace = {
      x: xaxis,
      y: yaxis,
      text: labels,
      type: "bar",
      orientation: "h"
  };

  // Call Plotly to plot the bar chart
  Plotly.newPlot("bar", [trace])
};

// Function that builds the bubble chart
function buildBubbleChart(sample, data) {

   // Retrieve all sample data
   let sampleInfo = data.samples;

   // Filter based on the value of the sample
   let value = sampleInfo.filter(result => result.id == sample);

   // Get the first index from the array
   let valueData = value[0];

   // Get the otu_ids, lables, and sample values
   let otu_ids = valueData.otu_ids;
   let otu_labels = valueData.otu_labels;
   let sample_values = valueData.sample_values;

   // Log the data to the console
   console.log(otu_ids,otu_labels,sample_values);
   
   // Set up the trace for bubble chart
   let trace1 = {
       x: otu_ids,
       y: sample_values,
       text: otu_labels,
       mode: "markers",
       marker: {
           size: sample_values,
           color: otu_ids,
           colorscale: "Viridis"
       }
   };

   // Set up the layout
   let layout = {
       hovermode: "closest",
       xaxis: {title: "OTU ID"},
   };

   // Call Plotly to plot the bubble chart
   Plotly.newPlot("bubble", [trace1], layout)
};

// Function that builds the Gauge chart

function buildGaugeChart(sample, data) {
 
  let sampleInfo = data.metadata;
  // Filter based on the value of the sample
  let value = sampleInfo.find(result => result.id == sample);
  console.log('Filtered value by id', value), value.wfreq;  
  let freq=value.wfreq
  let trace2 = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: freq,
    title: '<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week',
    type: "indicator",
    mode: "gauge+number",
    gauge: {
    axis: { range: [null, 9] },
    steps: [
    { range: [0, 1], color: "rgba(255, 0, 0, 1)",text:"0-1" },
    { range: [1, 2], color: "rgba(173, 216, 230, 1)",text:"1-2" },
    { range: [2, 3], color: "rgba(0, 0, 255, 1)",text:"2-3" },
    { range: [3, 4], color: "rgba(0, 0, 0, 1)",text:"3-4" },
    { range: [4, 5], color: "rgba(255, 255, 255, 1)",text:"4-5" },
    { range: [5, 6], color: "rgba(255, 255, 0, 1)",text:"5-6" },
    { range: [6, 7], color: "rgba(255, 165, 0, 1)",text:"6-7" },
    { range: [7, 8], color: "rgba(128, 0, 128, 1)",text:"7-8" },
    { range: [8, 9], color: "rgba(255, 192, 203, 1)",text:"8-9" }
    ]
    }
  }];
    let layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', trace2, layout);

}

// Function that updates dashboard when sample is changed
function buildDashboard(value) { 

  // Log the new value
  console.log(value); 

  // Call all functions 
  buildMetadata(value, bellydata);
  buildBarChart(value, bellydata);
  buildBubbleChart(value, bellydata);
  buildGaugeChart(value, bellydata);
};

// Call the initialize function
init();