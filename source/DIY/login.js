const LOGGED_TIME_KEY = 'loggedTime';

function getLoggedTime() {
    return parseInt(sessionStorage.getItem(LOGGED_TIME_KEY) || 0);
}
function allowLogin() {
    return getLoggedTime() < 3;
}
function updateLoggedTime() {
    const loggedTime = getLoggedTime();
    sessionStorage.setItem(LOGGED_TIME_KEY, loggedTime + 1);
}

function updateFormInputStatus(disabled) {
    const $form = document.getElementById('login');
    const $input = $form.querySelector('input[type=text]');
    if ($input.disabled === disabled) {
        return;
    }
    $input.disabled = disabled;
    $form.querySelector('input[type=password]').disabled = disabled;
    $form.querySelector('button').disabled = disabled;
}

function updateFromErr(hasErr) {
    if (hasErr) {
        document.getElementById('login').className = 'error-form';
    } else {
        document.getElementById('login').className = '';
    }
}

function testLogged() {
    if (!allowLogin()) {
        updateFormInputStatus(true);
        return false;
    }
    updateFormInputStatus(false);
    return true;
}

document.getElementById('signIn').onclick = function (e) {
    e.preventDefault();
    updateFromErr(false);
    if (!testLogged()) {
        return;
    }
    requestAnimationFrame(() => {
        const formData = new FormData(document.getElementById('login'));
        const username = formData.get('username');
        const password = formData.get('password');
        const token = '07bb53649d1a6a6ea66fa37d2e3584f5c30731b69e23f6e9ce2b9ca31b0935502f85a4410b5d256f37a61ab9d2c1b08ef71d217ede3929644f80e6e2329b99da';
        updateLoggedTime();
        testLogged();
        if (CryptoJS.SHA512(`${username} - ${password}`).toString() !== token) {
            updateFromErr(true);
            return;
        }
        updateFormInputStatus(true);
        document.getElementById('signIn').querySelector('svg').style.display = 'inline';
        setTimeout(() => {
            sessionStorage.setItem('token', token);
            window.location.href = '/blog';
        }, (Math.floor(Math.random() * (7 - 1)) + 1) * 1000);
    });
}

if (!testLogged()) {
    updateFromErr(true);
}