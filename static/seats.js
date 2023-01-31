document.body.onload=async()=>{
    let basket = await(await fetch('/static/basket.json')).json();
    let seats = await(await fetch('/static/seatsOut.json')).json();
    let geography = await(await fetch('/static/geography.json')).json();
    
    //Calculate the total fare frm the basket
    let numberPassengers = basket.Passengers.length;
    let outfare = basket.JourneyPairs[0].OutboundSlot.Flight.FlightFares[0].Prices.Adult.Price;
    let retfare = basket.JourneyPairs[0].ReturnSlot.Flight.FlightFares[0].Prices.Adult.Price;
    var outfare_tax = basket.JourneyPairs[0].OutboundSlot.Flight.FlightTaxes.TaxAmount;
    var retfare_tax = basket.JourneyPairs[0].ReturnSlot.Flight.FlightTaxes.TaxAmount;
    var total = (outfare+retfare) * numberPassengers;
    var gov_tax = outfare_tax + retfare_tax;
    var air_fares = total - gov_tax;
    let b = document.getElementById('basketTotal');
    b.innerText = total.toFixed(2);
    b.ariaHidden = [air_fares.toFixed(2), gov_tax];
    
    //create list of passengers
    for(let i=0;i<basket.Passengers.length;i++){
        let pd = document.createElement('div');
        pd.innerHTML = `
        <img src="/static/passengers-adult.png" width='50px' style='background-color: orange; margin-left:30px;'></img>
        Adult ${i+1}
        `;
        pd.id = `passenger_${i}`;
        let seat = document.createElement('span');
        seat.style.paddingTop = '20px';
        seat.style.float = 'right';
        seat.id = `passengerSeat_${i}`;
        pd.append(seat);
        document.getElementById('passengerList').append(pd);
        pd.onclick = ()=>{    
            
            document.querySelector('.currentPassenger').classList.remove('currentPassenger');
            pd.classList.add('currentPassenger');
        }     
    }
    document.getElementById('passenger_0').classList.add('currentPassenger');//default select
    

    //Find outbound flight details
    let departAirport = basket.JourneyPairs[0].OutboundSlot.Flight.DepartureIata;
    let arriveAirport = basket.JourneyPairs[0].OutboundSlot.Flight.ArrivalIata;
   
    document.getElementById('airport_info').innerHTML = `${departAirport} to ${arriveAirport}, 
    ${new Date(basket.JourneyPairs[0].OutboundSlot.Flight.LocalDepartureTime).toString().substring(0,21)}`;
    //full airport name for outbound
    for(let i=0; i<geography.Airports.length; i++){
        if(geography.Airports[i].CityIata == departAirport){
            // console.log(geography.Airports[i].Name);
            var dep = geography.Airports[i].Name;
        }
        if(geography.Airports[i].CityIata == arriveAirport){
            // console.log(geography.Airports[i].Name);
            var arr = geography.Airports[i].Name;
        }
    }

    document.getElementById('outbound').innerHTML = `
    <div id='heading'>${dep} to ${arr}</div>
    <div>${basket.JourneyPairs[0].OutboundSlot.Flight.CarrierCode}${basket.JourneyPairs[0].OutboundSlot.Flight.FlightNumber}
    <img src="/static/Plane-Grey.png" width='20px'><img src="/static/line.png" width='200px'>
    </div>
    <div>Departure<span id='b_span1'>${new Date(basket.JourneyPairs[0].OutboundSlot.Flight.LocalDepartureTime).toString().substring(0,21)}</span></div>
    <div>Arrival<span id='b_span2'>${basket.JourneyPairs[0].OutboundSlot.Flight.LocalArrivalTime.substring(11,16)}</span></div><br>
    <div><b>Your fares</b></div>
    <div>
    ${[...new Set(basket.Passengers.map(x=>x.Type))]}
    <h6 style='float: right; margin-right:100px'>${numberPassengers} x £${outfare}</h6>
    </div><br>
    <b>Your flight options</b>
    <div id='flight_option'><span id='seat_info'>You have not selected seats yet.</span></div>
    <br>
    <div><b>Your cabin bags</b></div>
    <div>Small cabin bag<h6 style='float: right; margin-right:100px'>${numberPassengers} x Included</h6></div>
    <br>
    `;
    
    //Find inbound flight details
    let idepartAirport = basket.JourneyPairs[0].ReturnSlot.Flight.DepartureIata;
    let iarriveAirport = basket.JourneyPairs[0].ReturnSlot.Flight.ArrivalIata;

    //full airport name for inbound
    for(let i=0; i<geography.Airports.length; i++){
        if(geography.Airports[i].CityIata == idepartAirport){
            // console.log(geography.Airports[i].Name);
            var idep = geography.Airports[i].Name;
        }
        if(geography.Airports[i].CityIata == iarriveAirport){
            // console.log(geography.Airports[i].Name);
            var iarr = geography.Airports[i].Name;
        }
    }

    document.getElementById('inbound').innerHTML = `
    <div id='heading'>${idep} to ${iarr}</div>
    <div>${basket.JourneyPairs[0].ReturnSlot.Flight.CarrierCode}${basket.JourneyPairs[0].ReturnSlot.Flight.FlightNumber}
    <img src="/static/Plane-Grey.png" width='20px'><img src="/static/line.png" width='200px'>
    </div>
    <div>Departure<span id='b_span1'>${new Date(basket.JourneyPairs[0].ReturnSlot.Flight.LocalDepartureTime).toString().substring(0,21)}</span></div>
    <div>Arrival<span id='b_span2'>${basket.JourneyPairs[0].ReturnSlot.Flight.LocalArrivalTime.substring(11,16)}</span></div><br>
    <div><b>Your fares</b></div>
    <div>
    ${[...new Set(basket.Passengers.map(x=>x.Type))]}
    <h6 style='float: right; margin-right:100px'>${numberPassengers} x £${retfare}</h6>
    </div><br>
    <b>Your flight options</b>
    <div>You have not selected seats yet.</div>
    <br>
    <div><b>Your cabin bags</b></div>
    <div>Small cabin bag<h6 style='float: right; margin-right:100px'>${numberPassengers} x Included</h6></div>
    <br>
    `;

    //flight info
    for(let i=0;i<basket.Passengers.length;i++){
        let f = document.createElement('div');
        // f.innerHTML = `f_${i}`;
        f.id = i;
        document.getElementById('flight_option').append(f);
        let s = document.createElement('span');
        // s.innerHTML = 'none';
        f.append(s);
     }

    //Mark seats as available or not-available
    for(let r=0; r<seats.Rows.length; r++){
        let row = document.createElement('div');
        row.classList.add(`seatrow${r}`);
        for(let b=0; b<seats.Rows[r].Blocks.length; b++){
            let block = document.createElement('div');
            document.getElementById('seats').append(row);
            block.classList.add('block');
            row.append(block); 
            // console.log(seats.Rows[r].Blocks[0]); 
            let a = document.createElement('span');
            a.innerHTML = seats.Rows[r].RowNumber;
            a.style.color = 'white';
            a.style.fontWeight = 'bold';
            row.append(a);
            for(let s=0; s<seats.Rows[r].Blocks[b].Seats.length; s++){
                //individual seat
                let seat = document.createElement('div');
                seat.classList.add('seat');
                block.append(seat);
                //  console.log(seats.Rows[r].Blocks[0].Seats[2].SeatNumber);
                seat.id = `${seats.Rows[r].Blocks[b].Seats[s].SeatNumber}`;
                let seat_id = seat.id;
                let seat_div = document.getElementById(seat_id);
                seat_div.ariaHidden = seats.Rows[r].Blocks[b].Seats[s].Price;
                // console.log(seat_div);
                if(seat_div){
                    if(seats.Rows[r].Blocks[b].Seats[s].IsAvailable){
                        seat_div.classList.add('available');
                    }else{
                        seat_div.classList.add('unavailable');
                    }
                    
                    seat_div.onclick = ()=>{
                        clickOnSeat(seat_div); 
                        
                        document.getElementById('seat_info').innerHTML = '';
                        if(document.querySelector('.currentPassenger').id == 'passenger_0'){
                            document.getElementById('0').innerHTML = `${seats.Rows[r].Blocks[b].Seats[s].PriceBand} ${seat_div.id}
                            <span id='s0' style='float:right;margin-right:100px;'>${seats.Rows[r].Blocks[b].Seats[s].Price}</span>
                            `;
                            for(let i of basket.Passengers){
                            
                                if(basket.Passengers.length == 1){
                                    let skipSeat = document.getElementById('skip_seat');
                                    skipSeat.innerHTML = 'Continue';
                                    document.getElementById('seat_selected').innerHTML = 'Seat Selected';
                                    document.getElementById('seat_selected').style.fontWeight = 'bold';
                                }
                                
                            }
                        }
                        else{
                            document.getElementById('1').innerHTML = `${seats.Rows[r].Blocks[b].Seats[s].PriceBand} ${seat_div.id}
                            <span id='s1' style='float:right;margin-right:100px;'>${seats.Rows[r].Blocks[b].Seats[s].Price}</span>
                            `;
                            for(let i of basket.Passengers){
                            
                                if(basket.Passengers.length == 2){
                                    let skipSeat = document.getElementById('skip_seat');
                                    skipSeat.innerHTML = 'Continue';
                                    skipSeat.classList.add('skipSeat');
                                    
                                    let skipSeat2 = document.getElementById('skip_seat2');
                                    skipSeat2.innerHTML = 'Continue';
                                    skipSeat2.classList.add('skipSeat2');

                                    document.getElementById('seat_selected').innerHTML = 'Seat Selected';
                                    document.getElementById('seat_selected').style.fontWeight = 'bold';
                                }
                                
                            }
                        } 

                        
                                   
                    }
                    
                }
            }
                
        }
        
    }
    
    let div1 = document.createElement('div');
    div1.innerHTML = `${seats.Rows[0].PriceBandName} <span>£${seats.Rows[0].Blocks[0].Seats[0].Price}</span>
    <img src="static/information-icon.png" width='15px'></img>
    `;
    div1.classList.add('extra');
    div1.style.fontWeight = 'bold';
    div1.style.fontSize = '15px';
    document.getElementById('extra').append(div1);
    
    let div2 = document.createElement('div');
    div2.innerHTML = `${seats.Rows[1].PriceBandName} <span>£${seats.Rows[1].Blocks[0].Seats[0].Price}</span>
    <img src="static/information-icon.png" width='15px'></img>
    `;
    div2.classList.add('upfront');
    div2.style.fontWeight = 'bold';
    div2.style.fontSize = '15px';
    document.querySelector('.seatrow0').append(div2);

    let div3 = document.createElement('div');
    div3.innerHTML = `${seats.Rows[3].Blocks[0].Seats[0].SeatAccess} <span>£${seats.Rows[3].Blocks[0].Seats[0].Price}</span>
    <img src="static/information-icon.png" width='15px'></img>
    `;
    div3.classList.add('regular');
    div3.style.fontWeight = 'bold';
    div3.style.fontSize = '15px';
    document.querySelector('.seatrow2').append(div3);

    let div4 = document.createElement('div');
    div4.innerHTML = `${seats.Rows[10].PriceBandName} <span>£${seats.Rows[10].Blocks[0].Seats[0].Price}</span>
    <img src="static/information-icon.png" width='15px'></img>
    `;
    div4.classList.add('extra2');
    div4.style.fontWeight = 'bold';
    div4.style.fontSize = '15px';
    document.querySelector('.seatrow8').append(div4);

    let div5 = document.createElement('div');
    div5.innerHTML = `${seats.Rows[12].PriceBandName} <span>£${seats.Rows[12].Blocks[0].Seats[0].Price}</span>
    <img src="static/information-icon.png" width='15px'></img>
    `;
    div5.classList.add('rearstandard');
    div5.style.fontWeight = 'bold';
    div5.style.fontSize = '15px';
    document.querySelector('.seatrow10').append(div5);

    //outbount_box_hide
    let c = document.getElementById('cross');
        c.onclick=()=>{
        document.getElementById('outbound_info').remove();
        c.remove();
    }

    //extralegroom_bag_info
    let bag_div = document.createElement('div');
    bag_div.innerHTML = `
    <div style='float:left; margin-top: 18px; margin-left: 10px; height: 80px;'>
    <img src="/static/DL5162-Two-Cabin-Bags-Icon-150x150px-Orange.png" width="50px"></img>
    </div>
    <div class='bag_info'>
    <ul>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            1 small under seat cabin bag
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            1 large cabin bag
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            Speedy Boarding
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            Dedicated Bag Drop
        </li>
    </ul></div>
    `;
    bag_div.classList.add('two_bags_info');
    document.getElementById('extra').append(bag_div);

    //upfront bag info
    let bag_div1 = document.createElement('div');
    bag_div1.innerHTML = `
    <div style='float:left; margin-top: 18px; margin-left: 10px; height: 80px;'>
    <img src="/static/DL5162-Two-Cabin-Bags-Icon-150x150px-Orange.png" width="50px"></img>
    </div>
    <div class='bag_info'>
    <ul>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            1 small under seat cabin bag
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            1 large cabin bag
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            Speedy Boarding
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            Dedicated Bag Drop
        </li>
    </ul></div>
    `;
    document.querySelector('.upfront').append(bag_div1);

    //regular bag info
    let bag_div2 = document.createElement('div');
    bag_div2.innerHTML = `
    <div style='float:left; margin-top: 18px; margin-left: 10px; height: 70px;'>
    <img src="/static/Small-cb-no-bg.png" width="50px"></img>
    </div>
    <div class='bag_info'>
    <ul>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            1 small under seat cabin bag
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            Choose where you want to sit, window, middle or aisle
        </li>
    </ul></div>
    `;
    document.querySelector('.regular').append(bag_div2);

    //extra bag info
    let bag_div3 = document.createElement('div');
    bag_div3.innerHTML = `
    <div style='float:left; margin-top: 18px; margin-left: 10px; height: 80px;'>
    <img src="/static/DL5162-Two-Cabin-Bags-Icon-150x150px-Orange.png" width="50px"></img>
    </div>
    <div class='bag_info'>
    <ul>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            1 small under seat cabin bag
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            1 large cabin bag
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            Speedy Boarding
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            Dedicated Bag Drop
        </li>
    </ul></div>
    `;
    document.querySelector('.extra2').append(bag_div3);

    //rear standard bag info
    let bag_div4 = document.createElement('div');
    bag_div4.innerHTML = `
    <div style='float:left; margin-top: 18px; margin-left: 10px; height: 70px;'>
    <img src="/static/Small-cb-no-bg.png" width="50px"></img>
    </div>
    <div class='bag_info'>
    <ul>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            1 small under seat cabin bag
        </li>
        <li>
            <img src="/static/GreenTickIcon.png" width='15px'></img>
            Choose where you want to sit, window, middle or aisle
        </li>
    </ul></div>
    `;
    document.querySelector('.rearstandard').append(bag_div4);
    
    
}//end

