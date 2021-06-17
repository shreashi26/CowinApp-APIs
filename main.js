var today = new Date;
var dd = String(today.getDate()).padStart(2,'0');
var mm = String(today.getMonth()+1).padStart(2,'0');
var yyyy=today.getFullYear();
var date = dd+'-'+mm+'-'+yyyy;

var output =' ';
var output1 =' ';
var output_states=' ';
var output_districts=' ';
var output_minage=' ';
var output_type=' ';
var output_freepaid=' ';
var output_availableslots2=' ';
var output_address=' ';

const states_list=document.getElementById("state-select");
const districts_list=document.getElementById("district-select");
var place=document.getElementById("place");
var availableslots=document.getElementById("availableslots");
var freepaid=document.getElementById("free-paid");
var minage=document.getElementById("min-age");
var vaccine=document.getElementById("typeofvaccine");
var pincontainer=document.getElementById("pin-container");
var districtcontainer=document.getElementById("district-container");
var vaccinetable=document.getElementById("table-container");
var address=document.getElementById("address");
var availableslots2=document.getElementById("availableslots2");

//Searchbypin function triggers when Search by Pin is clicked.
const searchbypin=()=>{
        pincontainer.style.display = "block";
        districtcontainer.style.display="none";
        vaccinetable.style.display="none";
        //Search Button for displaying the vaccine level details wrto Pin Code
        searchpin.addEventListener('click',()=>{
        var pin = document.getElementById("pin");
        var pincode=pin.value;
        const xhr = new XMLHttpRequest;
        vaccinetable.style.display = "block";
        const pin_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`;
        xhr.open('GET',pin_url);
        xhr.onreadystatechange=()=>{
            if(xhr.readyState==4 && xhr.status==200){
                var pin_res=JSON.parse(xhr.responseText);
                console.log(pin_res);
                const pin_len=pin_res.sessions.length;
                output =' ';
                output1 =' ';
                output_states=' ';
                output_districts=' ';
                output_minage=' ';
                output_type=' ';
                output_freepaid=' ';
                output_availableslots2=' ';
                output_address=' ';
                for(let i=0; i<pin_len;i++){
                    output+=`<tr><b>${pin_res.sessions[i].name}</b></tr><hr>`
                    output_address+=`<tr>${pin_res.sessions[i].address}</tr><hr>`
                    output1+=`<tr><b>${pin_res.sessions[i].available_capacity_dose1}</b></tr><hr>`
                    output_availableslots2+=`<tr><b>${pin_res.sessions[i].available_capacity_dose2}</b></tr><hr>`
                    output_minage+=`<tr><b>${pin_res.sessions[i].min_age_limit}</b></tr><br><hr>`
                    output_type+=`<tr><b>${pin_res.sessions[i].vaccine}</b></tr><br><hr>`
                    output_freepaid+=`<tr><b>${pin_res.sessions[i].fee_type}</b></tr><br><hr>`
                }
                states_list.innerHTML = output_states;
                districts_list.innerHTML=output_districts;
                place.innerHTML=output;
                address.innerHTML=output_address;
                availableslots.innerHTML=output1;
                availableslots2.innerHTML=output_availableslots2;
                minage.innerHTML=output_minage;
                vaccine.innerHTML=output_type;
                freepaid.innerHTML=output_freepaid;
            }
        }
        xhr.send();
    })
}

//searchbydistrict triggers when Search By District is clicked
const searchbydistrict=()=>{
        districtcontainer.style.display = "block";
        pincontainer.style.display = "none";
        vaccinetable.style.display="none";
const xhr = new XMLHttpRequest;
const states_url = "https://cdn-api.co-vin.in/api/v2/admin/location/states";
xhr.open('GET',states_url);
xhr.onreadystatechange=()=>{
    if(xhr.readyState==4 && xhr.status==200){
        var states_res=JSON.parse(xhr.responseText);
        const states_len=states_res.states.length;
        output_states=' ';
        for(let i=0; i<states_len; i++){
            output_states+= `<option>${states_res.states[i].state_name}</option>`
        }
        states_list.innerHTML = output_states;
        var selected_index, state_id;
        states_list.addEventListener('change',(e) => {

            selected_index=e.target.selectedIndex;
            if(selected_index < 8){
                state_id = (selected_index + 1);
            }
            else if(selected_index ==8){
                state_id = 37;
            }
            else{
                state_id = selected_index;
            }
            const xhr = new XMLHttpRequest;
            const districts_url = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`;
            xhr.open('GET',districts_url);
            xhr.onreadystatechange=()=>{
                if(xhr.readyState==4 && xhr.status==200){
                    var districts_res=JSON.parse(xhr.responseText);
                    output_districts=' ';
                    const districts_len=districts_res.districts.length;
                    for(let i=0; i<districts_len;i++){
                         output_districts+= `<option>${districts_res.districts[i].district_name}</option>`
                    }
                    districts_list.innerHTML=output_districts;
                    var district_id, district_name;
                    var dist_id;
                    const find=document.getElementById("find");
                    districts_list.addEventListener('change',(e) => {
                        district_name=e.target.value;
                        district_id=districts_res.districts.map((dist)=>{
                            if (district_name===dist.district_name){  
                                dist_id= dist.district_id;
                            }
                        })
                //Search button for displaying the vaccine details wrto District Names
                find.addEventListener('click', ()=>{
                vaccinetable.style.display = "block";
                const slots_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${dist_id}&date=${date}`
                xhr.open('GET',slots_url);
                xhr.onreadystatechange=()=>{
                if(xhr.readyState==4 && xhr.status==200){
                    var slots_res=JSON.parse(xhr.responseText);
                    console.log(slots_res);
                    const slots_len=slots_res.sessions.length;
                    output =' ';
                    output1 =' ';
                    output_minage=' ';
                    output_type=' ';
                    output_freepaid=' ';
                    output_availableslots2=' ';
                    output_address=' ';
                    for(let i=0; i<slots_len;i++){
                        output+=`<tr><b>${slots_res.sessions[i].name}</b></tr><hr>`
                        output_address+=`<tr>${slots_res.sessions[i].address}</tr><hr>`
                        output1+=`<tr><b>${slots_res.sessions[i].available_capacity_dose1}</b></tr><hr>`
                        output_availableslots2+=`<tr><b>${slots_res.sessions[i].available_capacity_dose2}</b></tr><hr>`
                        output_minage+=`<tr><b>${slots_res.sessions[i].min_age_limit}</b></tr><hr>`
                        output_type+=`<tr><b>${slots_res.sessions[i].vaccine}</b></tr><hr>`
                        output_freepaid+=`<tr><b>${slots_res.sessions[i].fee_type}</b></tr><hr>`
                    }
                    place.innerHTML=output;
                    address.innerHTML=output_address;
                    availableslots.innerHTML=output1;
                    availableslots2.innerHTML=output_availableslots2;
                    minage.innerHTML=output_minage;
                    vaccine.innerHTML=output_type;
                    freepaid.innerHTML=output_freepaid;
                    }
                }
                xhr.send();
            })
            })
            }
        }
        xhr.send();
        })
    }
}
xhr.send();
}