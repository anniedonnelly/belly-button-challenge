const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Providing Test Subject ID no. for avaliable selection
function init(){
    let selector = d3.select("#selDataset");

    d3.json(url).then((data) => {
      jsData = data;
        let subjectID = data.names;
        subjectID.forEach((ID) => {
            selector
            .append('option')
            .text(ID)
            .property('value', ID);
        });
    });
    buildMetadata(940);
    buildCharts(940);
}

function optionChanged(newID) {
    buildMetadata(newID);
    buildCharts(newID);
};

//Provding Demographic Info Based on ID selected
function buildMetadata(ID) {

    d3.json(url).then((data) => {
        
        // Define metadata
        let metadata = data.metadata;

        // Filter by patient ID
        let filteredMetadata = metadata.filter(metaObj => metaObj.id == ID)[0];
    

        // PANEL //
        let demoPanel = d3.select("#sample-metadata");
        demoPanel.append("h6").text("ID: " + filteredMetadata.id);
        demoPanel.append("h6").text("ETHNICITY: " + filteredMetadata.ethnicity);
        demoPanel.append("h6").text("GENDER: " + filteredMetadata.gender);
        demoPanel.append("h6").text("AGE: " + filteredMetadata.age);
        demoPanel.append("h6").text("LOCATION: " + filteredMetadata.location);
        demoPanel.append("h6").text("BBTYPE: " + filteredMetadata.bbtype);
        demoPanel.append("h6").text("WFREQ: " + filteredMetadata.wfreq);


        // GAUGE CHART
        // Create variable for washing frequency
        var washFreq = filteredMetadata.wfreq;

        // Create the trace
        var gauge_data = [{
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: { text: "Washing Frequency (Times per Week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'white'},
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 2], color: 'rgb(170,195,214)' },
                        { range: [2, 4], color: 'rgb(95,143,169)' },
                        { range: [4, 6], color: 'rgb(3,87,142)' },
                        { range: [6, 8], color: 'rgb(4,54,103)' },
                        { range: [8, 10], color: 'rgb(3,30,72)' },
                    ],
                }
            }
        ];

        // Define Plot layout
        var gauge_layout = { 
            width: 500, 
            height: 400, 
            margin: { t: 0, b: 0 } };

        // Display plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    });
};

function buildCharts(ID) {

    d3.json(url).then((data) => {

        // Define samples
        let sample = data.samples

        // Filter by patient ID
        let filteredSample = sample.filter(bacteriaInfo => bacteriaInfo.id == ID)[0];


        // BAR CHART //
        // Create variables for chart
        let sample_values = filteredSample.sample_values
        let otu_ids = filteredSample.otu_ids
        let otu_labels = filteredSample.otu_labels
        
        // Create the trace
        var bar_data = [{
            // Use otu_ids for the x values
            x: sample_values.slice(0, 10).reverse(),
            // Use sample_values for the y values
            y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            // Use otu_labels for the text values
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        }]

        // Define plot layout
        var bar_layout = {
            title: "Top 10 Microbial Species in Belly Buttons",
            xaxis: { title: "Bacteria Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        // Display plot
        Plotly.newPlot('bar', bar_data, bar_layout)


        // BUBBLE CHART ??
        // Create the trace
        var bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                // Use otu_ids for the marker colors
                color: otu_ids,
                size: sample_values,
                colorscale: 'YlGnBu'
            }
        }];

        // Define plot layout
        var layout = {
            title: "Belly Button Samples",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        // Display plot
        Plotly.newPlot('bubble', bubble_data, layout)

    }); 
};
init();

