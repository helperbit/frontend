/* 
 *  Helperbit: a p2p donation platform (frontend)
 *  Copyright (C) 2016-2021  Davide Gessa (gessadavide@gmail.com)
 *  Copyright (C) 2016-2021  Helperbit team
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

var envConfig = require('../../config');

var helperbit_uri = '';
var helperbit_id_mod = '';

var helperbit_init = function (type, id, desc, conf, amount, manual, distribution, campaign) {
  helperbit_uri = envConfig.baseUrl + '/widgets/donate-button/iframe.html?t=' + type + '&i=' + id;

  if (desc !== undefined && desc !== null)
    helperbit_uri += '&d=' + desc;

  if (conf !== undefined)
    helperbit_uri += '&c=' + conf;

  if (amount)
    helperbit_uri += '&am=' + amount;

  if (campaign)
    helperbit_uri += '&camp=' + campaign;

  if (distribution) {
    helperbit_uri += '&dis=' + encodeURIComponent(JSON.stringify(distribution))
  }

  helperbit_uri += '&h=' + location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
  helperbit_uri += '&p=' + location.pathname;

  if (!manual)
    helperbit_id_mod = '-' + type + '-' + id;
};


var helperbit_bind_event = function (to, event, eventfallback, f) {
  if (to.addEventListener) {
    to.addEventListener(event, function () {
      f();
    });
  } else if (to.attachEvent) {
    to.attachEvent(eventfallback, function () {
      f();
    });
  }
};


var helperbit_widget_close = function () {
  var frame = document.getElementById('hbdonateframe' + helperbit_id_mod);
  var container = document.getElementById('hbcontainer' + helperbit_id_mod);
  frame.setAttribute('src', '');
  frame.style.display = 'none';
  // container.style.display = 'none';
  container.className = 'hbcontainer';
};

var helperbit_receive_message = function (msg) {
  if (msg.origin !== envConfig.baseUrl) return;
  if (msg.data == 'close') {
    helperbit_widget_close();
  }
};

var helperbit_widget_activate = function () {
  var frame = document.getElementById('hbdonateframe' + helperbit_id_mod);
  var container = document.getElementById('hbcontainer' + helperbit_id_mod);
  container.onclick = helperbit_widget_close;
  frame.setAttribute('src', helperbit_uri);
  frame.style.display = 'block';
  container.className = 'hbcontainer active';
  window.addEventListener("message", helperbit_receive_message, false);
};

var helperbit_setup_buttons = function () {
  var bopen = document.getElementById('hbdonatebutton' + helperbit_id_mod);
  if (bopen) {
    helperbit_bind_event(bopen, 'click', 'onclick', helperbit_widget_activate);
  }
  window.addEventListener("message", helperbit_receive_message, false);
};

if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", function () {
    window.helperbit_setup_buttons();
    document.removeEventListener("DOMContentLoaded", arguments.callee, false); x
  });
} else if (document.attachEvent) {
  document.attachEvent("onreadystatechange", function () {
    if (document.readyState === "complete") {
      window.helperbit_setup_buttons();
      document.detachEvent("onreadystatechange", arguments.callee);
    }
  });
}

window.HBDonateButton = {
  init: helperbit_init,
  activate: helperbit_widget_activate
};

window.helperbit_init = helperbit_init;
window.helperbit_widget_activate = helperbit_widget_activate;
window.helperbit_widget_close = helperbit_widget_close;
window.helperbit_setup_buttons = helperbit_setup_buttons;