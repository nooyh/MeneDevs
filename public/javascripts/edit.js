const edit = document.getElementById('edit-question');
const save = document.getElementById('save-button');
const add = document.getElementById('new-question');
const form = document.getElementsByClassName('originalFormQs')[0];

edit.addEventListener('click', _ => {
    form.contentEditable = !form.contentEditable;
});