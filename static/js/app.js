
// Define URL
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Read the data and check it
d3.json(url).then(data => {
    // Get the arrays from the data
    let samplesData = data.samples;
    let metadata = data.metadata;

    // Create the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Add the ids to the dropdown menu
    samplesData.forEach(sample => {
        dropdown.append("option").text(sample.id).property("value", sample.id);
    });

    //Function to update the plots
    function updatePlots () {
        //Select a sample ID
        let selectedSampleId = dropdown.property("value");

        //Find the sample in the data
        let selectedSample = samplesData.find(sample => sample.id === selectedSampleId);
        let selectedMetadata = metadata.find(entry => entry.id === parseInt(selectedSampleId));

        //Define the trace for the horizontal bar chart
        let barTrace = {
            x: selectedSample.sample_values.slice(0,10).reverse(),
            y: selectedSample.otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse(),
            text: selectedSample.otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: "h"
        };
    
        let barData = [barTrace];

        // Create the bar chart
        Plotly.newPlot("bar", barData);


        //Define the trace for the bubble chart
        let bubbleTrace = {
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            text: selectedSample.otu_lables,
            mode: "markers",
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: "Earth"
            }
        };

        let bubbleData = [bubbleTrace];

        // Create the bubble chart
        Plotly.newPlot("bubble", bubbleData);

        //Update the sample metadata
        let metadataDiv = d3.select("#sample-metadata");

        //Clear previous existent content
        metadataDiv.html("");

        // Iterate every key-value pair in the data 
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataDiv.append("p").html(`<strong>${key}: </strong>${value}`);
        });
    }

    //Display the plot and metadata
    updatePlots();

    //Add the event listener for the dropdown menu selection
    dropdown.on("change", updatePlots);
}).catch(error => console.log("Error fetching data:", error));
