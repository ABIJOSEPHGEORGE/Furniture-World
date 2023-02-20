"use strict";

let orderDelivered = [];
let orderProcessing = [];
let orderShipped = [];
let orderCanceled = [];
let orderReturned = [];
let curr = new Date()
let week = []

fetch("https://www.furnitureworld.site/admin/graph-data",{
    method:"POST"
})
.then((res)=>{
    return res.json()
})
.then((res)=>{
    // PUSHING ALL DELIVERED ORDERS DATA
    const today = new Date()
      for (let i = 6; i >= 0; i--) {
        const day = new Date(today)
        day.setDate(today.getDate() - i)
        const dateString = day.toISOString().slice(0,10)
        week.push(dateString)
      }

        // GETTING ALL DELIVERY DATA
        week.forEach((day)=>{
            res.forEach((order)=>{
                let orderDate = order.order_date.slice(0,10)
                if(day==order.order_date.slice(0,10) && order.status === "delivered"){
                        const index = orderDelivered.findIndex(label => label.date === orderDate);
                        if(index === -1){
                            orderDelivered.push({date: day, delivery_count: 1});
                        } else {
                            orderDelivered[index].delivery_count++;
                        }
                }else if(day!==order.order_date.slice(0,10)){
                    const index = orderDelivered.findIndex(label => label.date === day);
                        if(index === -1){
                            orderDelivered.push({date:day,delivery_count:0})
                        }
                }
                
            })
        
        })
        
        // GETTING ORDERS PROCESSING DATA
        week.forEach((day)=>{
            res.forEach((order)=>{
                let orderDate = order.order_date.slice(0,10)
                if(day==order.order_date.slice(0,10) && order.status === "processing"){
                        const index = orderProcessing.findIndex(label => label.date === orderDate);
                        if(index === -1){
                            orderProcessing.push({date: day, processing_count: 1});
                        } else {
                            orderProcessing[index].processing_count++;
                        }
                }else if(day!==order.order_date.slice(0,10)){
                    const index = orderProcessing.findIndex(label => label.date === day);
                        if(index === -1){
                            orderProcessing.push({date:day,processing_count:0})
                        }
                }
                
            })
        
        })
        // GETTING ORDERS SHIPPED DATA
        week.forEach((day)=>{
            res.forEach((order)=>{
                let orderDate = order.order_date.slice(0,10)
                if(day==order.order_date.slice(0,10) && order.status === "shipped"){
                        const index = orderShipped.findIndex(label => label.date === orderDate);
                        if(index === -1){
                            orderShipped.push({date: day, shipped_count: 1});
                        } else {
                            orderShipped[index].shipped_count++;
                        }
                }else if(day!==order.order_date.slice(0,10)){
                    const index = orderShipped.findIndex(label => label.date === day);
                        if(index === -1){
                            orderShipped.push({date:day,shipped_count:0})
                        }
                }
                
            })
        
        })
        // GETTING ORDERS CANCELED DATA
        week.forEach((day)=>{
            res.forEach((order)=>{
                let orderDate = order.order_date.slice(0,10)
                if(day==order.order_date.slice(0,10) && order.status === "canceled"){
                        const index = orderCanceled.findIndex(label => label.date === orderDate);
                        if(index === -1){
                            orderCanceled.push({date: day, canceled_count: 1});
                        } else {
                            orderCanceled[index].canceled_count++;
                        }
                }else if(day!==order.order_date.slice(0,10)){
                    const index = orderCanceled.findIndex(label => label.date === day);
                        if(index === -1){
                            orderCanceled.push({date:day,canceled_count:0})
                        }
                }
                
            })
        
        })
        // GETTING ORDERS RETURNED DATA
        week.forEach((day)=>{
            res.forEach((order)=>{
                let orderDate = order.order_date.slice(0,10)
                if(day==order.order_date.slice(0,10) && order.status === "returned"){
                        const index = orderReturned.findIndex(label => label.date === orderDate);
                        if(index === -1){
                            orderReturned.push({date: day, returned_count: 1});
                        } else {
                            orderReturned[index].returned_count++;
                        }
                }else if(day!==order.order_date.slice(0,10)){
                    const index = orderCanceled.findIndex(label => label.date === day);
                        if(index === -1){
                            orderReturned.push({date:day,returned_count:0})
                        }
                }
                
            })
        
        })
    
    
    return  {
        orderDelivered,
        orderProcessing,
        orderShipped,
        orderCanceled,
        orderReturned,
    }
})
.then((data)=>{
    Chart.defaults.global.defaultFontColor = "#75787c";

    // ------------------------------------------------------- //
    // Line Chart
    // ------------------------------------------------------ //
    var legendState = true;
    if (window.outerWidth < 576) {
        legendState = false;
    }

    const LINECHART = document.getElementById("lineChart");
    var homeLineChart = new Chart(LINECHART, {
        type: "line",
        options: {
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: {
                            display: true,
                        },
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            max: 100,
                            min: 0,
                        },
                        display: true,
                        gridLines: {
                            display: false,
                        },
                    },
                ],
            },
            legend: {
                display: legendState,
            },
        },
        
        data: {
            
           
            labels: week.map((row)=>row),
            datasets: [
                {
                    label: "Processing",
                    fill: true,
                    lineTension: 0.2,
                    backgroundColor: "transparent",
                    borderColor: "#FFFF00",
                    pointBorderColor: "#FFFF00",
                    pointHoverBackgroundColor: "#FFFF00",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    borderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 1,
                    pointRadius: 2,
                    pointHitRadius: 10,
                    data: data.orderProcessing.map((col)=>col.processing_count),
                    spanGaps: false,
                },
                
                {
                    label: "Shipped",
                    fill: true,
                    lineTension: 0.2,
                    backgroundColor: "transparent",
                    borderColor: "#8F00FF",
                    pointBorderColor: "#8F00FF",
                    pointHoverBackgroundColor: "#8F00FF",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    borderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 1,
                    pointRadius: 2,
                    pointHitRadius: 10,
                    data: data.orderShipped.map((col)=>col.shipped_count),
                    spanGaps: false,
                },
                {
                    label: "Delivered",
                    fill: true,
                    lineTension: 0.4,
                    backgroundColor: "transparent",
                    borderColor: "#00FF00",
                    pointBorderColor: "#00FF00",
                    pointHoverBackgroundColor: "#00FF00",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    borderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 1,
                    pointRadius: 2,
                    pointHitRadius: 10,
                    data:data.orderDelivered.map((col)=>col.delivery_count),
                    spanGaps: false,
                },
                {
                    label: "Canceled",
                    fill: true,
                    lineTension: 0.4,
                    backgroundColor: "transparent",
                    borderColor: "#FF0000",
                    pointBorderColor: "#FF0000",
                    pointHoverBackgroundColor: "#FF0000",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    borderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 1,
                    pointRadius: 2,
                    pointHitRadius: 10,
                    data:data.orderCanceled.map((col)=>col.canceled_count),
                    spanGaps: false,
                },
                {
                    label: "Returned",
                    fill: true,
                    lineTension: 0.4,
                    backgroundColor: "transparent",
                    borderColor: "#FFA500",
                    pointBorderColor: "#FFA500",
                    pointHoverBackgroundColor: "#FFA500",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    borderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBorderColor: "#fff",
                    pointHoverBorderWidth: 1,
                    pointRadius: 2,
                    pointHitRadius: 10,
                    data:data.orderReturned.map((col)=>col.returned_count),
                    spanGaps: false,
                },
                
            ],
        },
    });
})

