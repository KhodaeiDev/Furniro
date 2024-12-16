import { getingUaerInformation, checkingLoginStatus, errorMessagesLogout, } from "./auth/utils.js"
import { getToken, getCookieValue, setSecureCookie, storeAccessTokenWithExpiry, getFromLocalStorage, deleteCookie, handleError } from "./func/utils.js"

const $ = document
const hamburger = $.querySelector(".hamburger")
const contenerMenuMobail = $.querySelector(".contener-menu-mobail")
const menuLink = $.querySelectorAll(".list-menu-item__link")

hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active")
    contenerMenuMobail.classList.toggle("contener-menu-mobail--active")
})

menuLink.forEach(function (menuLink) {
    menuLink.addEventListener("click", function () {
        $.querySelector(".list-menu-item__link--active").classList.remove("list-menu-item__link--active")
        menuLink.classList.add("list-menu-item__link--active")
    })
})
const dontLogin = $.querySelector(".dont-login")
const loginSuccessfully = $.querySelector(".login-successfully")
const navbarSuccessfullyRegisterText = $.querySelector(".navbar-successfully-Register-text")
const navbarSuccessfullyRegisterLoading = $.querySelector(".navbar-successfully-Register-Loading")
const navbarDontRegisterText = $.querySelector(".navbar-dont-Register-text")

const fetchLogoutUser = async () => {
    const token = getToken()
    const refreshToken = getCookieValue("Refresh-Token")
    if (!token && !refreshToken) {
        return false
    }

    const tokenRefreshData = { "refreshToken": refreshToken };

    const response = await fetch("https://furniro-6x7f.onrender.com/auth/log-out", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${4565}`
        },
        body: JSON.stringify(tokenRefreshData)
    })
    const userData = await response.json()
    return userData
}

const handleUserAuthentication = async () => {
    const isLogin = checkingLoginStatus();
    navbarSuccessfullyRegisterLoading.style.display = "flex";

    if (isLogin) {
        const userData = await getingUaerInformation();

        const fullName = userData.data.user.fullname;
        loginSuccessfully.style.display = "flex";
        dontLogin.style.display = "none";
        navbarSuccessfullyRegisterText.innerHTML = fullName;
        setTimeout(executeTokenCheck, 14 * 60 * 1000);
    } else {
        navbarDontRegisterText.innerHTML = `Sign In/Sign Up`;
        dontLogin.style.display = "flex";
        loginSuccessfully.style.display = "none";
    }

    navbarSuccessfullyRegisterLoading.style.display = "none";
}

loginSuccessfully.addEventListener("click", async () => {

    Swal.fire({
        title: "Exit Account?",
        text: "Click here to securely log out of your account.",
        icon: "warning",
        customClass: { popup: 'custom-swal2' },
        showCancelButton: true,
        confirmButtonColor: "#B88E2F",
        cancelButtonColor: "red",
        confirmButtonText: "Log Out"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const userData = await fetchLogoutUser();

            if (userData.success) {
                localStorage.removeItem('Access-Token');
                localStorage.removeItem('Access-Token-Expiry');
                document.cookie = 'Refresh-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                handleUserAuthentication()
                Swal.fire({
                    title: "Logged Out Successfully",
                    text: "You have been logged out. Thank you for visiting. Have a great day!",
                    icon: "success",
                    customClass: { popup: 'custom-swal2' },
                    confirmButtonText: 'ok',
                    confirmButtonColor: "#B88E2F",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        window.location.href = '../index.html';
                    }
                })

            } else {
                handleError(userData, errorMessagesLogout)
            }
        }
    });
})

const fetchRefreshToken = async () => {
    const refreshToken = getCookieValue('Refresh-Token');
    const refreshTokenExpiry = getCookieValue('Refresh-Token-Expiry');
    const hasAccessTokenExpired = new Date().getTime() > refreshTokenExpiry

    if (hasAccessTokenExpired && !refreshToken) {
        redirectToLogin();
    }

    const tokenRefreshData = {
        "refreshToken": refreshToken
    }

    try {
        let response = await fetch('https://furniro-6x7f.onrender.com/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokenRefreshData),
        });
        console.log(response);

        if (response.ok) {
            const RefreshTokenData = await response.json();
            console.log(RefreshTokenData);
            return { AccessToken: RefreshTokenData.data.newAccessToken, RefreshToken: RefreshTokenData.data.newRefreshToken };
        } else {
            redirectToLogin();
        }
    } catch (error) {
        redirectToLogin();
    }
}

const hasAccessTokenExpired = async () => {
    const expiryTime = getFromLocalStorage("Access-Token-Expiry")
    const newDate = new Date().getTime()
    const hasExpired = newDate >= parseInt(expiryTime, 10)

    if (hasExpired) {
        try {
            const newToken = await fetchRefreshToken();
            console.log(newToken);
            if (newToken) {
                return newToken;
            } else {
                redirectToLogin();
            }
        } catch (error) {
            redirectToLogin();
        }
    } else {
        redirectToLogin()
    }
}

const redirectToLogin = () => {
    localStorage.removeItem('Access-Token');
    localStorage.removeItem('Access-Token-Expiry');
    deleteCookie("Refresh-Token")
    deleteCookie("Refresh-Token-Expiry")
    Swal.fire({
        title: "Logged Out for Security Reasons",
        text: "You have been logged out due to security concerns. Please log in again to continue. Your security is our top priority.",
        icon: "warning",
        customClass: { popup: 'custom-swal2' },
        showCancelButton: true,
        confirmButtonText: 'Login Again',
        cancelButtonText: 'Go to Home Page',
        confirmButtonColor: "#B88E2F",
        cancelButtonColor: "#d33",
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../Pages/auth.html';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            window.location.href = '../index.html';
        }
    });
}

const executeTokenCheck = async () => {
    const token = await hasAccessTokenExpired();

    if (token) {
        setSecureCookie("Refresh-Token", token.RefreshToken, 7);
        storeAccessTokenWithExpiry(token.AccessToken, 14);
    } else {
        redirectToLogin();
    }

    setTimeout(executeTokenCheck, 14 * 60 * 1000);
}

window.addEventListener("load", () => {
    handleUserAuthentication()
})