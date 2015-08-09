var twitchStreamers = ["Wyld","AntVenom","freecodecamp","anabooo","theslowcss", "storbeck", "terakilobyte", "habathcx","RobotCaleb","comster404","brunofin","thomasballinger","noobs2ninjas","beohoff"];
var twitchUrl = "https://api.twitch.tv/kraken/streams/";
var twitchUserUrl = "https://api.twitch.tv/kraken/users/";

var TwitchTvMain = function() {
  var self = this;
  self.Menu = "All";
  self.Streamers = [];
  $(".pagination li").on("click", function() {
    $(".pagination li").each(function() { 
      $(this).removeClass("active");
    });
    $(this).addClass("active");
    self.Menu = $(this).text();
    self.renderList();
  });
  self.getDetails();
  $("#filterInput").keyup(function(e) {
    self.renderList();
  });
}
TwitchTvMain.prototype = {
  getDetails: function() {
    var self = this;
    twitchStreamers.forEach(function(name) {
       $.getJSON(twitchUserUrl + name + "?callback=?", function(data) {
          self.twitchUserDetail(data);
       }); 
    });
  },
  twitchStreamerDetail : function(jsonData, obj) {
    obj.online = jsonData.stream == null ? false : true;
    if (obj.online === true)
    {
      obj.game = jsonData.stream.game;
      obj.status = jsonData.stream.channel.status;
      obj.link = jsonData.stream.channel.url;
    }
  },
  twitchUserDetail : function(jsonData) {
    var self = this;
    var obj = {}
    obj.displayName = jsonData.display_name;
    obj.name = jsonData.name.toLowerCase();
    obj.logo = jsonData.logo;
    
    // retrieve streaming data online/offline
    $.getJSON(twitchUrl + obj.name + "?callback=?", function(data) {
      self.twitchStreamerDetail(data, obj);
      self.Streamers.push(obj);
      self.Streamers.sort(function(a,b) {
        return b.name < a.name ? 1 : -1;
      });
      self.renderList();
    });
  },
  renderList : function() {
    $(".streamerList").html("");
    var menuType = this.Menu;
    var filter = $("#filterInput").val().toLowerCase();
    this.Streamers.forEach(function(streamer) {
      if (filter !== "") {
        if (streamer.name.indexOf(filter) === -1)
          return;
      }
      if (menuType === "Offline")
      {
        if (streamer.online)
          return;
      }
      else if (menuType === "Online")
      {
        if (!streamer.online)
          return;
      }
      
      var items = [];
      if (streamer.logo !== null)
        items.push("<img src='" + streamer.logo + "' />");
      else
        items.push("<img src='http://placehold.it/50x50' />");
      var extra = streamer.online ? " - " + streamer.game : "";
      items.push("<label>" + streamer.displayName + extra +"</label>");
      if (streamer.online)
      {
        items.push("<i class='fa fa-lg fa-circle green'/>")
        items.push("<span>" + streamer.status  + "</span>")
      }
      else
        items.push("<i class='fa fa-lg fa-circle red'/>")
      $("<a/>",{
        target: "_blank",
        href: "http://www.twitch.tv/" + streamer.name
      }).append($("<li/>", {   html: items.join("")}).addClass("list-group-item")).appendTo($(".streamerList"));
    });
  }
}

var twitchObject;

$(document).ready(function() {
  twitchObject = new TwitchTvMain();
});
