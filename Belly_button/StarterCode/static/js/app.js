// Use D3 to load the samples.json from the specified URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(function(data) {
    // 'data' now contains the content of samples.json
    console.log(data);

    // Initialize the page with default data
    initializePage(data);

    // Set up event listener for dropdown change
    d3.select("#selDataset").on("change", function() {
      // Get the selected value from the dropdown
      var selectedValue = d3.select(this).property("value");

      // Update the charts and metadata based on the selected value
      updateCharts(selectedValue, data);
    });

  })
  .catch(function(error) {
    console.error("Error loading data:", error);
  });

// Function to initialize the page with default data
function initializePage(data) {
  // Populate the dropdown with sample IDs
  var dropdown = d3.select("#selDataset");

  data.names.forEach(function(sample) {
    dropdown.append("option").text(sample).property("value", sample);
  });

  // Use the first sample to populate the charts and metadata
  var initialSample = data.names[0];
  updateCharts(initialSample, data);
}

// Function to update charts and metadata based on the selected sample
function updateCharts(sample, data) {
  // Get the selected sample data
  var selectedSample = data.samples.find(s => s.id === sample);
  var metadata = data.metadata.find(m => m.id === parseInt(sample));

  // Update the bar chart
  updateBarChart(selectedSample);

  // Update the bubble chart
  updateBubbleChart(selectedSample);

  // Display the sample metadata
  displayMetadata(metadata);
}

// Function to update the bar chart
function updateBarChart(sample) {
  // Extract top 10 OTUs data
  var topOtuIds = sample.otu_ids.slice(0, 10).reverse();
  var topSampleValues = sample.sample_values.slice(0, 10).reverse();
  var topOtuLabels = sample.otu_labels.slice(0, 10).reverse();

  // Create the horizontal bar chart
  var trace = {
    x: topSampleValues,
    y: topOtuIds.map(id => `OTU ${id}`),
    text: topOtuLabels,
    type: "bar",
    orientation: "h"
  };

  var layout = {
    title: "Top 10 OTUs Found",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };

  Plotly.newPlot("bar", [trace], layout);
}

// Function to update the bubble chart
function updateBubbleChart(sample) {
  // Create the bubble chart
  var trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels,
    mode: "markers",
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids,
      colorscale: "Earth"
    }
  };

  var layout = {
    title: "OTU Bubble Chart",
    xaxis: { title: "OTU IDs" },
    yaxis: { title: "Sample Values" }
  };

  Plotly.newPlot("bubble", [trace], layout);
}

// Function to display sample metadata
function displayMetadata(metadata) {
  // Select the panel body element
  var panelBody = d3.select("#sample-metadata");

  // Clear existing metadata
  panelBody.html("");

  // Display each key-value pair from the metadata JSON object
  Object.entries(metadata).forEach(([key, value]) => {
    panelBody.append("p").text(`${key}: ${value}`);
  });
}
