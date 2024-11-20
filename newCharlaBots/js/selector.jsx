import React from "react";

class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [], // Holds the available programming languages
      selectedLanguage: "", // Stores the selected programming language
    };
  }

  componentDidMount() {
    // Fetch available programming languages from the backend
    const url = "/getAllLanguageNames/";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const options = data.data.map((item) => ({
          text: item.name,
          key: `language${item.key}`,
        }));
        this.setState({ options });
      })
      .catch((error) => console.error("Error fetching languages:", error));
  }

  handleSelection(selection) {
    // Store the selected language in the state
    this.setState({ selectedLanguage: selection });
    // Redirect to the menu page with the language ID as query
    window.location.replace(`/menu?langid=${selection.slice(8)}`);
  }

  render() {
    const { options } = this.state;

    return (
      <div style={{ textAlign: "center" }}>
        <div>Select a Programming Language</div>
        <div>
          {options.length > 0 ? (
            options.map((option) => (
              <div key={option.key} className="btn-div">
                <button
                  className="btn"
                  onClick={() => this.handleSelection(option.key)}
                >
                  {option.text}
                </button>
              </div>
            ))
          ) : (
            <p>Loading available languages...</p>
          )}
        </div>
      </div>
    );
  }
}

export default Selector;