fetch("https://www.furnitureworld.site/admin/monthly-data",{
    method:"POST"
})
.then((res)=>{
    return res.json()
})
.then((res)=>{
    let orderProcessing=0;
    let orderShipped=0;
    let orderDelivered=0;
    let orderCanceled=0;
    let orderReturned=0;
    res.forEach((order)=>{
        if(order.status==="processing"){
            orderProcessing = orderProcessing+1;
        }else if(order.status==="shipped"){
            orderShipped = orderShipped+1;
        }else if(order.status==="delivered"){
            orderDelivered = orderDelivered+1;
        }else if(order.status==="canceled"){
            orderCanceled = orderCanceled+1;
        }else if(order.status==="returned"){
            orderReturned = orderReturned+1;
        }
        
    })

    // POLAR CHART
    const POLARCHART = document.getElementById("polarchart");
    const data = {
        labels: [
          'Processing',
          'Shipped',
          'Delivered',
          'Canceled',
          'Returned',
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [orderProcessing, orderShipped, orderDelivered, orderCanceled, orderReturned],
            backgroundColor: [
              '#FFFF00',
              '#8F00FF',
              '#00FF00',
              '#FF0000"',
              '#FFA500'
            ]
          }]
        };
    var homePolarChart = new Chart(POLARCHART, {
        type: 'polarArea',
        data: data,
        options: {}
    })
})

