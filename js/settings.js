// Saves options to chrome.storage
let websites = [];
function save_settings() {
    event.preventDefault(); //need this to prevent site from reloading and erasing all data
    var input = document.getElementById('webID').value;
    document.getElementById('webList').innerHTML += '<li>' + input + '</li>';
    websites.push(input);
    // chrome.storage.sync.set(
    //     { savedWebsites: websites },
    //     function () { //update status to let user know options were saved
    //         var status = document.getElementById('status');
    //         status.textContent = 'Options saved';
    //         setTimeout(function () { status.textContent = ''; }, 750);
    //     }
    // );
    return websites;
}

function retrieve_settings(){
    event.preventDefault();
    console.log(websites.length)
    websites.forEach(function (item, index, array) {
        console.log(item)
    })
}