/**
 * Sorts a HTML table from https://youtu.be/8SL_hM1a0yo
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {Number} column The index of the column to sort
 * @param {Boolean} asc Whether or not to sort by ascending or descending
 * 
*/
function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove existing rows from table so that newly sorted rows can be added
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // add in the new rows
    tBody.append(...sortedRows);

    // remember how column was sorted so when user toggles ascending or descending, it knows which one to go to. 
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}