"use strict";
/*
 * Front‑end editor logic (patched 2025‑04‑27)
 * – Removes implicit globals (j, comment)
 * – Guards against undefined mappings (.trim())
 * – Resets highlighting arrays each run
 * – URL components are now encodeURIComponent‑escaped
 */

let isEditor = false;
const newline = "(nw-ln)";

$(document).ready(function () {
  // Determine whether we are in “Edit” mode.
  isEditor = document.getElementById("titleText").innerHTML.includes("Edit");
  if (!isEditor) return; // Nothing else to do in “Create” mode.

  // Fetch bot + language data
  const botID = document.getElementById("botid")?.innerHTML.trim() || "";
  const langID = document.getElementById("langid").innerHTML.trim();

  const url = `/getBotAndLang/?botID=${encodeURIComponent(botID)}&langID=${encodeURIComponent(langID)}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Populate title, description, and code editor
      const { botInfo, langInfo } = data;
      $("#botname").val(botInfo.botname);
      $("#titleText").text(`Edit ${botInfo.botname}`);
      $("#editCode").html(`Edit ${botInfo.botname}'s Code Below &#x2193;`);
      $("#description").val(botInfo.description);

      const translatedCode = translateCanonicalCode(langInfo, botInfo.canonical);
      syntaxHighlighting(langInfo, translatedCode);
      $("#editor").val(translatedCode);

      updateScreen(translatedCode);
    });
});

// ---------------------------- Translation ------------------------------ //
function translateLineToUser(mapping, line) {
  let translated = "",
    prevKeyword = "",
    keyword = "";

  for (let j = 0; j < line.length; j++) {
    prevKeyword = keyword;
    keyword = "";

    if (line[j] === "{") {
      j++;
      while (j < line.length && line[j] !== "}") {
        keyword += line[j++];
      }
      const translatedKeyword = (mapping[keyword] ?? `{${keyword}}`).trim();
      translated += keyword.startsWith("reply") ? `    ${translatedKeyword}` : translatedKeyword;
    } else {
      if (!prevKeyword.match(/^(if|reply|and)/)) translated += "    ";
      while (j < line.length && line[j] !== "{") translated += line[j++];
      j--; // compensate for final ++ of for‑loop
    }
  }
  return translated;
}

function translateCanonicalCode(mapping, canonicalCode) {
  return canonicalCode
    .split(newline)
    .map((ln) => translateLineToUser(mapping, ln))
    .join("\n");
}

// ------------------------- Syntax highlighting ------------------------- //
let conds = [],
  replies = [],
  picks = [];

function syntaxHighlighting(mapping, translatedCode) {
  // Reset highlight vectors each run
  conds.length = replies.length = picks.length = 0;

  const mappingKeys = [
    "ifAny",
    "andNotAny",
    "ifAll",
    "andNotAll",
    "replyLine",
    "startReply",
    "endReply",
    "endIf",
    "pickRandom",
    "endPick",
  ];

  translatedCode.split("\n").forEach((rawLn) => {
    const line = rawLn.trim();
    if (!line) return;

    for (const key of mappingKeys) {
      if (line.startsWith(mapping[key])) {
        if (["ifAny", "endIf", "ifAll", "andNotAll"].includes(key)) conds.push(mapping[key]);
        else if (["startReply", "endReply"].includes(key)) replies.push(mapping[key]);
        else if (["pickRandom", "endPick"].includes(key)) picks.push(mapping[key]);
      }
    }
  });
}

// ----------------------------- Save Bot -------------------------------- //
function saveBot() {
  const langID = $("#langid").text().trim();

  fetch(`/getLanguageData/?langid=${encodeURIComponent(langID)}`)
    .then((r) => r.json())
    .then((mappings) => {
      const translatedCode = $("#editor").val();
      const canonicalCode = translatedCode
        .split("\n")
        .map((ln) => translateLineToCanonical(mappings, ln.trim()))
        .filter(Boolean)
        .join(newline)
        .trim();

      pushCanonicalToServer(canonicalCode);
    });
}

function translateLineToCanonical(mapping, line) {
  const mappingKeys = [
    "ifAny",
    "andNotAny",
    "ifAll",
    "andNotAll",
    "replyLine",
    "startReply",
    "endReply",
    "endIf",
    "pickRandom",
    "endPick",
  ];

  for (const key of mappingKeys) {
    if (line.startsWith(mapping[key])) {
      const rest = line.slice(mapping[key].length);
      let canonical = `{${key}}${rest}`;

      for (const notKey of ["andNotAny", "andNotAll"]) {
        const idx = canonical.indexOf(mapping[notKey]);
        if (idx !== -1) {
          canonical = `${canonical.slice(0, idx)}{${notKey}}${canonical.slice(idx + mapping[notKey].length)}`;
          break;
        }
      }
      return canonical;
    }
  }
  return line; // unchanged
}

function pushCanonicalToServer(canonicalCode) {
  const botName = $("#botname").val().trim();
  const description = $("#description").val();
  const botIDNode = document.getElementById("botid");
  const botID = botIDNode ? botIDNode.innerHTML.trim() : "-1";

  if (!botName) {
    alert("Name can't be empty");
    return;
  }

  fetch("/getAllBotNames")
    .then((r) => r.json())
    .then((data) => {
      const nameTaken = data.data.some((x) => x.name === botName && String(x.key) !== String(botID));
      if (nameTaken) {
        alert("That name is already taken, please choose another one");
        return;
      }

      const payload = {
        botID,
        botName,
        canonicalCode,
        description,
      };

      const endpoint = isEditor ? "/updateBot/" : "/createBot/";

      fetch(endpoint, {
        method: isEditor ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((r) => {
          if (!r.ok) throw new Error("Failed to save");
          return r.json();
        })
        .then(() => {
          alert("Update Code Success!");
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to update bot");
        });
    });
}

// --------------------------- Editor widget ----------------------------- //
updateScreen($("#editor").val());
$("#editor").on("keydown", function () {
  setTimeout(() => updateScreen($(this).val()), 0);
});

function updateScreen(text) {
  $("#out").html(colorize(text.replace(/\n/g, "<br>").replace(/\t/g, "&#9;"), text.split(/\r?\n/)));
}

$("#editor").on("scroll", function () {
  $("#out").css({ top: -$(this).scrollTop() + "px" });
});

// ------------------------------ Colouring ------------------------------ //
function colorize(text, lines) {
  // highlight comments
  for (const line of lines) {
    const idx = line.indexOf("//");
    if (idx !== -1) {
      const commentText = line.slice(idx + 2);
      text = text.replace(`//${commentText}`, `<span style="color:LightGreen">//${commentText}</span>`);
    }
  }

  const applyColour = (arr, colour) => {
    for (const tok of arr) {
      text = text.replaceAll(tok, `<span style=\"color:${colour}\">${tok}</span>`);
      text = text.replaceAll(tok.toLowerCase(), `<span style=\"color:${colour}\">${tok.toLowerCase()}</span>`);
    }
  };

  applyColour(conds, "CornflowerBlue");
  applyColour(replies, "DarkOrchid");
  applyColour(picks, "Orchid");

  return text;
}
