const wrapper = document.querySelector(".wrapper"),
    app = document.querySelector("body"),
    inputPart = document.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    weatherPart = wrapper.querySelector(".weather-part"),
    wIcon = weatherPart.querySelector("img"),
    curDate = document.getElementById("date"),
    arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=901acfddc055afe3f249b7582902818f`;
    fetchData();
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=901acfddc055afe3f249b7582902818f`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api)
        .then((res) => res.json())
        .then((result) => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { temp, feels_like, humidity } = info.main;
        let timeOfDay = "day";
        if (getCurrentTime() <= 12) {
            timeOfDay = "night";
        }

        if (id == 800) {
            wIcon.src = "icons/clear.svg";
            app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.svg";
            app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg";
            app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.svg";
            app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "icons/cloud.svg";
            app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
        } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
            wIcon.src = "icons/rain.svg";
            app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        }

        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

const getCurrentDay = () => {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    let currentTime = new Date();
    let day = weekday[currentTime.getDay()];
    return day;
};

const getCurrentTime = () => {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var now = new Date();
    var month = months[now.getMonth() + 1];
    var date = now.getDate();
    let hours = now.getHours();
    let mins = now.getMinutes();
    let periods = "AM";
    if (hours > 11) {
        periods = "PM";
        if (hours > 12) hours -= 12;
    }
    if (mins < 10) {
        mins = "0" + mins;
    }
    return `${month} ${date} | ${hours}:${mins}${periods}`;
};
curDate.innerHTML = getCurrentDay() + " | " + getCurrentTime();
