// Home Page Stuff
const editGlobalForm = document.getElementById('formsDir');
const logs = document.getElementById('logsDir');

if (editGlobalForm) {
    linkTo(editGlobalForm, '/admin/edit');
    linkTo(logs, '/admin/logs');
}