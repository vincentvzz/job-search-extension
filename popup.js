let current_url = "";
let currentUserId = "";

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    current_url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!
});

document.getElementById("add-job").addEventListener("click", async () => {
    let current_company = document.getElementById("company-name-input").value;
    let usernameInput = document.getElementById("username").value;
    let result = await chrome.storage.local.get({"company_list": {}});
    result["company_list"][current_company] = current_url;
    await chrome.storage.local.set({"company_list": result["company_list"], "username": usernameInput});
})

// https://www.geeksforgeeks.org/how-to-create-and-download-csv-file-in-javascript/
document.getElementById("download-btn").addEventListener("click", async () => {
    const result = await chrome.storage.local.get({"company_list": {}});
    let csv_temp_data = ["Company Name,Job URL"];
    Object.keys(result["company_list"]).forEach((curKey) => {
        csv_temp_data.push(curKey + "," + result["company_list"][curKey]);
    });
    const csv_data = csv_temp_data.join("\n");

    const blob = new Blob([csv_data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'job_list.csv');
    a.click();
})