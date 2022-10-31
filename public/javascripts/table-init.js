let openReport, downloadXLSX;
/**
 * This just initializes the table
 * 
 * @param {Array} arr This is the list of objects with the table data inside each object
 */
function initTable(arr) {
    // put all the info into the table
    populateTable(arr);

    // setup the button callback for opening each report
    openReport = (id) => {
        const obj = findObj(arr, id);
        const params = new URLSearchParams({ id: obj.id });
        return window.open(`/${accountType}/report?${params}`, '_self');
    };

    // setup the three dots thingy
    const dropBtn = document.getElementsByClassName('dropbtn');
    window.addEventListener('click', (event) => {
        for (const btn of dropBtn) {
            const dropdown = btn.parentElement.children[1];
            dropdown.classList[event.target.value == btn.value ? 'toggle' : 'remove']('show');
        }
    });

    const objToAOA = (obj) => {
        const aoa = [[], []];
        for (const key of Object.keys(obj)) aoa[0].push(key);
        for (const value of Object.values(obj)) aoa[1].push(value);
        return aoa;
    };

    const xlsxHtml = document.getElementById('xlsx');
    downloadXLSX = (id) => {
        const table = objToAOA(findObj(arr, id));
        const worksheet = XLSX.utils.aoa_to_sheet(table);
        xlsxHtml.innerHTML = XLSX.utils.sheet_to_html(worksheet, { id: 'data-table', editable: false });
        const data = document.getElementById('data-table');
        const workbook = XLSX.utils.table_to_book(data, { sheet: 'Report' });
        XLSX.writeFile(workbook, 'Report.xlsx');
    };
}

/**
 * Looks for an object in the given array with the same specified id
 * 
 * @param {Array} arr The array to look through
 * @param {String} id The actual id to match
 * @returns {?Object} The found object or null
 */
function findObj(arr, id) {
    for (const obj of arr) {
        if (obj.id == id) return obj;
    }
}

/**
 * Populates the HTML lists with custom values
 * 
 * @param {Array} arr This is the list of objects with table data inside object
 */
function populateTable(arr) {
    const headerTable = document.getElementById('header-list');
    const mainTable = document.getElementById('main-table');
    if (!headerTable || !mainTable) throw new Error("Couldn't find the main table");

    for (const question of Object.keys(questions)) {
        headerTable.innerHTML += `<th>${question == 'id' ? 'Date Created' : question}</th>`;
    }

    for (const obj of arr) {
        let info = '';

        for (const [question, answer] of Object.entries(obj)) {
            if (question == 'id') {
                info += `<td>${(new Date(parseInt(answer))).toLocaleDateString()}</td>`;
            } else {
                info += `<td>${answer}</td>`;
            }
        }
        headerTable.innerHTML += `<th></th>`;

        mainTable.innerHTML += `
            <tr>
                <td>
                    <div class="dropdown">
                        <input class="dropbtn no-touch" type="image" value="${obj.id}" src="/images/three-dots.png" />
                        <div id="myDropdown1" class="dropdown-content">
                            <button onclick="downloadXLSX(${obj.id})">Download as XLSX</button>
                        </div>
                    </div>
                </td>
                ${info}
                <td>
                    <button onclick="openReport(${obj.id})">Open</button>
                </td>
            </tr>
        `;
    }
}

/**
 * Sorts an HTML table (https://youtu.be/8SL_hM1a0yo)
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