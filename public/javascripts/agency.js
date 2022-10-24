const reports = document.getElementById('reportsDir');
const addReport = document.getElementById('addReport');
const submitReport = document.getElementById('submitReport');

// Home Page
if (reports) {
    linkTo(reports, '/agency/reports');
}

// Reports Page
if (addReport) {
    linkTo(addReport, '/agency/reports/new');

    console.log(messages);
}

// Create Report Page
if (submitReport) {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    let inputs = {};
    const inputIds = {
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
    };

    submitReport.addEventListener('click', async _ => {
        // reset inputs
        inputs = {};

        for (const [id, required] of Object.entries(inputIds)) {
            const input = id == 'phase' ? document.querySelector('input[name="phase"]:checked') : document.getElementById(id);

            // check if the inputs are valid
            if (required) {
                if (id == 'email' && !emailRegex.test(input.value)) {
                    return alert('Please provide a valid email address.');
                } else if (id == 'contact' && !phoneRegex.test(input.value)) {
                    return alert(`Please provide a valid phone number.`);
                } else if (input?.value == '') {
                    return alert(`Please fill out the ${id} field.`);
                }
            }

            // save the inputs
            inputs[id] = input?.value && input.value.length > 1 ? input.value : null;
        }

        // submit the inputs
        const response = await (await fetch(window.location.href, {
            method: 'POST',
            headers: {
                ['Content-Type']: 'application/json',
            },
            body: JSON.stringify(inputs),
        })).json();

        if (response == 'success') {
            window.open('/agency/reports', '_self');
        } else {
            alert('Something went wrong!');
        }
    });
}