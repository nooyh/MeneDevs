const addReport = document.getElementById('add-button');
const submitReport = document.getElementById('submitReport');
const headerTable = document.querySelector('tr');
const mainTable = document.getElementById('main-table');

// View Reports Page
if (addReport) {
    // link the add report button to the submit report page
    linkTo(addReport, '/agency/report?create=true');

    // populate html table with all the agency's reports
    for (const report of allReports) {
        let info = '';
        for (const th of headerTable.children) {
            if (!th.id) continue;
            for (const [key, value] of Object.entries(report)) {
                if (th.id == key) info += `<td>${value}</td>`;
            }
        }

        mainTable.innerHTML += `
            <tr>
                <td>
                    <div class="dropdown">
                        <input class="dropbtn no-touch" type="image" value="${report.id}" src="/images/three-dots.png" />
                        <div id="myDropdown1" class="dropdown-content">
                            <a href="">Download as XLSX</a>
                            <a href="">Download as PDF</a>
                        </div>
                    </div>
                </td>
                ${info}
                <td>
                    <button onclick="openReport(${report.id})">Open</button>
                </td>
            </tr>`;
    }

    // initialize the open report func
    function openReport(id) {
        for (const report of allReports) {
            if (report.id == id) {
                return window.open(`/agency/report?${new URLSearchParams({ agency: report.agency, id: report.id })}`, '_self');
            }
        }
    }

    // initialize the three dots thingy
    window.addEventListener('click', (event) => {
        for (const btn of document.getElementsByClassName('dropbtn')) {
            const dropdown = btn.parentElement.children[1];
            dropdown.classList[event.target.value == btn.value ? 'toggle' : 'remove']('show');
        }
    });

    // initialize the sorting thingy
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

// Report Page
if (submitReport) {
    // Change everything based on whether this is a new or old report
    const url = new URL(window.location.href);

    if (!url.searchParams.get('create')) {
        document.getElementById('agencyFormPageHeader').textContent = 'Edit Your Report';
        submitReport.textContent = 'Save Changes';

        for (const [key, value] of Object.entries(report)) {
            const element = document.getElementById(key);
            if (element) element.value = value;
        }
    }

    // Mask phone and budget fields
    document.getElementById('contact').addEventListener('input', (event) => {
        const x = event.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        event.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? `-${x[3]}` : ''}`;
    });

    const reverse = (str) => str.split('').reverse().join('');
    const budget = document.getElementById('budget');
    budget.addEventListener('input', _ => {
        let { value } = budget;
        value = value.replace(/[,$\D]/g, '');
        value = reverse(value);
        value = value.replace(/.../g, (e) => `${e},`);
        value = reverse(value);
        value = value.replace(/^,/g, '');
        budget.value = value ? `$${value}` : '';
    });

    // https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    const inputKeys = {
        agency: true,
        stationArea: true,
        projectName: true,
        totalArea: true,
        location: true,
        tmk: false,
        phase: true,
        status: false,
        contact: true,
        email: true,
        budget: false,
    };

    submitReport.addEventListener('click', async _ => {
        // reset inputs
        for (const [key, required] of Object.entries(inputKeys)) {
            const input = key == 'phase' ? document.querySelector('input[name="phase"]:checked') : document.getElementById(key);

            // check if the inputs are valid
            if (required) {
                if (key == 'email' && !emailRegex.test(input.value)) {
                    return alert('Please provide a valid email address.');
                } else if (key == 'contact' && input.value.length != 13) {
                    return alert(`Please provide a valid phone number.`);
                } else if (input?.value == '') {
                    return alert(`Please fill out the ${key} field.`);
                }
            }

            // save the inputs
            report[key] = input?.value && input.value.length > 0 ? input.value : null;
        }

        // submit the inputs
        try {
            const response = await (await fetch(window.location.href, {
                method: 'POST',
                headers: {
                    ['Content-Type']: 'application/json',
                },
                body: JSON.stringify({ create: url.searchParams.get('create'), report: report }),
            })).json();

            if (response == 'success') window.open('/agency', '_self');
            else alert('Something went wrong!');
        } catch (e) {
            alert('Something went wrong!');
        }
    });
}