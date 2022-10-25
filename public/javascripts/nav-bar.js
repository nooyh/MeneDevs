const linkTo = (element, path) => {
    element.addEventListener('click', _ => window.open(path, '_self'));
};

const navBarDiv = document.getElementById('bar');
const makeNavBarBtn = (name, link) => {
    const div = document.createElement('div');
    const button = document.createElement('h3');

    div.className = 'content';
    button.textContent = name;
    div.appendChild(button);
    navBarDiv.appendChild(div);
    linkTo(div, link);
};

// populate navbar for admin and agency accounts
if (accountType == 'admin') {
    makeNavBarBtn('Logs', '/admin/logs');
    makeNavBarBtn('Edit Global Form', '/admin/edit');
} else if (accountType == 'agency') {
    makeNavBarBtn('Home', '/agency');
} else {
    makeNavBarBtn('Home', '/');
}

// add profile btn
const account = document.createElement('div');
const accountImg = document.createElement('img');
account.id = 'account';
accountImg.id = 'accountLogo';
accountImg.src = '/images/account-logo.jpg';
accountImg.style.height = '40px';
accountImg.style.paddingTop = '20px';
account.appendChild(accountImg);
navBarDiv.appendChild(account);
if (accountType == 'guest') linkTo(account, '/login');
else linkTo(account, '/profile');