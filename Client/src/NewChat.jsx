import React, { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Cookies from "js-cookie";
import "animate.css";
import "jquery/dist/jquery.min.js";

const NewChat = ({ newChat, closeNewChat }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const jwtToken = Cookies.get("jwt");

  if (newChat == true) {
    if (open == false) {
      setOpen(true);
      document.getElementById("newChat").style.display = "flex";
      document.getElementById("main").style.filter = "blur(15px)";
      document.getElementById("newChat").showModal();
    }
  }

  const closeModal = () => {
    setOpen(false);
    document.getElementById("main").style.filter = "blur(0px)";
    document.getElementById("newChat").style.display = "none";
    document.getElementById("newChat").close();
    const newChat = document.getElementById("newChat");
    const first = document.getElementById("first");
    const second = document.getElementById("second");
    first.className = "";
    newChat.className = "newChat";
    second.className = "secondDiv";
    document.getElementById("err").innerHTML = "";
    document.getElementById("err1").innerHTML = "";
    closeNewChat();
  };

  useEffect(() => {
    const dialog = document.getElementById("newChat");

    dialog.addEventListener("cancel", () => {
      closeModal();
    });
  }, []);

  const phone = async () => {
    document.getElementById("chevron").style.display = "none";
    document.getElementById("pulsar").classList.remove("pulsar-hide");

    if (!value) {
      document.getElementById("chevron").style.display = "block";
      document.getElementById("pulsar").classList.add("pulsar-hide");
      document.getElementById("err1").innerHTML = "Please enter a phone number";
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_MAIN_SERVER}/newChat`, {
      method: "POST",
      cors: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        phone: value,
      }),
    });

    const response = await res.json();
    if (res.status !== 200) {
      document.getElementById("err1").innerHTML = response.message;
      document.getElementById("chevron").style.display = "block";
      document.getElementById("pulsar").classList.add("pulsar-hide");
      
      return;
    }

    document.getElementById("userName").innerHTML = response.data.name;
    document.getElementById("img").src =
      "data:image/png;base64," + response.data.picture;
    const first = document.getElementById("first");
    const second = document.getElementById("second");
    first.className = "animate__animated animate__fadeOutLeft";
    const newChat = document.getElementById("newChat");
    setTimeout(() => {
      newChat.classList.add("second");
      setTimeout(() => {
        second.className =
          "animate__animated animate__fadeInRight secondDivVis";
        document.getElementById("chevron").style.display = "block";
        document.getElementById("pulsar").classList.add("pulsar-hide");

      }, 500);
    }, 500);
  };

  const add = async () => {
    const res = await fetch(`${import.meta.env.VITE_MAIN_SERVER}/newChat/add`, {
      method: "POST",
      cors: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        phone: value,
      }),
    });
    const response = await res.json();
    if (res.status !== 200) {
      document.getElementById("err").innerHTML = response.message;
      return;
    } else {
      window.location.reload();
    }
  };

  return (
    <dialog id="newChat" className="newChat">
      <i className="fa-duotone fa-xmark" onClick={closeModal}></i>
      <div id="first">
        <h4>Enter the Phone Number of the person</h4>
        <div className="inputs">
          <PhoneInput
            placeholder="Enter phone number"
            onChange={setValue}
            id="phone"
            className="phone"
            defaultCountry="IN"
          ></PhoneInput>

          <button onClick={phone}>
            <i className="fa-solid fa-chevron-right" id="chevron"></i>
            <div className="pulsar pulsar-hide" id="pulsar"></div>
          </button>
        </div>
          <p id="err1" className="err"></p>
      </div>

      <div id="second" className="secondDiv">
        <img src="" alt="" id="img" />
        <h4 id="userName">Hello</h4>
        <div className="buttons">
          <button onClick={closeModal}>Back</button>
          <button onClick={add}>Add</button>
          <p id="err" className="err"></p>
        </div>
      </div>
    </dialog>
  );
};

export default NewChat;
