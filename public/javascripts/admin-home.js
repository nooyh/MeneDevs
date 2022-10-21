const formsDir = document.getElementById("formsDir");
const logsDir = document.getElementById("logsDir");

formsDir.addEventListener('click', _ => {
    console.log("forms has been clicked!");
    window.open('global_form.html');
});

logsDir.addEventListener('click', _ => {
    console.log("logs has been clicked!");
    window.open('logs.html');
});