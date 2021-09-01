/*Open a nomisweb.co.uk page, and run this code in the console, exchanging the geography in the url as required*/

(function(console){

    console.save = function(data, filename){

        if(!data) {
            console.error('Console.save: No data')
            return;
        }

        if(!filename) filename = 'console.json'

        if(typeof data ==="object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
})(console)

let datasets=[
    {id:"NM_509_1", description:"Population"},
    {id:"NM_516_1", description:"QS116EW - Household type"},
    {id:"NM_517_1", description:"QS117EW - People aged 18 to 64 living in a one adult household"},
    {id:"NM_520_1", description:"Ethnic Group"},
    {id:"NM_521_1", description:"QS121EW - Armed Forces"},
    {id:"NM_522_1", description:"QS201EW - Ethnic group"},
    {id:"NM_523_1", description:"QS202EW - Multiple ethnic groups"},
    {id:"NM_526_1", description:"QS205EW - Proficiency in English"},
    {id:"NM_527_1", description:"QS206WA - Welsh language skills"},
    {id:"NM_528_1", description:"QS207WA - Welsh language skills (detailed)"},
    {id:"NM_529_1", description:"QS208EW - Religion"},
    {id:"NM_530_1", description:"QS301EW - Provision of unpaid care"},
    {id:"NM_531_1", description:"QS302EW - General health"},
    {id:"NM_532_1", description:"QS303EW - Long-term health problem or disability"},
    {id:"NM_533_1", description:"QS401EW - Accommodation type - People"},
    {id:"NM_534_1", description:"QS402EW - Accommodation type - Households"},
    {id:"NM_535_1", description:"QS403EW - Tenure - People"},
    {id:"NM_536_1", description:"QS404EW - Tenure - Household Reference Person aged 65 and over"},
    {id:"NM_537_1", description:"QS405EW - Tenure - Households"},
    {id:"NM_540_1", description:"QS408EW - Occupancy rating (rooms)"},
    {id:"NM_541_1", description:"QS409EW - Persons per room - Households"},
    {id:"NM_542_1", description:"QS410EW - Persons per room - People"},
    {id:"NM_544_1", description:"QS412EW - Occupancy rating (bedrooms)"},
    {id:"NM_550_1", description:"QS418EW - Dwellings"},
    {id:"NM_551_1", description:"QS419EW - Position in communal establishment"},
    {id:"NM_560_1", description:"QS605EW - Industry"},
    {id:"NM_561_1", description:"QS606EW - Occupation (Minor Groups)"},
    {id:"NM_569_1", description:"QS801EW - Year of arrival in the UK"},
    {id:"NM_571_1", description:"QS803EW - length of residence in the UK"},
    {id:"NM_573_1", description:"QS210EW - Religion (detailed)"},
    {id:"NM_574_1", description:"CT0010 - Ethnic group (write-in responses)"},
    {id:"NM_575_1", description:"QS211EW - Ethnic group (detailed)"},
    {id:"NM_576_1", description:"QS703EW - Method of Travel to Work (2001 specification)"},
    {id:"NM_577_1", description:"QS212EW - Passports held"},
    {id:"NM_578_1", description:"QS213EW - Country of birth (expanded)"},
    {id:"NM_579_1", description:"QS214EW - National Identity (detailed)"},
    {id:"NM_580_1", description:"QS613EW - Approximated social grade"},
    {id:"NM_582_1", description:"Marital Status"},
    {id:"NM_583_1", description:"Country of Birth"},
    {id:"NM_584_1", description:"Economic Position - all persons"},
    {id:"NM_585_1", description:"Economic Position - males"},
    {id:"NM_586_1", description:"Economic Position - Females"},
    {id:"NM_587_1", description:"Hours Worked"},
    {id:"NM_588_1", description:"Industry"},
    {id:"NM_589_1", description:"Occupation"},
    {id:"NM_614_1", description:"KS207WA - Welsh language skills"},
    {id:"NM_615_1", description:"KS208WA - Welsh language profile"}];
for(let i=0; i<datasets.length; i++){

let result;
let arr=[];
let reshaped_families=[];
let dataset=datasets[i].id;
let name=datasets[i].description;

function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}

fetch("https://www.nomisweb.co.uk/api/v01/dataset/"+dataset+".jsonstat.json?geography=1946157083&rural_urban=0&measures=20100,20301&_=757219").then(res=>res.json()).then(json=>result=json).then(result => {

let cat_name=result.id[3];
let obj=result.dimension[cat_name].category; 
let families=obj.child;


for (let i = 0; i < Object.keys(families).length; i++)
	for (let ii = 0; ii < families[Object.keys(families)[i]].length; ii++) {
	   let key= families[Object.keys(families)[i]][ii];
	   let val= Object.keys(families)[i];
	   let object={};
	   object[key]=val;
	   reshaped_families.push(object);
}

let indices=swap(obj.index);

for (let i=0; i<Object.values(obj.index).length; i++){
arr.push({
"dataset_id":dataset,
"dataset_description":name,
"id":indices[i],
"key":obj.label[indices[i]],
"value_abs":result.value[i*2],
"value_pc":result.value[(i*2)+1],
"group_name":Object.values(result.dimension.geography.category.label)[0],
"group_code":Object.values(result.dimension.geography.category.label)[1],
"parent":""
})
}

for(let i=0; i<reshaped_families.length; i++)arr.find(e=>e.id==[Object.keys(reshaped_families[i])]).parent=reshaped_families[i][Object.keys(reshaped_families[i])];

console.save(arr,name +".js");
})
}
