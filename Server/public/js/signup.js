document.querySelector("#form2").style.display = "none";
document.querySelector("#form3").style.display = "none";
document.getElementById("phone").focus();
const prod_url = "https://chatup.anuragsawant.tech";

var input = document.querySelector("#phone");
var iti = window.intlTelInput(input, {
  // separateDialCode:true,
  utilsScript:
    "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.0/build/js/utils.js",
});

var otp = "";

$(".digit-group").find("input").each(function () {
  $(this).attr("maxlength", 1);

  $(this).on("input", function (e) {
    var parent = $($(this).parent());
    var inputValue = $(this).val();

    // Remove any non-numeric characters
    inputValue = inputValue.replace(/\D/g, '');
    $(this).val(inputValue);

    if (inputValue) {
      var next = parent.find("input#" + $(this).data("next"));

      if (next.length) {
        $(next).focus();
      } else {
        if (parent.data("autosubmit")) {
          parent.submit();
        }
      }
    }
  });

  $(this).on("keydown", function (e) {
    var parent = $($(this).parent());
    var currentId = $(this).attr("id");

    if ($(this).val().length >= 1 && e.keyCode !== 8) {
      e.preventDefault(); // Prevent further input if already one character entered
    }

    if (e.keyCode === 8) { // Backspace key
      var prev = parent.find("input#" + $(this).data("previous"));

      if (prev.length) {
        $(this).val("");
        $(prev).focus();
      }
    }
  });

  $(this).on("blur", function () {
    var inputValue = $(this).val();

    if (inputValue.length > 1) {
      $(this).val(inputValue.slice(0, 1)); // Trim to the first character
    }

    otp = $(".digit-group")
      .find("input")
      .map(function () {
        return $(this).val();
      })
      .get()
      .join("");

    $("#otp").val(otp);
  });
});


function setJwtCookie(name, value, days) {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + expirationDate.toUTCString();

  // Set the domain attribute for each specific subdomain
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function clickButton(inputField, button) {
  inputField.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      button.click();
    }
  });
}

const ph = document.querySelector("#phone");
const d6 = document.querySelector("#digit-6");
const n = document.querySelector("#name");

clickButton(ph, document.querySelector("#btn1"));
clickButton(d6, document.querySelector("#btn2"));
clickButton(n, document.querySelector("#btn3"));

const submitPhone = () => {
  const phone = iti.getNumber();
  const form1 = document.querySelector("#form1");
  const form2 = document.querySelector("#form2");
  const p1 = document.querySelector("#p1");
  const l1 = document.querySelector("#l1");
  const errbox = document.querySelector("#box1");
  const main = document.querySelector("#main");
  const phoneRegex = /^\+\d{12}$/;

  p1.style.display = "none";
  l1.style.display = "block";

  if (phoneRegex.test(phone)) {
    try {
      $.post("/signup/phone/send", { phone: phone }, (data) => {
        if (data.status === "success") {
          info.innerHTML = `An OTP has been sent to ${phone} `;
          form1.className = "animate__animated animate__fadeOutLeft";
          setTimeout(() => {
            form1.style.display = "none";
            main.className = "div2";
            setTimeout(() => {
              form2.style.display = "flex";
              form2.className = "animate__animated animate__fadeInRight";
              document.getElementById("digit-1").focus();
              p1.style.display = "block";
              l1.style.display = "none";
            }, 500);
          }, 500);
        } else {
          errbox.innerHTML = data.message;
          p1.style.display = "block";
          l1.style.display = "none";
        }
      });
    } catch (error) {
      errbox.innerHTML = "Something went wrong";
      p1.style.display = "block";
      l1.style.display = "none";
    }
  } else {
    errbox.innerHTML = "Invalid Phone Number";
    p1.style.display = "block";
    l1.style.display = "none";
  }
};

const submitOTP = () => {
  const form2 = document.querySelector("#form2");
  const form3 = document.querySelector("#form3");
  const phone = iti.getNumber();

  const p2 = document.querySelector("#p2");
  const l2 = document.querySelector("#l2");
  const errbox = document.querySelector("#box2");

  p2.style.display = "none";
  l2.style.display = "block";

  try {
    $.post("/signup/phone/verify", { phone, otp }, (data) => {
      if (data.status === "success") {
        form2.className = "animate__animated animate__fadeOutLeft";
        form3.style.display = "flex";
        form3.className = "animate__animated animate__fadeInRight";
        document.getElementById("name").focus();
        p2.style.display = "block";
        l2.style.display = "none";
      } else if (data.status === "login") {
        setJwtCookie("jwt", data.token, 10);
        window.location.href = prod_url;
      } else {
        errbox.innerHTML = data.message;
        p2.style.display = "block";
        l2.style.display = "none";
      }
    });
  } catch (error) {
    errbox.innerHTML = "Something went wrong. Please try again later";
  }
};

const submitDetails = () => {
  const phone = iti.getNumber();
  const p3 = document.querySelector("#p3");
  const l3 = document.querySelector("#l3");
  const errbox = document.querySelector("#box3");
  const name = document.querySelector("#name").value;

  p3.style.display = "none";
  l3.style.display = "block";

  try {
    $.post("/signup/data", { name, phone }, (data) => {
      if (data.status === "success") {
        setJwtCookie("jwt", data.token, 10);
        window.location.href = prod_url;
      } else {
        errbox.innerHTML = data.message;
        p3.style.display = "block";
        l3.style.display = "none";
      }
    });
  } catch (error) {
    errbox.innerHTML = "Something went wrong";
  }
};
