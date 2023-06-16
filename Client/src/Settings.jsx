import React, { useEffect } from "react";
import Cropper from "cropperjs";
import Cookies from "js-cookie";
const jwtToken = Cookies.get("jwt");

const Settings = ({ settings, closeSettings, user }) => {
  if (settings == true) {
    document.getElementById("settings").style.display = "flex";
    document.getElementById("main").style.filter = "blur(15px)";
    document.getElementById("settings").showModal();
  }

  const closeModal = () => {
    document.getElementById("main").style.filter = "blur(0px)";
    document.getElementById("settings").style.display = "none";
    document.getElementById("settings").close();
    closeSettings();
  };

  const changeName = () => {
    document.getElementById("name").disabled = false;
    document.getElementById("name").focus();
  };

  const disableInput = () => {
    document.getElementById("name").disabled = true;
  };

  useEffect(() => {
    const dialog = document.getElementById("settings");

    dialog.addEventListener("cancel", () => {
      closeModal();
    });

    document.getElementById("canvas").style.display = "none";
  }, []);

  const openImgUpload = () => {
    const imgUpload = document.getElementById("imgupload");
    imgUpload.click();
  };

  const inputStyle = {
    display: "none",
  };

  const saveData = () => {
    const name = document.getElementById("name").value;
    fetch(`${import.meta.env.VITE_MAIN_SERVER}/updateProfile/`, {
      method: "POST",
      cors: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: name,
      }),
    }).then(async (res) => {
      if (res.status !== 200) {
        window.location.href = `${import.meta.env.VITE_MAIN_SERVER}/signup`;
        return;
      }
      const response = await res.json();
      if (response.status === "success") {
        window.location.reload();
      } else {
        alert("Error in updating data");
      }
    });
  };

  let cropper;
  const triggerCanvas = (event) => {
    const img = document.getElementById("newProfile");
    canvas.style.display = "block";
    img.src = URL.createObjectURL(event.target.files[0]);
    cropper = new Cropper(img, { aspectRatio: 1 });
  };

  const getCroppedImage = async () => {
    console.log("CALLED")
    const croppedCanvas = cropper.getCroppedCanvas();
    const croppedImageDataURL = croppedCanvas.toDataURL();
    const res = await fetch(`${import.meta.env.VITE_MAIN_SERVER}/updateProfile/image`, {
      method: "POST",
      cors: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        image: croppedImageDataURL,
      }),
    });
    if (res.status !== 200) {
      window.location.href = `${import.meta.env.VITE_MAIN_SERVER}/signup`;
      return;
    }
    const response = await res.json();
    if (response.status === "success") {
      window.location.reload();
    } else {
      alert("Error in uploading image");
    }
  };

  const closePicture = () => {
    document.getElementById("canvas").style.display = "none";
    const img = document.getElementById("newProfile");
    img.src = "";
  };

  const handleLogout = () => {
    // Remove all cookies
    const cookies = Object.keys(Cookies.get());
    cookies.forEach((cookie) => Cookies.remove(cookie));
    window.location.href = `${import.meta.env.VITE_MAIN_SERVER}/signup`;
  };

  return (
    <dialog id="settings" className="settings">
      <i className="fa-duotone fa-xmark" onClick={closeModal}></i>
      <h1>Settings</h1>
      <img src={"data:image/png;base64," + user.picture} alt="" />
      <button type="file" id="OpenImgUpload" onClick={openImgUpload}>
        Change Image
      </button>
      <input
        type="file"
        id="imgupload"
        accept="image/*"
        style={inputStyle}
        onChange={triggerCanvas}
      />

      <table>
        <tbody>
          <tr>
            <td>Name: </td>
            <td>
              <input
                type="text"
                defaultValue={user.name}
                id="name"
                disabled
                onBlur={disableInput}
              />
            </td>
            <td>
              <i className="fa-duotone fa-pen" onClick={changeName}></i>
            </td>
          </tr>
          <tr>
            <td>Phone: </td>
            <td>{user.phone}</td>
          </tr>
        </tbody>
      </table>

      <div className="buttons">
        <button onClick={handleLogout}>
          Logout<i className="fa-solid fa-right-from-bracket"></i>
        </button>
        <button onClick={saveData}>
          Save<i className="fa-solid fa-floppy-disk"></i>
        </button>
      </div>

      <div className="canvas" id="canvas">
        <div className="canvas-main">
          <div className="img">
            <img src="" id="newProfile" />
          </div>

          <div className="buttons">
            <button onClick={closePicture}>
              Cancel <i className="fa-solid fa-ban"></i>
            </button>
            <button onClick={getCroppedImage}>
              Save<i className="fa-solid fa-floppy-disk"></i>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Settings;
