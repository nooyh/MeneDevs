let formsDir = document.getElementById("formsDir");
let logsDir = document.getElementById("logsDir");
formsDir.addEventListener('click', event => {
    console.log("forms has been clicked!");
    window.open('global_form.html');
});
logsDir.addEventListener('click', event => {
    console.log("logs has been clicked!");
    window.open('logs.html');
});
