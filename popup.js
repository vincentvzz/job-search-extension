let current_url = "";

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    current_url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!
});

document.getElementById("add-job").addEventListener("click", async () => {
    let current_company = document.getElementById("company-name-input").value;
    console.log(current_company);
    let result = await chrome.storage.local.get({"company_list": {}});

    console.log(result);
    result["company_list"][current_company] = current_url;
    await chrome.storage.local.set({"company_list": result["company_list"]});
})

