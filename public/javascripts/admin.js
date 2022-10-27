const editGlobalForm = document.getElementById('formsDir');
const logs = document.getElementById('logsDir');
const logHeader = document.getElementById('log-header');

// Home Page Stuff
if (editGlobalForm) {
    linkTo(editGlobalForm, '/admin/edit');
    linkTo(logs, '/admin/logs');
}

// Logs Page
if (logHeader) {
    document.querySelectorAll(".table-content th").forEach(headerCell => {
        headerCell.addEventListener("click", _ => {
            const tableElement = headerCell.parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    });
    sortTableByColumn(document.querySelector("table"), 2, false);
}