import React from "react";
import PropTypes from "prop-types";

class Form extends React.Component {
  /* Display number of image and post owner of a single post */

  constructor(props) {
    // Initialize mutable state

    super(props);
    this.state = {
      options: [
        { text: "Chat with a Bot", key: "button0" },
        { text: "Create a Bot", key: "button1" },
        { text: "Edit a Bot", key: "button2" },
        { text: "Chat with Two Bots", key: "button3" },
        { text: "Create a Bot Language", key: "button4" },
      ],

      action: "",
      botChosen: "",
      botLanguage: "",
    };
  }

  componentDidMount() {
    // This line automatically assigns this.props.url to the const variable url
    // const { url } = this.props;
    const urlParams = new URLSearchParams(window.location.search);
    const langid = urlParams.get("langid");
    if (langid) {
      this.setState({ botLanguage: `language${langid}` });
    }
  }

  //handles selection to chat with a bot
  //action: chat1 -> chat with 1 bot, chat2 -> chat with 2 bots
  chatWithBot(selection) {
    const url = "/getAllBotNames/";
    fetch(url, {})
      .then((response) => response.json())
      .then((data) => {
        let options = [];
        let bot = "bot";

        for (const index in data.data) {
          options.push({
            text: data.data[index]["name"],
            key: bot + data.data[index]["key"],
          });
        }

        this.setState({
          options: options,
        });
      });

    let action = selection == "button0" ? "chat1" : "chat2";

    this.setState({
      action: action,
    });
  }

  //handles selection to chat with a bot
  selectBotToEdit(selection) {
    const url = "/getAllBotNames/";
    fetch(url, {})
      .then((response) => response.json())
      .then((data) => {
        let options = [];
        let bot = "editBot";

        for (const index in data.data) {
          options.push({
            text: data.data[index]["name"],
            key: bot + data.data[index]["key"],
          });
        }

        this.setState({
          options: options,
        });
      });

    let action = "chooseBotToEdit";

    this.setState({
      action: action,
    });
  }

  //edit a bot
  editBot(selection) {
    const url = "/getAllLanguageNames/";
    fetch(url, {})
      .then((response) => response.json())
      .then((data) => {
        let options = [];
        let language = "language";

        for (const index in data.data) {
          options.push({
            text: data.data[index]["name"],
            key: language + data.data[index]["key"],
          });
        }
        let action = selection == "button1" ? "createBot" : "editBot";
        this.setState({
          options: options,
          action: action,
        });
      });
  }

  createBot(selection) {
    const url = "/getAllLanguageNames/";
    fetch(url, {})
      .then((response) => response.json())
      .then((data) => {
        let options = [];
        let language = "languageToEdit";

        for (const index in data.data) {
          options.push({
            text: data.data[index]["name"],
            key: language + data.data[index]["key"],
          });
        }
        let action = selection == "button1" ? "createBot" : "editBot";
        this.setState({
          options: options,
          action: action,
        });
      });
  }

  createLanguage() {
    //TODO
    this.setState({
      action: "createLanguage",
    });
    window.location.replace("/createLanguage/");
  }

  // handleSelection(selection) {
  //   // console.log(selection)
  //   // console.log("action item")
  //   // console.log(this.state.action)

  //   const urlParams = new URLSearchParams(window.location.search);
  //   const langid = urlParams.get("langid");

  //   if (selection == "button0" || selection == "button3") {
  //     this.chatWithBot(selection);
  //   } else if (selection == "button1") {
  //     //this.createBot(selection);
  //     window.location.replace(`/create?langid=${langid}`);
  //   } else if (selection == "button2") {
  //     // this.editBot(selection);
  //     this.selectBotToEdit(selection);
  //     this.setState({ botLanguage: `language${langid}` });
  //   } else if (selection == "button4") {
  //     this.createLanguage();
  //   }
  //   //edit a bot --
  //   else if (selection.startsWith("languageToEdit")) {
  //     //if we came from create bot, we don't do this
  //     this.selectBotToEdit(selection);
  //     this.setState({
  //       botLanguage: selection,
  //     });
  //   }
  //   //check if selection starts with language
  //   //options  = list of all bots
  //   //update state with selected language
  //   //if selection =  action is edit bot
  //   else if (selection.startsWith("editBot")) {
  //     //take in bot to edit & language as parameter
  //     window.location.replace(
  //       "/editor?botid=" +
  //         selection.substring(7) +
  //         "&langid=" +
  //         this.state.botLanguage.slice(-1)
  //     );
  //   } else if (this.state.action.startsWith("createBot")) {
  //     //figure out what language we just clicked
  //     window.location.replace("/create?" + "langid=" + selection.slice(-1));
  //   } else if (this.state.action.startsWith("chat1")) {
  //     // alert("hi")
  //     //figure out what language we just clicked
  //     window.location.replace("/chat?" + "botid=" + selection.slice(3));
  //   } else if (
  //     this.state.action.startsWith("chat2") &&
  //     this.state.botChosen == ""
  //   ) {
  //     this.setState({
  //       botChosen: selection,
  //       action: "chat2.1",
  //     });
  //   } else if (this.state.action.startsWith("chat2.1")) {
  //     //go to a new window bring the 2 bot IDs as args
  //     window.location.replace(
  //       "/chat2?" +
  //         "botid1=" +
  //         this.state.botChosen.slice(-1) +
  //         "&botid2=" +
  //         selection.slice(-1)
  //     );
  //   }
  // }