function clickOnSeat(seat_div){
    // console.log(seat_div.classList);
    //Stop this seat being selected if it is unavailable
    if(seat_div.classList.contains('unavailable')){
        alert('That seat is taken');
        return;
    }
    //If the current passenger already has a selected seat, clear that
    let passenger = document.querySelector('.currentPassenger span').innerText;
    var basket = document.getElementById('basketTotal').innerText;
    var basketprice = parseFloat(basket);
    var seat0 = seat_div.ariaHidden;
    var seatprice = parseFloat(seat0);
    var total = basketprice + seatprice;
    document.getElementById('basketTotal').innerHTML = total.toFixed(2);

    var prevSeat = document.getElementById(passenger);
    if(prevSeat){
        prevSeat.classList.remove('occupied');
        var prevSeatPrice = parseFloat(prevSeat.ariaHidden);
        var totalp = total - prevSeatPrice;
        document.getElementById('basketTotal').innerHTML = totalp.toFixed(2);
        
    }
    

    //Assign this seat to the current passenger
    seat_div.classList.add('occupied');
    document.querySelector('.currentPassenger span').innerHTML = seat_div.id;

    
}



function pb(){
    var air_fare = document.getElementById('basketTotal').ariaHidden.split(',')[0];
    var gov_tax = document.getElementById('basketTotal').ariaHidden.split(',')[1];
    var total = document.getElementById('basketTotal').innerText;
    let p = document.createElement('div');
    p.innerHTML = `
    <span style="font-size:20px;">Price breakdown</span>
    <img src='/static/ej-drawer-close.png' width='30px' id='close' style="float:right"></img>
    <table>
        <tr>
            <td>Total air fare(s)</td>
            <td>£${air_fare}</td>
        </tr>
        <tr>
            <td>Government taxes</td>
            <td>£${gov_tax}</td>
        </tr>
        <tr>
            <td><b>Basket total</b></td>
            <td><b>£${total}</b></td>
        </tr>
    </table>
    `;
    document.getElementById('price_breakdown').append(p);    
    p.classList.add('price_breakdown'); 
    
   
    var seat0 = document.getElementById('s0').innerText;
    if(seat0){
        let seatprice = parseFloat(seat0);
        let p = document.createElement('div');
        p.innerHTML = `
        <span style="font-size:20px;">Price breakdown</span>
            <img src='/static/ej-drawer-close.png' width='30px' id='close' style="float:right"></img>
            <table>
                <tr>
                    <td>Total air fare(s)</td>
                    <td>£${air_fare}</td>
                </tr>
                <tr>
                    <td>Government taxes</td>
                    <td>£${gov_tax}</td>
                </tr>
                <tr>
                    <td>Seats</td>
                    <td>£${seatprice}</td>
                </tr>
                <tr>
                    <td><b>Basket total</b></td>
                    <td><b>£${total}</b></td>
                </tr>
            </table>
            `;

        document.getElementById('price_breakdown').append(p);    
        p.classList.add('price_breakdown'); 
    }

    var seat1 = document.getElementById('s1').innerText;
    if(seat1){
    var seatprice = parseFloat(seat0)  + parseFloat(seat1);
    var air_fare = document.getElementById('basketTotal').ariaHidden.split(',')[0];
    var gov_tax = document.getElementById('basketTotal').ariaHidden.split(',')[1];
    var total = document.getElementById('basketTotal').innerText;
    let p = document.createElement('div');
    p.innerHTML = `
    <span style="font-size:20px;">Price breakdown</span>
        <img src='/static/ej-drawer-close.png' width='30px' id='close' style="float:right"></img>
        <table>
            <tr>
                <td>Total air fare(s)</td>
                <td>£${air_fare}</td>
            </tr>
            <tr>
                <td>Government taxes</td>
                <td>£${gov_tax}</td>
            </tr>
            <tr>
                <td>Seats</td>
                <td>£${seatprice}</td>
            </tr>
            <tr>
                <td><b>Basket total</b></td>
                <td><b>£${total}</b></td>
            </tr>
        </table>
        `;

    document.getElementById('price_breakdown').append(p);    
    p.classList.add('price_breakdown');
    }

}


