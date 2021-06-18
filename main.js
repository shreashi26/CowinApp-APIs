var today = new Date;
var dd = String(today.getDate()).padStart(2,'0');
var mm = String(today.getMonth()+1).padStart(2,'0');
var yyyy=today.getFullYear();
var date = dd+'-'+mm+'-'+yyyy;

const states_list=document.getElementById("state-select");
const districts_list=document.getElementById("district-select");
const pincontainer=document.getElementById("pin-container");
const districtcontainer=document.getElementById("district-container");
var tbl=document.getElementById("table-container");

const generateTable=(response, length)=>{
    var tableRows = tbl.getElementsByTagName('tr');
    var rowCount = tableRows.length;
    
    for (var x=rowCount-1; x>0; x--) {
        tbl.removeChild(tableRows[x]);
    }

    for (var i = 0; i < length; i++) {
      var row = document.createElement("tr");
      row.style.fontWeight="bold";
      output = response.sessions[i].name;
      output_address = response.sessions[i].address;
      output_minage = response.sessions[i].min_age_limit;
      output_type = response.sessions[i].vaccine;
      output_freepaid = response.sessions[i].fee_type;
      output_availabledose1 = response.sessions[i].available_capacity_dose1;
      output_availabledose2 = response.sessions[i].available_capacity_dose2;
  
      var arr = [output, output_address, output_minage, output_type, output_freepaid, output_availabledose1, output_availabledose2];

      for (var j = 0; j < 7; j++) {
        var cell = document.createElement("td");
        cell.style.textAlign="center";
        var cellText = document.createTextNode(arr[j]);
        cell.appendChild(cellText);
        row.appendChild(cell);
      }
      tbl.appendChild(row);
    }
}

//Searchbypin function triggers when Search by Pin is clicked.
const searchbypin=()=>{
        pincontainer.style.display = "block";
        districtcontainer.style.display="none";
        tbl.style.display="none";
        //Search Button for displaying the vaccine level details wrto Pin Code
        searchpin.addEventListener('click',()=>{
        var pin = document.getElementById("pin");
        var pincode=pin.value;
        const xhr = new XMLHttpRequest;
        tbl.style.display = "block";
        const pin_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`;
        xhr.open('GET',pin_url);
        xhr.onreadystatechange=()=>{
            if(xhr.readyState==4 && xhr.status==200){
                var pin_res=JSON.parse(xhr.responseText);
                //console.log(pin_res);
                const pin_len=pin_res.sessions.length;
                generateTable(pin_res, pin_len);
            }
        }
        xhr.send();
    })
}

//searchbydistrict triggers when Search By District is clicked
const searchbydistrict=()=>{
        districtcontainer.style.display = "block";
        pincontainer.style.display = "none";
        tbl.style.display="none";
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
                //console.log(dist_id);
                //Search button for displaying the vaccine details wrto District Names
                find.addEventListener('click', ()=>{
                tbl.style.display = "block";
                const slots_url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${dist_id}&date=${date}`
                xhr.open('GET',slots_url);
                xhr.onreadystatechange=()=>{
                if(xhr.readyState==4 && xhr.status==200){
                    var slots_res=JSON.parse(xhr.responseText);
                    //console.log(slots_res);
                    const slots_len=slots_res.sessions.length;
                    generateTable(slots_res, slots_len);
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