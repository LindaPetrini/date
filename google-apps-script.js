/**
 * Google Apps Script — Date Me Playground webhook
 *
 * Setup:
 * 1. Go to https://script.google.com → New project
 * 2. Paste this entire file into Code.gs
 * 3. Click Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web app URL
 * 5. On hetzner-bot, set: export SHEETS_WEBHOOK="<that URL>"
 *    (add to the systemd unit or .env file)
 * 6. Restart the dateme-api service
 */

// Column headers — order matters, must match the row-building logic below
var HEADERS = [
  "Date", "Name", "Email", "Location", "Travel", "Score", "Archetype",
  "Texture", "Shades", "Autocomplete 1", "Autocomplete 2", "Autocomplete 3",
  "Autocomplete 4", "Autocomplete 5", "AI", "Toes", "Untangle",
  "Sequence", "Day Morning", "Day Afternoon", "Day Evening", "Day Night",
  "Message preference", "Music", "Hold", "Nature", "Babies", "Color",
  "Precision", "Upside down", "Room", "Body", "Crying", "Reading WPM",
  "Reading Correct", "Spirit", "Emotion score", "Neuro", "Lead",
  "Embodiment", "Therapy hours", "Therapy buzzwords", "God", "Food",
  "Patterns", "Meta", "Fun",
  "Photo", "Voice note", "Message", "Results URL",
  "Called", "Vibe", "Notes"
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Ensure headers exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }

    // Decode responses from results_url if present
    var responses = {};
    var resultsUrl = data.results_url || "";
    if (resultsUrl) {
      var match = resultsUrl.match(/[?&]r=([^&]+)/);
      if (match) {
        try {
          // Restore standard base64 from URL-safe version
          var b64 = match[1].replace(/-/g, '+').replace(/_/g, '/');
          while (b64.length % 4) b64 += '=';
          var json = Utilities.newBlob(Utilities.base64Decode(b64)).getDataAsString();
          responses = JSON.parse(json);
        } catch (decodeErr) {
          // If decode fails, leave responses empty
        }
      }
    }

    // Helper: format arrays as comma-separated strings
    function fmt(val) {
      if (val === undefined || val === null) return "";
      if (Array.isArray(val)) return val.join(", ");
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    }

    // Extract day schedule
    var day = responses.day || {};
    var dayMorning = fmt(day.morning);
    var dayAfternoon = fmt(day.afternoon);
    var dayEvening = fmt(day.evening);
    var dayNight = fmt(day.night);
    // Include custom activities if any
    if (day.customActivities && day.customActivities.length > 0) {
      var customs = day.customActivities.map(function(a) { return a.name || a; }).join(", ");
      dayMorning = dayMorning ? dayMorning + " [custom: " + customs + "]" : customs;
    }

    // Extract autocomplete answers (array of 5)
    var autocomplete = responses.autocomplete || [];

    // Build row matching HEADERS order
    var row = [
      data.timestamp || new Date().toISOString(),                    // Date
      data.name || "",                                                // Name
      data.email || data._replyto || "",                             // Email
      fmt(responses.travel_location || data.location || ""),         // Location
      fmt(responses.travel || ""),                                    // Travel
      fmt(responses.score || ""),                                     // Score
      fmt(responses.archetype || ""),                                 // Archetype
      fmt(responses.texture),                                        // Texture
      fmt(responses.shades),                                         // Shades
      autocomplete[0] || "",                                         // Autocomplete 1
      autocomplete[1] || "",                                         // Autocomplete 2
      autocomplete[2] || "",                                         // Autocomplete 3
      autocomplete[3] || "",                                         // Autocomplete 4
      autocomplete[4] || "",                                         // Autocomplete 5
      fmt(responses.ai),                                             // AI
      fmt(responses.toes),                                           // Toes
      fmt(responses.untangle),                                       // Untangle
      fmt(responses.sequence),                                       // Sequence
      dayMorning,                                                    // Day Morning
      dayAfternoon,                                                  // Day Afternoon
      dayEvening,                                                    // Day Evening
      dayNight,                                                      // Day Night
      fmt(responses.message),                                        // Message preference
      fmt(responses.music),                                          // Music
      fmt(responses.hold),                                           // Hold
      fmt(responses.nature),                                         // Nature
      fmt(responses.babies),                                         // Babies
      fmt(responses.color),                                          // Color
      fmt(responses.precision),                                      // Precision
      fmt(responses.upside),                                         // Upside down
      fmt(responses.room),                                           // Room
      fmt(responses.body),                                           // Body
      fmt(responses.crying),                                         // Crying
      fmt(responses.readingWpm || responses.readingSpeed || ""),     // Reading WPM
      fmt(responses.readingCorrect || responses.readingAnswer || ""),// Reading Correct
      fmt(responses.spirit),                                         // Spirit
      fmt(responses.emotion),                                        // Emotion score
      fmt(responses.neuro),                                          // Neuro
      fmt(responses.lead),                                           // Lead
      fmt(responses.embodiment),                                     // Embodiment
      fmt(responses.therapyHours || responses.therapy || ""),        // Therapy hours
      fmt(responses.therapyBuzzwords),                               // Therapy buzzwords
      fmt(responses.god),                                            // God
      fmt(responses.food),                                           // Food
      fmt(responses.patterns),                                       // Patterns
      fmt(responses.meta),                                           // Meta
      fmt(responses.fun),                                            // Fun
      data.has_photo ? "yes" : "no",                                 // Photo
      data.has_voice ? "yes" : "no",                                 // Voice note
      data.message || "",                                            // Message
      resultsUrl,                                                    // Results URL
      "",                                                            // Called (manual)
      "",                                                            // Vibe (manual)
      ""                                                             // Notes (manual)
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow GET for testing — just returns OK
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, message: "Date Me Sheets webhook is live" })
  ).setMimeType(ContentService.MimeType.JSON);
}
