import React from "react";
import Cookies from "js-cookie";

class LanguageSelector extends React.Component {
  handleLanguageSelection(language) {
    // Set the selected language in a session cookie
    Cookies.set("userLanguage", language, { path: "/" });
    // Redirect to the appropriate page
    if (language === "English") {
      window.location.replace("/languageSelect"); // Replace with your English page route
    } else if (language === "Español") {
      window.location.replace("/languageSelect"); // Replace with your Spanish page route
    }
  }

  render() {
    console.log("LanguageSelector Rendered");
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <h1>Select Your Language</h1>
        <div className="btn-div">
          <button
            className="btn"
            onClick={() => this.handleLanguageSelection("English")}
          >
            English
          </button>
        </div>
        <br />
        <div className="btn-div">
          <button
            className="btn"
            onClick={() => this.handleLanguageSelection("Español")}
          >
            Español
          </button>
        </div>
      </div>
    );
  }
}

export default LanguageSelector;
