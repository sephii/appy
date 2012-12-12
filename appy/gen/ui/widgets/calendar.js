function askMonthView(hookId, objectUrl, fieldName, month) {
  // Sends an Ajax request for getting the view month of a calendar field
  var params = {'fieldName': fieldName, 'month': month};
  askAjaxChunk(hookId,'GET',objectUrl,'widgets/calendar','viewMonth', params);
}

function openEventPopup(action, fieldName, day, spansDays,
                        applicableEventTypes, message) {
  /* Opens the popup for creating (or deleting, depending on p_action) a
     calendar event at some p_day. When action is "del", we need to know
     (from p_spansDays) if the event spans more days, in order to propose a
     checkbox allowing to delete events for those successive days. When action
     is "new", a possibly restricted list of applicable event types for this
     day is given in p_applicableEventTypes; p_message contains an optional
     message explaining why not applicable types are not applicable. */
  var prefix = fieldName + '_' + action + 'Event';
  var f = document.getElementById(prefix + 'Form');
  f.day.value = day;
  if (action == 'del') {
    // Show or hide the checkbox for deleting the event for successive days.
    var elem = document.getElementById(prefix + 'DelNextEvent');
    var cb = elem.getElementsByTagName('input');
    cb[0].checked = false;
    cb[1].value = 'False';
    if (spansDays == 'True') { elem.style.display = 'block' }
    else { elem.style.display = 'none' }
  }
  else if (action == 'new') {
    // First: reinitialise input fields
    f.eventType.style.background = '';
    var allOptions = f.eventType.options;
    for (var i=0; i < allOptions.length; i++) {
      allOptions[i].selected = false;
    }
    f.eventSpan.style.background = '';
    // Among all event types, show applicable ones and hide the others.
    var applicable = applicableEventTypes.split(',');
    var applicableDict = {};
    for (var i=0; i < applicable.length; i++) {
      applicableDict[applicable[i]] = true;
    }
    for (var i=0; i < allOptions.length; i++) {
      if (!allOptions[i].value) continue;
      if (allOptions[i].value in applicableDict) {
        allOptions[i].disabled = false;
        allOptions[i].title = '';
      }
      else {
        allOptions[i].disabled = true;
        allOptions[i].title = message;
      }
    }
  }
  openPopup(prefix + 'Popup');
}

function triggerCalendarEvent(action, hookId, fieldName, objectUrl, maxEventLength) {
  /* Sends an Ajax request for triggering a calendar event (create or delete an
     event) and refreshing the view month. */
  var prefix = fieldName + '_' + action + 'Event';
  var f = document.getElementById(prefix + 'Form');
  if (action == 'new') {
    // Check that an event span has been specified
    if (f.eventType.selectedIndex == 0) {
      f.eventType.style.background = wrongTextInput;
      return;
    }
    // Check that eventSpan is empty or contains a valid number
    var spanNumber = f.eventSpan.value.replace(' ', '');
    if (spanNumber) {
      spanNumber = parseInt(spanNumber);
      if (isNaN(spanNumber) || (spanNumber > maxEventLength)) {
        f.eventSpan.style.background = wrongTextInput;
        return;
      }
    }
  }
  var elems = f.elements;
  var params = {};
  // Put form elements into "params".
  for (var i=0; i < elems.length; i++) {
    params[elems[i].name] = elems[i].value;
  }
  closePopup(prefix + 'Popup');
  askAjaxChunk(hookId,'POST',objectUrl,'widgets/calendar','viewMonth',params);
}
