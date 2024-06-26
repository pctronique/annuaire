let numberList = 0;
let listData = [];
let id = -1;

function addRow(data) {
    return '<tr id="annuaire_'+data.id+'">'+
    '<td class="name">'+data.name+'</td>'+
    '<td class="firstname">'+data.firstname+'</td>'+
    '<td class="phone">'+data.phone+'</td>'+
    '<td class="phone_mobile">'+data.phone_mobile+'</td>'+
    '<th scope="col"><img src="./img/icons8-modifier.svg" class="modif" alt="modifier" /></th>'+
    '<th scope="col"><img src="./img/poubelle.svg" class="delete" alt="supprimer" /></th>'+
    '</tr>';
}

function addRowData(number, name, firstname, adresse, codePostal, city, phone, phone_mobile, email) {

    return {
        "id" : number,
        "name" : name,
        "firstname" : firstname,
        "adresse" : adresse,
        "codePostal" : codePostal,
        "city" : city,
        "phone" : phone,
        "phone_mobile" : phone_mobile,
        "email" : email
    };
}

function addEventAll() {
    document.querySelectorAll(".modif").forEach(element => {
        element.addEventListener("click", function(e) {
            id = parseInt(document.getElementById(this.parentNode.parentNode.id).id.split("_")[1]);
            let myIndex = rechercheKey(id);
            if (myIndex !== -1) {
                let data = listData[myIndex];
                document.getElementById("name").value = data.name;
                document.getElementById("firstname").value = data.firstname;
                document.getElementById("adresse").value = data.adresse;
                document.getElementById("codePostal").value = data.codePostal;
                document.getElementById("city").value = data.city;
                document.getElementById("phone").value = data.phone;
                document.getElementById("phone_mobile").value = data.phone_mobile;
                document.getElementById("email").value = data.email;
            }
        })
    });
    document.querySelectorAll(".delete").forEach(element => {
        element.addEventListener("click", function(e) {
            let id = parseInt(document.getElementById(this.parentNode.parentNode.id).id.split("_")[1]);
            let name = "";
            let firstname = "";
            let myIndex = rechercheKey(id);
            if (myIndex !== -1) {
                let data = listData[myIndex];
                name = data.name;
                firstname = data.firstname;
            }
            if(confirm("Attention vous allez supprimer '"+name+" "+firstname+"'. 'Ok' pour continuer.")) {
                let myIndex = rechercheKey(id);
                if (myIndex !== -1) {
                    listData.splice(myIndex, 1);
                    addValueTab();
                }
            }
        })
    });
}

function annulerDef() {
    row_select = undefined;

    document.getElementById("name").value = "";
    document.getElementById("firstname").value = "";
    document.getElementById("adresse").value = "";
    document.getElementById("codePostal").value = "";
    document.getElementById("city").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("phone_mobile").value = "";
    document.getElementById("email").value = "";
}

function rechercheKey(id) {
    for (let index = 0; index < listData.length; index++) {
        if(listData[index].id == id) {
            return index
        }
    }
    return -1;
}

function findTab() {
    let find = document.getElementById("recherche").value;
    let list_annuaire = document.getElementById("list_annuaire");
    list_annuaire.innerHTML = "";
    if(find == "") {
        listData.forEach(element => {
            list_annuaire.innerHTML += addRow(element);
        });
    } else {
        let tableFind = listFind(find);
        tableFind.forEach(element => {
            list_annuaire.innerHTML += addRow(element);
        });
    }

    addEventAll();
}

function addValueTab() {
    findTab();

    saveLocal();
}

document.getElementById("valider").addEventListener("click", function(e) {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let firstname = document.getElementById("firstname").value;
    let adresse = document.getElementById("adresse").value;
    let codePostal = document.getElementById("codePostal").value;
    let city = document.getElementById("city").value;
    let phone = document.getElementById("phone").value;
    let phone_mobile = document.getElementById("phone_mobile").value;
    let email = document.getElementById("email").value;

    if(name.trim() != "" && firstname.trim() != "" && adresse.trim() != "" && 
        phone.trim() != "" && phone_mobile.trim() != "" && email.trim() != "") {

        if(id < 0) {
            listData.push(addRowData(numberList, name, firstname, adresse, codePostal, city, phone, phone_mobile, email));
            numberList++;
        } else {
            listData[rechercheKey(id)] = addRowData(id, name, firstname, adresse, codePostal, city, phone, phone_mobile, email);
        }

        id = -1;

        addValueTab();

        annulerDef();

    } else {
        alert("Merci d'entrer des valeurs valides.");
    }
})

function saveLocal() {
    let values = {
        "number" : numberList,
        "listData" : listData,

    }
    localStorage.setItem('annuaire', JSON.stringify(values));
}

function loadLocal() {
    var annuaire = localStorage.getItem('annuaire');
    if(annuaire !== undefined && annuaire != "") {
        let values = JSON.parse(annuaire);
        if(values != undefined && values != "") {
            numberList = values.number;
            listData = values.listData;
            addValueTab();
        }
    }
}

/*
sauvegarde de la page cree dans le back office
*/
function saveFile() {
    let name_file = "new_file_" + Date.now() + ".json";
    let values = {
        "number" : numberList,
        "listData" : listData,
    }
    var blob = new Blob([JSON.stringify(values)], { type: "text" });
    const blobUrl = URL.createObjectURL(blob);
    
    var fileLink = document.createElement("a");
    fileLink.href = blobUrl;
    
    fileLink.download = name_file;
    
    fileLink.click();
}

function loadFile(event) {
    let files = event.target.files;
    return files;
}

document.getElementById('import').onclick = function() {
	var files = document.getElementById('fileToUpload').files;
    if (files.length <= 0) {
        return false;
    }
  
    var fr = new FileReader();
  
    fr.onload = function(e) {
    var result = JSON.parse(e.target.result);
    numberList = result.number;
    listData = result.listData;
    addValueTab();
  }
  
  fr.readAsText(files.item(0));
};


function listFind(find) {
    let values = [];
    listData.forEach(element => {
        if(element.name.toLowerCase().includes(find.toLowerCase()) || 
            element.firstname.toLowerCase().includes(find.toLowerCase()) || 
            element.adresse.toLowerCase().includes(find.toLowerCase()) || 
            element.codePostal.toLowerCase().includes(find.toLowerCase()) || 
            element.city.toLowerCase().includes(find.toLowerCase()) || 
            element.phone.toLowerCase().includes(find.toLowerCase()) || 
            element.phone_mobile.toLowerCase().includes(find.toLowerCase()) || 
            element.email.toLowerCase().includes(find.toLowerCase())) {
                values.push(element);
        }
    });
    return values;
}



document.getElementById("annuler").addEventListener("click", function(e) {
    e.preventDefault();
    annulerDef();
})

document.getElementById("save").addEventListener("click", saveFile);

document.getElementById("bt_find").addEventListener("click", function(e) {
    findTab();
})

loadLocal();