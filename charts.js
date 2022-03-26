function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let sampledata = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = sampledata.filter(sampleObj => sampleObj.id == sample)
    //  5. Create a variable that holds the first sample in the array.
    let result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let ids = result.otu_ids;
    let labels = result.otu_labels;
    let values = result.sample_values;
    let masterArray= []
    for(let i =0; i<ids.length; i++){
      masterArray.push({
        id:ids[i],
        label:labels[i],
        value:values[i],
      })
    };

    let metadata = data.metadata.filter(sampleObj => sampleObj.id == sample);
    let wResult = metadata[0];
    let wfreq = wResult.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    masterArray.sort((a,b) => b.value - a.value)
    //idsSorted= result.map(a=>a.values.sort((a,b)=>a-b).reverse())
    valuesTop=masterArray.slice(0,10).reverse();
    
    //var yticks = valuesTop;
    console.log(resultArray[0]);
    //console.log(valuesTop.map(x=>x.id));
    //console.log(ids);
    //console.log(idsSorted);
    //console.log(idsTop);
    // 8. Create the trace for the bar chart. 
    let barData = [{
      x: valuesTop.map(x=>x.value),
      y: valuesTop.map(x=>"OTU " + x.id),
      text: valuesTop.map(x=>x.label),
      orientation:'h',
      type:"bar",
    }];
    // 9. Create the layout for the bar chart. 
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "X" },
      yaxis: {title: "Y"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout);

    
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: valuesTop.map(x=>x.id),
      y: valuesTop.map(x=>x.value),
      text: valuesTop.map(x=>x.label),
      mode:'markers',
      marker:{
        size:valuesTop.map(x=>x.value),
        color:valuesTop.map(x=> x.id),
        sizemode:'area',
        sizeref: 0.05,
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bacteria Cultures Per Sample",
      xaxis:{title:"OTU ID"},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble-plot",bubbleData,bubbleLayout); 
  


    var gaugeData = [{
      value: wfreq,
      title: {text: "<b> Belly Button Washing Frequency </b> <br> Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number", 
      gauge: {
        axis: {range: [null, 10], tickwidth: 1, tickcolor: "black"}, 
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2, 
        bordercolor: "black",
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"},
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 500,
      margin: {t:25, r:25, l:25, b:25},
      font: {color: "black", family: "Calibri"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge-plot", gaugeData, gaugeLayout);
    
  });
}
