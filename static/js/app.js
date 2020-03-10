
d3.json('../samples.json').then( (incomingData) => {
    


    var dataNames = incomingData.names

    var dataMeta = incomingData.metadata

    var dataSamples = incomingData.samples


    var dropdownMenu = d3.select("#selDataset");


    var BAR = d3.select('#bar').node()


    var BUBBLE = d3.select('#bubble').node()


    var META = d3.select('#sample-metadata')


    dataNames.forEach(name => {
        dropdownMenu.append('option').attr('value', name).text(name)
    });


    function init() {

        var initID = dataNames[0]
        var initMeta = dataMeta.filter( patient => patient.id === parseInt(initID))
        var initSamples = dataSamples.filter( item => item.id === initID)

        var initIDs = initSamples[0].otu_ids
        var initLabels = initSamples[0].otu_labels
        var initValues = initSamples[0].sample_values

        Object.keys(initMeta[0]).forEach( key => {
            META.append('p').classed('metaChild', true).text(`${key}: ${initMeta[0][key]}`)
        })

        var traceBubble = {
            mode: 'markers',
            x: initIDs,
            y: initValues,
            text:  initLabels,
            marker: {color: initIDs, size: initValues}
        }

   
        var bubbleLayout = {
            title: 'Occurance by OTU ID',
            xaxis: {title: 'OTU ID'},
            hovermode: 'closest'
        }

        var plotBubble = [traceBubble]


        Plotly.newPlot(BUBBLE, plotBubble, bubbleLayout)


        var barIDs = initIDs.slice(0, 10).map( label => 'OTU ' + String(label)).reverse()
        var barValues = initValues.slice(0, 10).reverse()
        var barLabels = initLabels.slice(0, 10).reverse()

        var traceBar = {
            type: 'bar',
            orientation: 'h',
            y: barIDs,
            x: barValues,
            text: barLabels
        }

        var barLayout = {
            title: 'Top 10 OTUs by Count'
        }

       
        var plotBar = [traceBar]

       
        Plotly.newPlot(BAR, plotBar, barLayout)
    }


  
    dropdownMenu.on('change', updatePlot)



    function updatePlot() {

        var updID = dropdownMenu.property("value");
        var updMeta = dataMeta.filter( patient => patient.id === parseInt(updID))
        var updSamples = dataSamples.filter( item => item.id === updID)
        

        var updIDs = updSamples[0].otu_ids
        var updLabels = updSamples[0].otu_labels
        var updValues = updSamples[0].sample_values

        d3.selectAll('.metaChild').remove()


        Object.keys(updMeta[0]).forEach( key => {
            META.append('p').classed('metaChild', true).text(`${key}: ${updMeta[0][key]}`)
        })


        Plotly.restyle(BUBBLE, 'x', [updIDs])
        Plotly.restyle(BUBBLE, 'y', [updValues])
        Plotly.restyle(BUBBLE, 'text', [updLabels])


        var barIDs = updIDs.slice(0, 10).map( label => 'OTU ' + String(label)).reverse()
        var barValues = updValues.slice(0, 10).reverse()
        var barLabels = updLabels.slice(0, 10).reverse()

        Plotly.restyle(BAR, 'x', [barValues])
        Plotly.restyle(BAR, 'y', [barIDs])
        Plotly.restyle(BAR, 'text', [barLabels])    
    }


    console.log(dataMeta)


    init()
    })


