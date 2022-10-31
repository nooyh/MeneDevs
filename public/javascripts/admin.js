const mainTable = document.getElementById('main-table');
const reportPage = document.getElementById('agencyFormQuestions');
const questionsDiv = document.getElementById('questions');

// View All Reports Page
if (mainTable) {
    // load the table
    initTable(allReports);

    // initialize the sorting thingy
    document.querySelectorAll(".table-content th").forEach(headerCell => {
        headerCell.addEventListener("click", _ => {
            const tableElement = headerCell.parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
            const currentIsAscending = headerCell.classList.contains("th-sort-asc");
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    });
    sortTableByColumn(document.querySelector("table"), 1, false);
}

// View Specific Report Page
if (reportPage) {
    // populate report form with the saved global questions
    for (const [question, type] of Object.entries(questions)) {
        const types = ['text', 'number', 'text', 'text', 'text'];
        agencyFormQuestions.innerHTML += `
            <p>${question}</p>
            <input id="${question}" class="${type} type="${types[parseInt(type)]}" placeholder="Enter here"" oninput=handleAnswerInputs(this) readonly></input>
        `;
    }
    agencyFormQuestions.innerHTML += `<br><br><br>`;

    // shove in the saved report info
    for (const [key, value] of Object.entries(report)) {
        const element = document.getElementById(key);
        if (element) element.value = value;
    }
}

// Edit Global Form Page
if (questionsDiv) {
    // setup fixing all the numbers for da questions
    const updateNumbers = () => {
        for (let i = 1; i <= questionsDiv.children.length; i++) {
            const input = questionsDiv.children[i - 1].children[1];
            const question = input.value.replace(/\d+\.\s/, '');
            input.value = question ? `${i}. ${question}` : '';
        }
    };
    window.addEventListener('input', updateNumbers);

    // setup the size animations
    const sizeSytles = ['backgroundSize', 'width', 'height'];
    const setSize = (eventElement, changeElement, event, size) => {
        eventElement.addEventListener(event, _ => sizeSytles.forEach(styleName => changeElement.style[styleName] = size));
    };

    // this just adds a new question and sets up all the event listeners
    const addQuestion = (question, type) => {
        const div = document.createElement('div');

        div.classList = 'row';
        div.innerHTML = `
            <label>
                <select>
                    <option value="" selected disabled>Question type</option>
                    <option value="0">Plain Text</option>
                    <option value="1">Number</option>
                    <option value="2">Phone Number</option>
                    <option value="3">Email</option>
                    <option value="4">Currency</option>
                </select>
            </label>
            <input type="text" value="${question || ''}" placeholder="Enter question">
            <div class="X"></div>
        `;

        const qType = div.children[0];
        qType.children[0].value = type || '';
        const input = div.children[1];
        const x = div.children[2];

        setSize(input, x, 'focusin', '25px');
        setSize(input, x, 'focusout', '0');
        setSize(input, qType.firstChild, 'focusin', '25px');
        setSize(x, x, 'mouseenter', '30px');
        setSize(x, x, 'mouseleave', '25px');

        x.addEventListener('mousedown', _ => {
            x.remove();
            div.setAttribute('class', 'slide-out');
            setTimeout(_ => {
                div.remove();
                updateNumbers();
            }, 400);
        });

        questionsDiv.appendChild(div);
        updateNumbers();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
    };
    for (const [question, type] of Object.entries(questions)) {
        addQuestion(question, type);
    }

    // connect add btn to add question func
    document.getElementById('add').addEventListener('click', _ => addQuestion());

    // setup the confirmation screen for saving questions
    document.getElementById('save').addEventListener('click', async _ => {
        const response = confirm('Are you sure you want to save these questions?');

        if (response) {
            const savedQuestions = {};
            for (const questionHtml of questionsDiv.children) {
                const selectElement = questionHtml.children[0].children[0];
                const inputElement = questionHtml.children[1];
                savedQuestions[inputElement.value.replace(/\d+\.\s/, '')] = selectElement.value;
            }

            try {
                const response = await (await fetch(window.location.href, {
                    method: 'POST',
                    headers: {
                        ['Content-Type']: 'application/json',
                    },
                    body: JSON.stringify(savedQuestions),
                })).json();

                if (response == 'success') alert('Saved successfully!');
                else alert('Something went wrong!');
            } catch (e) {
                console.error(e);
                alert('Something went wrong!');
            }
        }
    });
}