  handleSelection(selection) {
    const urlParams = new URLSearchParams(window.location.search);
    const langid = urlParams.get("langid");
  
    const extractNumberAtEnd = (str) => {
      const match = str.match(/\d+$/);
      return match ? match[0] : null;
    };
  
    if (selection == "button0" || selection == "button3") {
      this.chatWithBot(selection);
      return;
    }
  
    if (selection == "button1") {
      window.location.replace(`/create?langid=${langid}`);
      return;
    }
  
    if (selection == "button2") {
      this.selectBotToEdit(selection);
      this.setState({ botLanguage: `language${langid}` });
      return;
    }
  
    if (selection == "button4") {
      this.createLanguage();
      return;
    }
  
    if (selection.startsWith("languageToEdit")) {
      this.selectBotToEdit(selection);
      this.setState({ botLanguage: selection });
      return;
    }
  
    if (selection.startsWith("editBot")) {
      const botid = selection.substring(7); // after "editBot"
      const langNum = extractNumberAtEnd(this.state.botLanguage);
      window.location.replace(`/editor?botid=${botid}&langid=${langNum}`);
      return;
    }
  
    if (this.state.action.startsWith("createBot")) {
      const langNum = extractNumberAtEnd(selection);
      window.location.replace(`/create?langid=${langNum}`);
      return;
    }
  
    if (this.state.action.startsWith("chat1")) {
      const botid = selection.substring(3); // after "bot"
      window.location.replace(`/chat?botid=${botid}`);
      return;
    }
  
    if (this.state.action.startsWith("chat2") && this.state.botChosen === "") {
      this.setState({
        botChosen: selection,
        action: "chat2.1",
      });
      return;
    }
  
    if (this.state.action.startsWith("chat2.1")) {
      const botid1 = extractNumberAtEnd(this.state.botChosen);
      const botid2 = extractNumberAtEnd(selection);
      window.location.replace(`/chat2?botid1=${botid1}&botid2=${botid2}`);
      return;
    }
  }

  render() {
    // This line automatically assigns this.state.imgUrl to the const variable imgUrl
    // and this.state.owner to the const variable owner
    let allOptions = this.state.options.map((answerOption) => (
      <div key={answerOption.key}>
        <div className="btn-div">
          <button
            className="btn"
            key={answerOption.key}
            // style = "font-size : 2000px"
            // style={{backgroundColor:"red"}}
            onClick={() => this.handleSelection(answerOption.key)}
          >
            {answerOption.text}
          </button>{" "}
          <br></br>
        </div>
      </div>
    ));

    // Render number of post image and post owner
    return (
      <div>
        <div>
          {this.state.action == "" ? (
            <div>
              <br></br>
              <div className="options">{allOptions}</div>
            </div>
          ) : null}

          <div>
            {(this.state.action == "chat1" ||
              this.state.action == "chat2" ||
              this.state.action == "chooseBotToEdit") &&
            this.state.botChosen == "" ? (
              <div>
                Bot 1: <br></br>
                {allOptions}
              </div>
            ) : null}
            {this.state.action == "chat2.1" ? (
              <div>
                Bot 2: <br></br>
                {allOptions}
              </div>
            ) : null}

            {/* {(this.state.action == "chat2")?(
              <div>
                Bot 2: <br></br>
                {allOptions}
              </div>
              ):(null)
            } */}

            {/* {this.state.action == "createBot" ||
            this.state.action == "editBot" ? (
              <div>
                Select a Language: <br></br>
                {allOptions}
              </div>
            ) : null} */}
          </div>

          <br></br>
        </div>
      </div>
    );
  }
}

export default Form;
