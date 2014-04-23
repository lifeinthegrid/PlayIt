/// <reference path="../lib/jquery/jquery-1.7.1.min.js" />
/**
* PlayIt Jquery Plugin 
* version: 1.0.0 11-11-2011 
* @requires jQuery v1.6.4 or later
* @requires jQuery v1.8.12 or later
* 
* Documentation:
* http://www.lifeinthegrid.com/playit
*
*
* LIB: JQUERY LICENSE
* Copyright 2011, The Dojo Foundation
* Released under the MIT, BSD, and GPL Licenses.
*
* LIB: MEDIAELEMENT.JS
* Copyright 2010-2011, John Dyer (http://j.hn)
* Dual licensed under the MIT or GPL Version 2 licenses.
*
*/


playit = function (options)
{
    //#region Private Fields
    var _scriptSource = document.getElementById("playit-source");
    var _scriptExtractPoint = (_scriptSource.src.indexOf('jquery.playit.js') == -1) ? _scriptSource.src.indexOf('jquery.playit.min.js') : _scriptSource.src.indexOf('jquery.playit.js');
    var _imageSource = _scriptSource.src.substr(0, _scriptExtractPoint) + "images/";

    var defaults = {
        accordionAnimate: true,
        accordionAutoSelect: false,
        accordionMinWidth: 200,
        accordionMaxWidth: 800,
        loadingIconSource: _imageSource + "loading.gif",
        iOSIframeAsObject: true,
        iOSIframeAsObjectLink: true,

        dataSource: playit.xmlDataSource,
        dataSourceOptions: {},
        toolbarTitle: "",
        toolbarShowSearch: true,
        toolbarSearchText: "Search",
        toolbarSearchWidth: "auto",
        themeUseCDN: false,
        themeName: "smoothness",
        themeVersion: "1.8.16",
        themeUrl: "http://ajax.googleapis.com/ajax/libs/jqueryui/{0}/themes/{1}/jquery-ui.css",
        viewDefault: "grid",
        autoFill: false,

        //AUDIO
        audioAutoPlay: false,
        audioInfoEnable: true,
        audioInfoBoxHeight: 300,
        audioInfoBoxWidth: 400,
        audioInfoBoxModal: true,
        audioInfoBoxResizable: false,
        //IMAGE
        imageAutoPlay: true,
        imageSlidesInterval: 4000,
        imageSlidesThumbCount: 7,
        imageInfoEnable: true,
        imageDialogHeight: 500,
        imageDialogWidth: 700,
        //VIDEO
        videoAutoPlay: false,
        videoInfoEnable: true,
        videoNavBarEnable: true,
        videoDialogHeight: 500,
        videoDialogWidth: 700
    };

    var _opts = jQuery.extend({}, defaults, options);

    var _this = this;
    var _htmlContainer;
    var _controlHeight;
    var _controlWidth;
    var _tileImageStepSize = 64;
    var _activeSectionId = 'playit-nav-accordion-sec0';
    var _activeCategoryId = 'playit-nav-accordion-sec0-cat0';
    var _activeItemElement = null;
    var _currentSection;
    var _currentCategory;
    var _searchText;
    var _sections;
    var _dataSource;
    var _accordion;
    var _isResizingContent;
    var _htmlVideoSupported = (!!document.createElement('video').canPlayType);
    var _isChrome = ((jQuery.browser.webkit && /chrome/.test(navigator.userAgent.toLowerCase())) == true);
    var _isiOS = ((jQuery.browser.webkit && (/ipad/.test(navigator.userAgent.toLowerCase()) || /iphone/.test(navigator.userAgent.toLowerCase()) || /ipod/.test(navigator.userAgent.toLowerCase()))) == true);

    // generate a new id
    playit.globals.lastId++;
    var _idExt = (playit.globals.lastId > 1 ? playit.globals.lastId : "");

    var controlIds = {
        allContentId: "playit-all" + _idExt,
        navigationId: "playit-nav" + _idExt,
        accordionId: "playit-nav-accordion" + _idExt,
        mainAreaId: "playit-main-area" + _idExt,
        filesViewId: "playit-files-content" + _idExt,
        filesLoadingId: "playit-files-loading" + _idExt,

        //TOOLBAR
        toolBarId: "playit-toolbar" + _idExt,
        toolbarTitleId: "playit-toolbar-title" + _idExt,
        searchId: "playit-toolbar-search" + _idExt,
        searchBarId: "playit-toolbar-searchbar" + _idExt,
        searchClearId: "playit-toolbar-search-clear" + _idExt,
        switchBtnsId: "playit-toolbar-switchbtns" + _idExt,
        gridBtnId: "playit-toolbar-gridbtn" + _idExt,
        listBtnId: "playit-toolbar-listbtn" + _idExt,
        tileBtnId: "playit-toolbar-tilebtn" + _idExt,

        //LIST VIEW
        listBtnSetId: "playit-list-btnset" + _idExt,

        //TILE VIEW
        tileBtnSetId: "playit-tile-btnset" + _idExt,
        tileSliderId: "playit-tile-slider" + _idExt,
        tileSliderMinId: "playit-tile-slider-min" + _idExt,
        tileSliderMaxId: "playit-tile-slider-max" + _idExt,
        tileSortAlbumBtnId: "playit-tile-sort-albumbtn" + _idExt,
        tileSortArtistBtnId: "playit-tile-sort-artistbtn" + _idExt,
        tileSortTitleBtnId: "playit-tile-sort-titlebtn" + _idExt,

        //AUDIO
        audioPanelId: "playit-audio-panel" + _idExt,
        audioTagId: "playit-audio-tag" + _idExt,
        audioPlayId: "playit-audio-play" + _idExt,
        audioSliderId: "playit-audio-slider" + _idExt,
        audioBackId: "playit-audio-back" + _idExt,
        audioForwardId: "playit-audio-forward" + _idExt,
        audioThumbId: "playit-audio-thumb" + _idExt,
        audioTitleId: "playit-audio-title" + _idExt,
        audioAlbumId: "playit-audio-album" + _idExt,
        audioArtistId: "playit-audio-artist" + _idExt,
        audioBtnSetId: "playit-audio-buttons" + _idExt,
        audioLoopId: "playit-audio-loop" + _idExt,
        audioShuffleId: "playit-audio-shuffle" + _idExt,
        audioVolumeId: "playit-audio-volume" + _idExt,
        audioVolumeValId: "playit-audio-volume-val" + _idExt,
        audioMuteId: "playit-audio-mute" + _idExt,
        audioLogoId: "playit-audio-logo" + _idExt,
        audioTimeId: "playit-audio-time" + _idExt,
        audioInfoId: "playit-audio-infobtn" + _idExt,
        audioInfoDialogId: "playit-audio-info-dialog" + _idExt,

        //LINKS
        linkIframeId: "playit-link-iframe" + _idExt,

        //VIDEO
        videoDialogId: "playit-video-dialog" + _idExt,
        videoNavBarId: "playit-video-navbar" + _idExt,
        videoDataId: "playit-video-data" + _idExt,
        videoTagId: "playit-video-tag" + _idExt,
        videoIframeId: "playit-video-iframe" + _idExt,
        videoNextId: "playit-video-nextbtn" + _idExt,
        videoBackId: "playit-video-backbtn" + _idExt,
        videoInfoBtnId: "playit-video-infobtn" + _idExt,
        videoInfoBoxId: "playit-video-infobox" + _idExt,

        //IMAGE
        imageDialog: "playit-image-dialog" + _idExt,
        imageActiveId: "playit-image-active" + _idExt,
        imagePlayerId: "playit-image-player" + _idExt,
        imageBackGroupId: "playit-image-backgroup" + _idExt,
        imageBackId: "playit-image-back" + _idExt,
        imageInfoId: "playit-image-info" + _idExt,
        imageNextGroupId: "playit-image-nextgroup" + _idExt,
        imageNextId: "playit-image-next" + _idExt,
        imagePlayId: "playit-image-play" + _idExt,
        imageProgressId: "playit-image-progress" + _idExt,
        imageThumbsId: "playit-image-thumbs" + _idExt,
        imageThumbsSliderId: "playit-image-thumbs-slider" + _idExt,
        idExt: _idExt
    };
    //#endregion

    //========================================================================
    //AUDIO PLAYER
    //====================================================================== */
    //#region Audio Player
    this.audio = {

        //#region Private Fields
        _activeElement: null,
        _activeId: null,
        _playingId: null,
        _lastId: null,
        _player: null,
        _media: null,
        _initialized: false,
        _isMe: false,
        _paused: true,
        _muted: false,
        _looping: false,
        _shuffle: false,
        _tileSize: 64,
        _defaultArtistText: playit.lang.Unknown_Artist,
        _defaultAlbumText: playit.lang.Unknown_Album,
        _activeAlbum: null,
        _isSeeking: false,
        _isMovingBack: false,
        _isMovingForward: false,
        _isShuffling: false,
        _shuffleHistory: [],
        _shuffleHistoryPos: null,
        //#endregion

        //#region Private Methods
        _buildAudioPlayer: function ()
        {
            var html;
            var audioTag = document.createElement('audio');
            audioTag.setAttribute('src', "");
            audioTag.setAttribute('id', controlIds.audioTagId);
            audioTag.setAttribute('controls', 'controls');
            audioTag.setAttribute('class', 'playit-audio-tag');

            html =
			    "<table class='playit-audio-table' border='0'>" +
			    "<tr>" +
				    "<td>" +
					    "<table border='0' class='playit-audio-btns-table'>" +
					    "<tr>" +
						    "<td class='playit-audio-btns-cell' colspan='3'>" +
                                "<div id='" + controlIds.audioBtnSetId + "'>";
            if (_opts.audioInfoEnable)
            {
                html += "<button id='" + controlIds.audioInfoId + "'>" + playit.lang.obj_audio_info + "</button>";
            }
            html += "<button id='" + controlIds.audioBackId + "'>" + playit.lang.Previous + "</button>" +
							        "<button id='" + controlIds.audioPlayId + "'>" + playit.lang.Play + "</button>" +
							        "<button id='" + controlIds.audioForwardId + "'>" + playit.lang.Next + "</button>" +
									"<input type='checkbox' id='" + controlIds.audioShuffleId + "' /><label for='" + controlIds.audioShuffleId + "'>" + playit.lang.Shuffle + "</label>" +
							        "<input type='checkbox' id='" + controlIds.audioLoopId + "'/><label for='" + controlIds.audioLoopId + "'>" + playit.lang.Loop + "</label>" +
								"</div>" +
						    "</td>" +
					    "</tr>" +
					    "<tr align='center' class='playit-audio-btns-row-volume'>" +
						    "<td><div title=" + playit.lang.Volume + " id='" + controlIds.audioVolumeId + "' class='playit-audio-vol-slider'></div></td>" +
						    "<td><div id='" + controlIds.audioVolumeValId + "' class='playit-audio-vol-val'></div></td>" +
						    "<td class='playit-audio-vol-mute'><input type='checkbox' id='" + controlIds.audioMuteId + "'/><label for='" + controlIds.audioMuteId + "'>" + playit.lang.Mute + "</label></td>" +
					    "</tr>" +
					    "</table>" +
				    "</td><td style='width:100%'>" +
					    "<div class='playit-audio-info ui-widget-content ui-corner-all ui-state-default'>" +
							"<div class='playit-audio-logo' id='" + controlIds.audioLogoId + "'><div></div></div>" +
							"<table class='playit-audio-data' border='0'>" +
								  "<tr>" +
								    "<td align='right' width='40%'><img  id='" + controlIds.audioThumbId + "' /> </td>" +
									"<td align='left' width='60%'><div>" +
										"<span id='" + controlIds.audioTitleId + "'></span><br/>" +
										"<span id='" + controlIds.audioArtistId + "'></span><br/>" +
										"<span id='" + controlIds.audioAlbumId + "'></span>&nbsp;" +
									"</div></td>" +
								  "</tr>" +
							"</table>" +
						    "<table border='0' class='playit-audio-data-slider'><colgroup><col/><col style='width:50px;'/></colgroup>" +
							    "<tr>" +
								    "<td class='playit-audio-slider'><div id='" + controlIds.audioSliderId + "'></div></td>" +
								    "<td class='playit-audio-time' style='white-space:nowrap;'><span id='" + controlIds.audioTimeId + "' >-0:00</span></td>" +
							    "</tr>" +
						    "</table>" +
					    "</div>" +
				    "</td>" +
			    "</tr>" +
			    "</table>";

            jQuery("#" + controlIds.audioPanelId).html(html);
            jQuery("#" + controlIds.audioPanelId).prepend(audioTag);

            //Sliders
            jQuery("#" + controlIds.audioVolumeId).slider({ range: "min", value: 0, min: 0, max: 100, value: 100, slide: _this.audio._handleVolumeChanged });
            jQuery("#" + controlIds.audioSliderId).slider({ range: "min", value: 0, min: 0, max: 100, step: 0.01, slide: function () { _this.audio._isSeeking = true; }, stop: function (event, ui) { if (_this.audio._isMe) { _this.audio._player.setCurrentTime(ui.value); } else { _this.audio._player.currentTime = ui.value; } _this.audio._isSeeking = false; } });

            //Back, Play, Forward Buttons
            jQuery("#" + controlIds.audioShuffleId).button({ text: false, icons: { primary: "ui-icon-shuffle"} }).click(_this.audio.toggleShuffle);
            jQuery("#" + controlIds.audioLoopId).button({ text: false, icons: { primary: "ui-icon-arrowrefresh-1-n"} }).click(_this.audio.toggleLoop);
            jQuery("#" + controlIds.audioBackId).button({ text: false, icons: { primary: "ui-icon-seek-prev"} }).click(_this.audio.back);
            jQuery("#" + controlIds.audioPlayId).button({ text: false, icons: { primary: "ui-icon-play"} }).click(_this.audio.togglePlay);
            jQuery("#" + controlIds.audioForwardId).button({ text: false, icons: { primary: "ui-icon-seek-next"} }).click(_this.audio.forward);
            jQuery("#" + controlIds.audioMuteId).button({ text: false, icons: { primary: "ui-icon-volume-on"} }).click(_this.audio.toggleMute);
            if (_opts.audioInfoEnable)
            {
                jQuery("#" + controlIds.audioInfoId).button({ text: false, icons: { primary: "ui-icon-info"} }).click(_this.audio.showInfo);
            }
            jQuery("#" + controlIds.audioBtnSetId).buttonset();

            // update the default volume
            _this.audio.setVolume(1);
            _this.audio._player = audioTag;
            _this.audio._media = audioTag;
        },
        _setActive: function (nodeElement)
        {
            var node = nodeElement || null;
            _this.audio._lastId = _this.audio._activeId;

            var currentView = _currentCategory.get_currentView();
            switch (currentView)
            {
                //GRID                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                case playit.view.grid:

                    var nodeElement = (node == null) ? jQuery("#" + controlIds.filesViewId + " table tbody tr").get(0) || null : node;
                    jQuery(_this.audio._activeElement).removeClass('ui-state-focus playit-grid-item-on');
                    jQuery(nodeElement).addClass('ui-state-focus playit-grid-item-on');

                    _this.audio._activeElement = nodeElement;
                    _this.audio._activeId = jQuery(_this.audio._activeElement).attr("fileid");

                    break;

                //LIST                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                case playit.view.list:

                    var nodeElement = (node == null) ? jQuery("#" + controlIds.filesViewId + " div div.playit-list-item").get(0) : node;
                    jQuery(nodeElement).addClass('ui-state-focus playit-list-item-on playit-list-item-on-audio');
                    jQuery(_this.audio._activeElement).removeClass('ui-state-focus playit-list-item-on playit-list-item-on-audio');

                    _this.audio._activeElement = nodeElement;
                    _this.audio._activeId = jQuery(_this.audio._activeElement).attr("fileid");

                    break;

                //TILE                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                case playit.view.tile:

                    var $allTileItems = jQuery("#" + controlIds.filesViewId).children("div.playit-tile").children("div");
                    var nodeElement = (node == null) ? $allTileItems.get(0) || null : node;
                    var $node = jQuery(nodeElement);
                    _this.audio._activeId = $node.attr("fileid");
                    _this.audio._activeElement = nodeElement;

                    //Clear All Styles
                    $allTileItems.removeClass('ui-state-focus playit-tile-item-on-audio');
                    $allTileItems.find('span:first').removeClass('playit-tile-item-on-audio');

                    //Find Parent Album
                    var $parentNode = $allTileItems.filter("div[fileid='" + $node.attr("pid") + "']");
                    $parentNode.find('span:first').addClass('playit-tile-item-on-audio');
                    $parentNode.addClass('ui-state-focus playit-tile-item-on-audio');

                    break;
            }

            //Show/Hide audio info-enable
            var file = _getMediaFileById(_this.audio._activeId);
            if (file != null)
            {
                jQuery("#" + controlIds.audioInfoId).button({ disabled: (!file.get_infoEnable() || file.get_info().length == 0) || false });
            }

        },
        _resetActive: function ()
        {
            var newActiveElement = null;

            // check to see if the last selection exists here
            // if so then we can re-select it
            if (_this.audio._playingId != null)
            {
                var currentView = _currentCategory.get_currentView();
                switch (currentView)
                {
                    case playit.view.grid: // GRID
                        newActiveElement = (jQuery("#" + controlIds.filesViewId + " table tbody tr[fileid='" + _this.audio._playingId + "']").get(0) || null);
                        break;
                    case playit.view.list: // LIST
                        newActiveElement = (jQuery("#" + controlIds.filesViewId + " div div.playit-list-item[fileid='" + _this.audio._playingId + "']").get(0) || null);
                        break;
                    case playit.view.tile: // TILE
                        newActiveElement = (jQuery("#" + controlIds.filesViewId + " div.playit-tile div[fileid='" + _this.audio._playingId + "']").get(0) || null);
                        break;
                }
            }

            // reset the elements for the new view
            _this.audio._lastId = null;
            _this.audio._activeElement = null;
            _this.audio._activeId = null;
            _this.audio._shuffleHistory.length = 0;
            _this.audio._shuffleHistoryPos = null;

            // reset the active id
            if (newActiveElement != null)
            {
                _this.audio._setActive(newActiveElement);
            }
        },
        _updateAudioTimer: function ()
        {
            _this.audio._isMovingBack = false;

            var rem = 0;
            var mins = 0;
            var secs = 0;
            var durIsNaN = isNaN(_this.audio._media.duration); // iOS has a bug where the duration sometimes doesn't load so we handle it gracefully
            var duration = (durIsNaN ? 0 : _this.audio._media.duration);

            if (_this.audio._media.currentTime > 0)
            {
                if (durIsNaN)
                {
                    rem = parseInt(_this.audio._media.currentTime, 10);
                }
                else
                {
                    rem = parseInt(duration - _this.audio._media.currentTime, 10);
                }

                mins = Math.floor(rem / 60, 10);
                secs = rem - mins * 60;
            }

            jQuery("#" + controlIds.audioTimeId).text((durIsNaN ? '' : '-') + mins + ':' + (secs > 9 ? secs : '0' + secs));

            if (!_this.audio._isSeeking)
            {
                jQuery('#' + controlIds.audioSliderId).slider({ value: _this.audio._media.currentTime, max: duration });
            }

            if (_isiOS)
            {
                jQuery('#' + controlIds.audioSliderId).slider({ disabled: durIsNaN });
            }
        },
        _handleVolumeChanged: function (event, ui)
        {
            jQuery("#" + controlIds.audioVolumeValId).html(ui.value + "%");

            if (_this.audio._player)
            {
                if (_this.audio._isMe)
                {
                    _this.audio._player.setVolume(ui.value / 100);
                }
                else
                {
                    _this.audio._player.volume = (ui.value / 100);
                }
            }
        },
        _markError: function ()
        {
            if (_this.audio._activeElement)
            {
                jQuery(_this.audio._activeElement).addClass("playit-error");
            }

            if (_this.audio._isMovingBack)
            {
                _this.audio.back();
            }
            else
            {
                _this.audio.forward();
            }
        },
        _moveForward: function ()
        {
            if (_this.audio._looping)
            {
                _this.audio.play();
            }
            else if (_this.audio._shuffle)
            {
                _this.audio.shuffle();
            }
            else
            {
                _this.audio.forward();
            }
        },
        _attachEvents: function (media)
        {
            // hook up events
            _this.audio._media = media;
            var $audioPlayer = jQuery(media);
            $audioPlayer.bind("timeupdate", _this.audio._updateAudioTimer);
            $audioPlayer.bind("ended", function () { _this.ieThumbBar._updateStates(); _this.audio._moveForward(); });
            $audioPlayer.bind("error", _this.audio._markError);
            $audioPlayer.bind("play", function () { _this.ieThumbBar._updateStates(); _this.audio._playingId = _this.audio._activeId; });
            $audioPlayer.bind("pause", _this.ieThumbBar._updateStates);
            $audioPlayer.bind("volumechange", _this.ieThumbBar._updateStates);
        },
        _playTrack: function ()
        {
            // play the file
            _this.audio._player.play();
            _this.audio._paused = false;
        },
        _getFileElement: function (fileId)
        {
            return jQuery("#" + controlIds.filesViewId + " [fileid='" + fileId + "']").get(0);
        },
        _toggleAudioPanel: function (visible)
        {
            // hide/show the audio panel
            // we pause the music for consistency with Mozilla based browsers
            // http://stackoverflow.com/questions/298342/firefox-restarts-flash-movie-if-enclosing-div-properties-change

            var $audioPanel = jGet(controlIds.audioPanelId);

            if (visible)
            {
                if ($audioPanel.is(":hidden"))
                {
                    $audioPanel.show();
                }
            }
            else
            {
                if (!$audioPanel.is(":hidden"))
                {
                    _this.audio.pause(); // must pause before hiding for MEJS
                    $audioPanel.hide();
                }
            }
        },
        //#endregion

        //#region Public Methods
        back: function ()
        {
            _this.audio._isMovingBack = true;

            if (_this.audio._shuffle)
            {
                // play the last song from the shuffle history
                if (_this.audio._shuffleHistoryPos != null && _this.audio._shuffleHistoryPos > 0)
                {
                    _this.audio._shuffleHistoryPos--;
                    _this.audio._setActive(_this.audio._getFileElement(_this.audio._shuffleHistory[_this.audio._shuffleHistoryPos]));
                    _this.audio.play();
                }
            }
            else
            {
                // play the next song
                var prevElement = (_this.audio._activeElement != null ? (_this.audio._activeElement.previousSibling || _this.audio._activeElement.parentNode.childNodes[_this.audio._activeElement.parentNode.childNodes.length - 1]) : null);

                _this.audio._setActive(prevElement);
                _this.audio.play();
            }
        },
        forward: function ()
        {
            _this.audio._isMovingForward = true;

            if (_this.audio._shuffle)
            {
                if (_this.audio._shuffleHistoryPos != null && _this.audio._shuffleHistoryPos < (_this.audio._shuffleHistory.length - 1))
                {
                    // play the next song from the shuffle history
                    _this.audio._shuffleHistoryPos++;
                    _this.audio._setActive(_this.audio._getFileElement(_this.audio._shuffleHistory[_this.audio._shuffleHistoryPos]));
                    _this.audio.play();
                }
                else
                {
                    // add to the shuffle
                    _this.audio.shuffle();
                }
            }
            else
            {
                // play the next song
                var nextElement = (_this.audio._activeElement != null ? _this.audio._activeElement.nextSibling : null);

                _this.audio._setActive(nextElement);
                _this.audio.play();
            }
        },
        shuffle: function ()
        {
            // play the next song
            if (_this.audio._activeElement)
            {
                _this.audio._isShuffling = true;
                var nextElement = null;
                var shuffleTry = 0;
                var maxShuffleTry = 10;
                var nextFileId = null;

                // make sure the shuffle gets a different song then the current
                do
                {
                    var parent = _this.audio._activeElement.parentNode;
                    var rnd = Math.floor(Math.random() * (parent.childNodes.length + 1));
                    nextElement = parent.childNodes[rnd];
                    nextFileId = (nextElement != null ? (nextElement.getAttribute("fileid") || null) : null);
                    shuffleTry++;
                }
                while ((nextElement == _this.audio._activeElement || nextFileId == null) && shuffleTry < maxShuffleTry)


                _this.audio._setActive(nextElement);
                _this.audio.play();
            }
            else
            {
                // nothing to shuffle so got the first item
                _this.audio._setActive(null);
                _this.audio.play();
            }
        },
        play: function (initialize)
        {
            if (!_this.audio._initialized && initialize)
            {
                _this.audio._setActive(null);
                _this.audio.play();
            }

            // update the history for the audio when shuffle is on
            if (_this.audio._shuffle && (_this.audio._isMovingBack || _this.audio._isMovingForward || _this.audio._isShuffling))
            {
                if (_this.audio._isShuffling)
                {
                    if (_this.audio._shuffleHistory.length == 0 && _this.audio._lastId)
                    {
                        _this.audio._shuffleHistory.push(_this.audio._lastId);
                    }

                    _this.audio._shuffleHistory.push(_this.audio._activeId);
                    _this.audio._shuffleHistoryPos = (_this.audio._shuffleHistory.length - 1);
                }
            }
            else
            {
                // clear the history if a normal play
                _this.audio._shuffleHistory.length = 0;
                _this.audio._shuffleHistoryPos = null;
            }

            // reset the nav flats
            _this.audio._isMovingForward = false
            _this.audio._isShuffling = false;

            var file = _getMediaFileById(_this.audio._activeId);
            var row = _this.audio._activeElement;

            if (row == null)
            {
                return;
            }

            jQuery("#" + controlIds.audioPlayId).button("option", { label: playit.lang.Pause, icons: { primary: "ui-icon-pause"} });

            if (file.get_title().length != 0)
            {
                var $thumbImage = jQuery("#" + controlIds.audioThumbId);
                jQuery("#" + controlIds.audioLogoId).hide();
                jQuery("#" + controlIds.audioTitleId).text(file.get_title());
                jQuery("#" + controlIds.audioArtistId).text(file.get_artist());
                jQuery("#" + controlIds.audioAlbumId).text(file.get_album());
                $thumbImage.attr("src", file.get_thumb() || file.get_poster() || _imageSource + file.get_defaultImage());
                $thumbImage.show(500);
            }
            else
            {
                jQuery("#" + controlIds.audioLogoId).show();
            }

            // update the source
            if (_this.audio._isMe)
            {
                _this.audio._player.pause();
                _this.audio._player.setSrc(file.get_src());
                _this.audio._player.load();
            }
            else
            {
                _this.audio._player.src = file.get_src();
            }

            // initialize the player
            if (!_this.audio._initialized)
            {
                //MEDIAELEMENTJS
                if (typeof (MediaElement) != "undefined")
                {
                    _this.audio._player = new MediaElementPlayer("#" + controlIds.audioTagId, {
                        success: function (me) { _this.audio._attachEvents(me); if (!_isiOS) { _this.audio._playTrack(); } }
                    });
                    _this.audio._isMe = true;

                    if (_isiOS)
                    {
                        _this.audio._playTrack();
                    }
                }

                if (!_this.audio._isMe)
                {
                    _this.audio._attachEvents(_this.audio._player);
                    _this.audio._playTrack();
                }

                _this.audio._initialized = true;
            }
            else
            {
                _this.audio._playTrack();
            }

            // show the thumb bar
            _this.ieThumbBar.show();
        },
        pause: function ()
        {
            if (_this.audio._initialized && _this.audio._player && !_this.audio._paused)
            {
                _this.audio._paused = true;
                _this.audio._player.pause();
                jQuery("#" + controlIds.audioPlayId).button("option", { label: playit.lang.Play, icons: { primary: "ui-icon-play"} });
            }
        },
        togglePlay: function ()
        {
            if (_this.audio._player)
            {
                //Hit the play button
                if (!_this.audio._initialized)
                {
                    _this.audio._setActive(null);
                    _this.audio.play();
                }
                else
                {
                    if (_this.audio._paused)
                    {
                        _this.audio._paused = false;
                        _this.audio._player.play();
                        jQuery("#" + controlIds.audioPlayId).button("option", { label: playit.lang.Pause, icons: { primary: "ui-icon-pause"} });
                    }
                    else
                    {
                        _this.audio._paused = true;
                        _this.audio._player.pause();
                        jQuery("#" + controlIds.audioPlayId).button("option", { label: playit.lang.Play, icons: { primary: "ui-icon-play"} });
                    }
                }
            }
        },
        toggleMute: function ()
        {
            if (_this.audio._player)
            {
                if (_this.audio._muted)
                {
                    if (_this.audio._isMe)
                    {
                        _this.audio._player.setMuted(false);
                    }
                    else
                    {
                        _this.audio._player.muted = false;
                    }
                    _this.audio._muted = false;
                    jQuery("#" + controlIds.audioMuteId).button({ text: false, icons: { primary: "ui-icon-volume-on"} });
                }
                else
                {
                    if (_this.audio._isMe)
                    {
                        _this.audio._player.setMuted(true);
                    }
                    else
                    {
                        _this.audio._player.muted = true;
                    }
                    _this.audio._muted = true;
                    jQuery("#" + controlIds.audioMuteId).button({ text: false, icons: { primary: "ui-icon-volume-off"} });
                }
            }
        },
        toggleShuffle: function ()
        {
            if (_this.audio._shuffle)
            {
                _this.audio._shuffle = false;
            }
            else
            {
                _this.audio._shuffle = true;
            }
        },
        toggleLoop: function ()
        {
            if (_this.audio._looping)
            {
                _this.audio._looping = false;
            }
            else
            {
                _this.audio._looping = true;
            }
        },
        setVolume: function (volume)
        {
            var displayVol = Math.round(volume * 100);
            jQuery("#" + controlIds.audioVolumeId).slider("value", displayVol)
            jQuery("#" + controlIds.audioVolumeValId).html(displayVol + "%");

            if (_this.audio._player && _this.audio._player.volume != volume)
            {
                if (_this.audio._isMe)
                {
                    _this.audio._player.setVolume(volume);
                }
                else
                {
                    _this.audio._player.volume = volume;
                }
            }
        },
        setCurrentTime: function (time)
        {
            if (_this.audio._player && _this.audio._player.currentTime != time)
            {
                if (_this.audio._isMe)
                {
                    _this.audio._player.setCurrentTime(time);
                }
                else
                {
                    _this.audio._player.currentTime = time;
                }
            }
        },
        showInfo: function ()
        {
            if (_this.audio._activeElement != null)
            {
                var $item = jQuery(_this.audio._activeElement);
                var fileId = $item.attr("fileid");
                var file = _getMediaFileById(fileId);

                jQuery("#" + controlIds.audioInfoDialogId).dialog({
                    minHeight: _opts.audioInfoBoxHeight,
                    minWidth: _opts.audioInfoBoxWidth,
                    height: _opts.audioInfoBoxHeight + 70,
                    width: _opts.audioInfoBoxWidth + 40,
                    modal: _opts.audioInfoBoxModal,
                    title: file.get_title(),
                    resizable: _opts.audioInfoBoxResizable,
                    autoOpen: true,
                    close: function () { jQuery("#" + controlIds.audioInfoDialogId).empty() }
                });
                jQuery("#" + controlIds.audioInfoDialogId).html(file.get_info());
            }
            else
            {
                alert(playit.lang.msg_select_to_play);
            }
        }
        //#endregion

    };
    //#endregion


    //========================================================================
    //VIDEO PLAYER
    //======================================================================== 
    //#region Video Player
    this.video = {

        //#region Private Fields
        _activeElement: null,
        _infoBoxEnabled: false,
        _player: null,
        _media: null,
        _isMe: false,
        _paused: true,
        _muted: false,
        //#endregion

        //#region Private Methods
        _buildNavBar: function (file)
        {
            if (_opts.videoNavBarEnable)
            {
                var html;

                html = "<table border='0' class='playit-video-navbar ui-widget-content ui-corner-all ui-state-default' id='" + controlIds.videoNavBarId + "' align='center'>" +
						"<tr>" +
							"<td><button id='" + controlIds.videoBackId + "'>" + playit.lang.Back + "</button></td>";
                if (_opts.videoInfoEnable)
                {
                    html += "<td style='text-align:center'><input type='checkbox' id='" + controlIds.videoInfoBtnId + "'/> <label for='" + controlIds.videoInfoBtnId + "'>" + playit.lang.obj_video_info + "</label></td>";
                }
                html += "<td><button id='" + controlIds.videoNextId + "'>" + playit.lang.Next + "</button></td>" +
						"</tr>" +
					"</table>";

                jQuery("#" + controlIds.videoDialogId).append(html);

                var $back = jQuery("#" + controlIds.videoBackId).button({ text: true, icons: { primary: "ui-icon-circle-triangle-w"} }).click(function () { _this.video._moveBack() });
                if (_opts.videoInfoEnable)
                {
                    var $info = jQuery("#" + controlIds.videoInfoBtnId).button({ text: true }).click(function () { _this.video._showInfo() });
                    $info.button({ disabled: (!file.get_infoEnable() || file.get_info().length == 0) || false });
                }
                var $next = jQuery("#" + controlIds.videoNextId).button({ text: true, icons: { secondary: "ui-icon-circle-triangle-e"} }).click(function () { _this.video._moveForward() });
            }
        },
        _showInfo: function ()
        {
            var checkBox = jQuery("#" + controlIds.videoInfoBtnId);
            var $videoData = jQuery("#" + controlIds.videoDataId);
            var $videoInfoBox = jQuery("#" + controlIds.videoInfoBoxId);
            var file = _getMediaFileById(jQuery(_this.video._activeElement).attr("fileid"));

            if (checkBox.is(':checked'))
            {
                $videoInfoBox.html(file.get_info());
                $videoData.hide();
                $videoInfoBox.height(_opts.videoDialogHeight - 18);
                $videoInfoBox.show();
            }
            else
            {
                $videoInfoBox.hide();
                $videoData.show();
            }
        },
        _loadVideo: function (file)
        {
            var file = (file) ? file : null;
            var navBarOffset = (_opts.videoNavBarEnable) ? 0 : 40;
            var height = (file.get_height() || _opts.videoDialogHeight + navBarOffset);
            var width = (file.get_width() || _opts.videoDialogWidth);
            var path = file.get_src() || "";

            if (file == null)
            {
                return;
            }

            var $videoDialog = jQuery("#" + controlIds.videoDialogId);
            var $videoData = jQuery("<div id='" + controlIds.videoDataId + "' class='playit-video-data'></div>");
            var $videoInfoBox = jQuery("<div id='" + controlIds.videoInfoBoxId + "' class='playit-video-infodata ui-widget ui-corner-all ui-state-active'></div>");

            //LOCAL
            if (file.get_player() == "local")
            {
                var html;
                var sources = file.get_sources();

                html = "<video id='" + controlIds.videoTagId + "' width='" + width + "' height='" + height + "' controls='control' tabIndex='0'";

                if (!_htmlVideoSupported)
                {
                    if ((path == null || path.length == 0) && sources.length > 0)
                    {
                        path = sources[0].src;
                    }
                    html += " src='" + path + "'";
                }

                html += ">";

                if (_htmlVideoSupported)
                {
                    if (sources.length > 0)
                    {
                        for (var i = 0; i < sources.length; i++)
                        {
                            html += "<source type='" + sources[i].type + "' src='" + sources[i].src + (_isChrome ? playit.utils.randQueryString(sources[i].src) : "") + "' />";
                        }
                    }
                    else
                    {
                        html += "<source src='" + path + (_isChrome ? playit.utils.randQueryString(path) : "") + "' />";
                    }
                }

                html += "<object  width='" + width + "' height='" + height + "'  type='application/x-shockwave-flash' data='../../lib/mediaelementjs/flashmediaelement.swf' style='display:none;'>" +
						    "<param name='movie' value='../../lib/mediaelementjs/flashmediaelement.swf' />" +
						    "<param name='flashvars' value='controls=true&poster=myvideo.jpg&file=" + path + "'  />" +
						    "<img src='" + _imageSource + "play-512.png" + "' width='256' height='256' title='" + playit.lang.msg_no_playback + "' />" +
					    "</object>" +
                    "</video>";

                $videoData.append(html);
            }
            //REMOTE
            else
            {
                if (path.indexOf("http:"))
                {
                    playit.log.msg("WARNING", "\nUsing attribute player='remote' requires a valid media enclosure or external player such as YouTube. Direct media file access to a file such as an '.mp4' is not supported.  Use player='local' for direct file access. \nError was on video tag titled:'" + file.get_title() + "'");
                }

                //ie8 Workaround for 'Black screen error'
                jGet(controlIds.videoIframeId).hide();

                var iframe = document.createElement("iframe");
                var $jframe = jQuery(iframe);
                $jframe.attr("class", "playit-video-iframe");
                $jframe.attr("id", controlIds.videoIframeId);
                $jframe.height(height);
                $jframe.width(width);
                $jframe.attr("src", file.get_src());
                $jframe.attr("frameBorder", "0");
                $jframe.attr("scrolling", "no");
                $jframe.attr("tabIndex", "0");
                $videoData.html(iframe);
            }

            $videoDialog.html($videoData);
            $videoDialog.append($videoInfoBox);
            _this.video._buildNavBar(file);
            $videoDialog.dialog("option", "title", file.get_title());
            _this.video._player = document.getElementById(controlIds.videoTagId);

            // init the player
            _this.video._initPlayer(file);
        },
        _moveBack: function ()
        {
            var nextElement = (_this.video._activeElement != null ? (_this.video._activeElement.previousSibling || _this.video._activeElement.parentNode.childNodes[_this.video._activeElement.parentNode.childNodes.length - 1]) : null);

            //Loops around to last element
            if (nextElement == null)
            {
                var currentView = _currentCategory.get_currentView();
                switch (currentView)
                {
                    case playit.view.grid: nextElement = jQuery("#" + controlIds.filesViewId + " table tbody tr").last() || null; break;
                    case playit.view.list: nextElement = jQuery("#" + controlIds.filesViewId + " div div").last() || null; break;
                    case playit.view.tile: nextElement = jQuery("#" + controlIds.filesViewId + " div").last() || null; break;
                }

            }

            jQuery(nextElement).addClass('ui-state-focus playit-list-item-on');
            jQuery(_this.video._activeElement).removeClass('ui-state-focus playit-list-item-on');
            _this.video._activeElement = nextElement;


            var file = _getMediaFileById(jQuery(nextElement).attr("fileid"));
            _this.video._loadVideo(file);
            _this.video._showInfo();
        },
        _moveForward: function ()
        {

            var nextElement = _this.video._activeElement != null ? _this.video._activeElement.nextSibling : null;

            //Attempt to get first element in category
            if (nextElement == null)
            {
                var currentView = _currentCategory.get_currentView();
                switch (currentView)
                {
                    case playit.view.grid: nextElement = jQuery("#" + controlIds.filesViewId + " table tbody tr").get(0) || null; break;
                    case playit.view.list: nextElement = jQuery("#" + controlIds.filesViewId + " div div").get(0) || null; break;
                    case playit.view.tile: nextElement = jQuery("#" + controlIds.filesViewId + " div").get(0) || null; break;
                }
            }

            jQuery(nextElement).addClass('ui-state-focus playit-list-item-on');
            jQuery(_this.video._activeElement).removeClass('ui-state-focus playit-list-item-on');
            _this.video._activeElement = nextElement;

            var file = _getMediaFileById(jQuery(nextElement).attr("fileid"));
            _this.video._loadVideo(file);
        },
        _setActive: function (nodeElement)
        {
            var fileId = jQuery(nodeElement).attr("fileid");
            var file = _getMediaFileById(fileId);

            //Hightlight View item
            jQuery(nodeElement).addClass('ui-state-focus playit-list-item-on');
            jQuery(_this.video._activeElement).removeClass('ui-state-focus playit-list-item-on');
            _this.video._activeElement = nodeElement;

            _this.video._loadVideo(file);

            // show the video dialog
            jQuery("#" + controlIds.videoDialogId).dialog({
                height: _opts.videoDialogHeight + 120,
                width: _opts.videoDialogWidth + 40,
                modal: true,
                title: file.get_title(),
                resizable: false, //resize is flaky with flash player on some browsers
                resize: _this.video._resizeVideoDialog,
                close: _this.video._deactivate
            });
        },
        _initPlayer: function (file)
        {
            // convert to media element
            if (file.get_player() == "local")
            {
                _this.video._muted = false;
                _this.video._paused = !_opts.videoAutoPlay;

                if (typeof (MediaElement) != "undefined")
                {
                    _this.video._player = new MediaElementPlayer("#" + controlIds.videoTagId, {
                        success: function (me) { _this.video._attachEvents(me); if (_opts.videoAutoPlay) { me.play(); } },
                        error: function () { alert('Unable to load the video'); }
                    });

                    _this.video._isMe = true;
                }

                if (!_this.video._isMe)
                {
                    _this.video._attachEvents(_this.video._player);
                }

                _this.ieThumbBar.show();
            }
            else
            {
                _this.ieThumbBar.hide();
            }
        },
        _deactivate: function ()
        {
            _this.video.pause();
            _this.video._player = null;
            _this.video._media = null;
            _this.ieThumbBar.hide();
            jQuery("#" + controlIds.videoDialogId).html(""); // use html instead of empty or MEJS thrown an error
        },
        _autoPlayVideo: function ()
        {

        },
        _resizeVideoDialog: function ()
        {

            var $dialog = jQuery("#" + controlIds.videoDialogId);
            var $iframe = jQuery("#" + controlIds.videoIframeId) || null;
            var $video = jQuery("#" + controlIds.videoTagId) || null;
            var width = $dialog.width() - 20;
            var height = $dialog.height() - 40;

            if ($iframe != null)
            {
                $iframe.width(width);
                $iframe.height(height);
            }
            if ($video != null)
            {
                $video.width();
                $video.height(height);
                if (typeof (MediaElement) != "undefined")
                {
                    jQuery(".mejs-container").width(width);
                    jQuery(".mejs-container").height(height);
                }
            }

        },
        _attachEvents: function (media)
        {
            // hook up events
            _this.video._media = media;
            var $player = jQuery(media);
            $player.bind("ended", function () { _this.video._paused = true; _this.ieThumbBar._updateStates(); });
            $player.bind("play", function () { _this.video._paused = false; _this.ieThumbBar._updateStates(); });
            $player.bind("pause", function () { _this.video._paused = true; _this.ieThumbBar._updateStates(); });
            $player.bind("volumechange", function () { _this.video._muted = _this.video._media.muted; _this.ieThumbBar._updateStates(); });

            if (_isChrome)
            {
                $player.bind("stalled", _this.video._resetStalledVideo);
            }
        },
        _resetStalledVideo: function ()
        {
            alert("Unable to play the video. Please try again.");
            var vid = jQuery(this)[0];
            vid.load();
            vid.pause();

            if (!_this.video._paused)
            {
                vid.play();
            }
        },
        //#endregion

        //#region Public Methods
        play: function ()
        {
            if (_this.video._player)
            {
                _this.video._player.play();
            }
        },
        pause: function ()
        {
            if (_this.video._player)
            {
                _this.video._player.pause();
            }
        },
        togglePlay: function ()
        {
            if (_this.video._paused)
            {
                _this.video.play();
            }
            else
            {
                _this.video.pause();
            }
        },
        toggleMute: function ()
        {
            if (_this.video._player)
            {
                if (_this.video._muted)
                {
                    if (_this.video._isMe)
                    {
                        _this.video._player.setMuted(false);
                    }
                    else
                    {
                        _this.video._player.muted = false;
                    }
                    _this.video._muted = false;
                }
                else
                {
                    if (_this.video._isMe)
                    {
                        _this.video._player.setMuted(true);
                    }
                    else
                    {
                        _this.video._player.muted = true;
                    }
                    _this.video._muted = true;
                }
            }
        }
        //#endregion
    }
    //#endregion


    //========================================================================
    //IMAGE PLAYER
    //======================================================================== 
    //#region Image Player
    this.image = {

        //#region Private Fields
        _activeImageThumb: null,
        _activeFileObj: null,
        _paused: true,
        _progressBarHandle: null,
        _isVisible: false,
        _groupIndex: 0,
        _totalGroups: 0,
        _slideWidth: 0,
        _dialog: null,
        _lastThumb: null,
        //#endregion

        //#region Private Methods
        _setActive: function (nodeElement)
        {
            var fileId = jQuery(nodeElement).attr("fileid");
            var file = _getMediaFileById(fileId);
            var height = (file.get_height() || _opts.imageDialogHeight);
            var width = (file.get_width() || _opts.imageDialogWidth);
            _this.image._dialog = jQuery("#" + controlIds.imageDialog);

            var html = "<div class='playit-image-active' id='" + controlIds.imageActiveId + "' tabIndex='0'></div>" +
				"<div class='playit-image-player ui-widget-content ui-corner-all ui-state-default' id='" + controlIds.imagePlayerId + "'>" +
				"<table border='0' style='width:100%;'>" +
					"<tr><td colspan='3'><div id='" + controlIds.imageProgressId + "' class='playit-image-progressbar'></div></td></tr>" +
					"<tr>" +
						"<td>";

            if (_opts.imageInfoEnable)
            {
                html += "<input type='checkbox' id='" + controlIds.imageInfoId + "' /><label for='" + controlIds.imageInfoId + "'>" + playit.lang.obj_image_info + "</label>";
            }

            html += "<button id='" + controlIds.imageBackGroupId + "'>" + playit.lang.Previous_Group + "</button>" +
							"<button id='" + controlIds.imageBackId + "'>" + playit.lang.Previous_Image + "</button>" +
						"</td>" +
						"<td><div class='playit-image-player-thumbs ui-widget-content ui-corner-all' id='" + controlIds.imageThumbsId + "'><div class='playit-image-player-thumbs-slider' id='" + controlIds.imageThumbsSliderId + "'></div></div></td>" +
						"<td>" +
							"<button id='" + controlIds.imageNextId + "'>" + playit.lang.Next_Image + "</button>" +
							"<button id='" + controlIds.imageNextGroupId + "'>" + playit.lang.Next_Group + "</button>" +
							"<button id='" + controlIds.imagePlayId + "'>" + playit.lang.Play + "</button>" +
						"</td>" +
					"</tr>" +
				"</table>" +
			"</div>";

            jQuery("#" + controlIds.imageDialog).append(html);
            jQuery("#" + controlIds.imageActiveId).height(height - 50);


            //info button
            if (_opts.imageInfoEnable)
            {
                var $info = jQuery("#" + controlIds.imageInfoId);
                $info.button({ text: false, icons: { primary: "ui-icon-info"} }).click(function () { _this.image._showInfo() });
                jQuery("#" + controlIds.imagePlayerId).width(560);
                jQuery("#" + controlIds.imagePlayerId).css({ width: '570px', marginLeft: '-285px' });
            }
            else
            {
                jQuery("#" + controlIds.imagePlayerId).css({ width: '530px', marginLeft: '-265px' });
            }

            jQuery("#" + controlIds.imageProgressId).progressbar({ value: 0 }); ;

            jQuery("#" + controlIds.imageBackGroupId).button({ text: false, icons: { primary: "ui-icon-circle-arrow-w"} }).click();
            jQuery("#" + controlIds.imageBackId).button({ text: false, icons: { primary: "ui-icon-circle-triangle-w"} }).click();
            jQuery("#" + controlIds.imageNextId).button({ text: false, icons: { primary: "ui-icon-circle-triangle-e"} }).click();
            jQuery("#" + controlIds.imageNextGroupId).button({ text: false, icons: { primary: "ui-icon-circle-arrow-e"} }).click();
            jQuery("#" + controlIds.imagePlayId).button({ text: false, icons: { primary: "ui-icon-play"} }).click();

            jQuery("#" + controlIds.imageBackId).click(function () { _this.image.pause(); _this.image.back(); });
            jQuery("#" + controlIds.imageNextId).click(function () { _this.image.pause(); _this.image.forward(); });
            jQuery("#" + controlIds.imagePlayId).click(function () { _this.image.togglePlay(); });
            jQuery("#" + controlIds.imageBackGroupId).click(function () { _this.image.pause(); _this.image.backGroup(); });
            jQuery("#" + controlIds.imageNextGroupId).click(function () { _this.image.pause(); _this.image.forwardGroup(); });

            _this.image._createThumbGroup();
            _this.image._setPreview(fileId);
            _this.image._setThumbPreview(fileId);

            _this.image._dialog.dialog({
                minHeight: 300,
                minWidth: 600,
                height: height + 70,
                width: width + 40,
                modal: true,
                title: file.get_title(),
                resize: _this.image._resizeDialog,
                open: _this.image._resizeDialog,
                close: function () { _this.image.pause(); _this.image._isVisible = false; _this.image._dialog.empty(); }
            });

            _this.image._dialog.dialog('open');

            // calculate the total groups based on the last image
            _this.image._slideWidth = jQuery('#' + controlIds.imageThumbsSliderId).parent().outerWidth();
            _this.image._groupIndex = 0;
            _this.image._isVisible = true;

            // move to the selected image
            _this.image._groupIndex = (_this.image._getSliderThumbGroup(_this.image._activeImageThumb[0]) - 1);
            if (_this.image._groupIndex > 0)
            {
                var $slider = jQuery("#" + controlIds.imageThumbsSliderId);
                $slider.css("left", (_this.image._groupIndex > 0 ? (-($slider.parent().outerWidth() - 6) * _this.image._groupIndex) : 0));
            }

            if (_opts.imageAutoPlay)
            {
                _this.image.play();
            }
        },
        _showInfo: function ()
        {

            _this.image.pause();
            var checkBox = jQuery("#" + controlIds.imageInfoId);
            var $activeInfo = jQuery("<div class='playit-image-infodata ui-widget ui-corner-all ui-state-active'>" + _activeFileObj.get_info() + "</div>");
            var $activeArea = jQuery("#" + controlIds.imageDialog + " div.playit-image-active");
            var $activeCell = jQuery("#" + controlIds.imageDialog + " div.playit-image-active-cell");
            var $dialog = jQuery("#" + controlIds.imageDialog);

            if (checkBox.is(':checked'))
            {
                $activeCell.fadeOut(200, function ()
                {
                    $activeArea.append($activeInfo);
                    $activeInfo.height($dialog.height() - 100);
                }
				);
                _this.image._dialog.dialog("option", "resizable", false);
            }
            else
            {
                jQuery('div.playit-image-infodata').remove();
                $activeCell.fadeIn(600);
                _this.image._dialog.dialog("option", "resizable", true);
            }
        },
        _createThumbGroup: function ()
        {
            var $thumbRow = jQuery('#' + controlIds.imageThumbsSliderId);
            var images = _data._getCategoryMediaFiles(_currentCategory);
            var thumbImg;
            for (var i = 0; i < images.length; i++)
            {
                var group = Math.ceil(((i + 1) / _opts.imageSlidesThumbCount));
                var file = images[i];
                var title = file.get_title().replace(/'/g, "\i");
                thumbImg = document.createElement("img");
                thumbImg.src = (file.get_thumb() || file.get_poster() || file.get_defaultImage());
                thumbImg.title = title;
                thumbImg.alt = title;
                thumbImg.setAttribute('fileid', file.get_id());
                thumbImg.setAttribute("thumbIndex", i);
                thumbImg.setAttribute("thumbGroup", group);
                $thumbRow.append(thumbImg);

                // store the highest group #
                _this.image._totalGroups = group;
            }

            _this.image._lastThumb = thumbImg;

            jQuery("#" + controlIds.imageThumbsSliderId).find('img').click(function ()
            {
                _this.image._setPreview(this.getAttribute("fileid"));
                _this.image._setThumbPreview(this.getAttribute("fileid"));
                _this.image.pause()
            });
        },
        _setThumbPreview: function (id)
        {
            var $thumb = jQuery("#" + controlIds.imageThumbsSliderId).find('img[fileid="' + id + '"]');
            $thumb.addClass("ui-state-highlight ui-corner-all  playit-image-player-thumbs-active");

            if (_this.image._activeImageThumb != null)
            {
                _this.image._activeImageThumb.removeClass("ui-state-highlight ui-corner-all playit-image-player-thumbs-active");
            }

            _this.image._activeImageThumb = $thumb;
        },
        _setPreview: function (id)
        {
            var file = _getMediaFileById(id) || null;
            _activeFileObj = file;
            if (file != null)
            {
                //Info Data
                var $infoBtn = jQuery("#" + controlIds.imageInfoId);

                if ($infoBtn.is(':checked'))
                {
                    $infoBtn.click();
                }
                else
                {
                    _this.image._dialog.dialog("option", "resizable", true);
                }

                $infoBtn.button("option", "disabled", (!file.get_infoEnable() || file.get_info().length == 0) || false);

                jQuery("#" + controlIds.imageActiveId).find('img').fadeOut(500);
                var title = file.get_title().replace(/'/g, "\i");
                var source = file.get_src() || file.get_defaultImage();
                var $image = jQuery("<img src='" + _opts.loadingIconSource + "' title='" + title + "' style='visibility:hidden;' />");
                var $imageContent = jQuery("<div class='playit-image-active-cell' style='background:url(" + _opts.loadingIconSource + ") center center no-repeat;'><span></span></div>").append($image);

                jQuery('#' + controlIds.imageActiveId).html($imageContent);
                $image.load(function () { _this.image._resizeDialog(); }).attr("src", source);
                _this.image._dialog.dialog("option", "title", title);
            }
        },
        _resizeDialog: function ()
        {
            var $dialog = jQuery("#" + controlIds.imageDialog);
            var $activeImage = jQuery("#" + controlIds.imageActiveId);
            var $image = $activeImage.find('img');
            var $info = jQuery('div.playit-image-infodata');
            var $imageContent = jQuery("div.playit-image-active-cell");
            var $dlgHeight = $dialog.height();

            if ($image.css("visibility") == "hidden")
            {
                $image.css("visibility", "visible");
                $image.css("display", "none");
                $image.fadeIn('fast');
            }

            //Preivew Resize
            var fillHeight = ($dlgHeight - 80);
            var fillWidth = ($dialog.width() - 10);

            //Scale image
            $image.css('max-height', fillHeight);
            $image.css('max-Width', fillWidth);

            //Resize info height if visible
            $info.height($dlgHeight - 100);
            $activeImage.height($dlgHeight - 100);
        },
        _runPlayTimer: function ()
        {
            var onComplete = function ()
            {
                _this.image.forward();
                _this.image._runPlayTimer();
            };

            if (_this.image._progressBarHandle)
            {
                clearInterval(_this.image._progressBarHandle);
            }

            jQuery("#" + controlIds.imageProgressId).progressbar("option", "value", 0);
            _this.image._progressBarHandle = playit.utils.progressBarMove(controlIds.imageProgressId, _opts.imageSlidesInterval, onComplete);
        },
        _resetTimer: function ()
        {
            if (!_this.image._paused)
            {
                if (_this.image._progressBarHandle != null)
                {
                    clearInterval(_this.image._progressBarHandle);
                }
            }
        },
        _animateSlider: function ()
        {
            var $slider = jQuery("#" + controlIds.imageThumbsSliderId);

            $slider.animate({
                left: (_this.image._groupIndex > 0 ? (-($slider.parent().outerWidth() - 6) * _this.image._groupIndex) : 0)
            });
        },
        _getSliderThumbGroup: function (element)
        {
            return (element.getAttribute("thumbGroup"));
        },
        //#endregion

        //#region Public Methods
        play: function ()
        {
            if (_this.image._isVisible)
            {
                _this.image._paused = false;
                _this.image._resetTimer();
                _this.image._runPlayTimer();
                jQuery("#" + controlIds.imagePlayId).button("option", { label: playit.lang.Pause, icons: { primary: "ui-icon-pause"} });
            }
        },
        pause: function ()
        {
            if (_this.image._isVisible)
            {
                _this.image._resetTimer();
                _this.image._paused = true;
                jQuery("#" + controlIds.imagePlayId).button("option", { label: playit.lang.Play, icons: { primary: "ui-icon-play"} });
            }
        },
        togglePlay: function ()
        {
            if (_this.image._isVisible)
            {
                if (_this.image._paused)
                {
                    _this.image.play();
                }
                else
                {
                    _this.image.pause();
                }
            }
        },
        back: function ()
        {
            if (_this.image._isVisible)
            {
                var loopToBack = false;

                // show the previous image
                var prevElement = (_this.image._activeImageThumb != null ? _this.image._activeImageThumb[0].previousSibling : null);

                if (!prevElement)
                {
                    // select the first element
                    prevElement = _this.image._activeImageThumb[0].parentNode.childNodes[_this.image._activeImageThumb[0].parentNode.childNodes.length - 1];
                }

                // move to the previous group
                var newGroupIndex = (_this.image._getSliderThumbGroup(prevElement) - 1);

                if (newGroupIndex != _this.image._groupIndex)
                {
                    _this.image._groupIndex = (newGroupIndex + 1);
                    _this.image.backGroup();
                }

                // update the image
                var id = jQuery(prevElement).attr("fileid");
                _this.image._setThumbPreview(id);
                _this.image._setPreview(id);
            }
        },
        forward: function ()
        {
            if (_this.image._isVisible)
            {
                var loopToFront = false;

                // play the next song
                var nextElement = (_this.image._activeImageThumb != null ? _this.image._activeImageThumb[0].nextSibling : null);

                if (!nextElement)
                {
                    // select the first element
                    nextElement = jQuery("#" + controlIds.imageThumbsSliderId).find('img')[0];
                }

                // move to the next group
                var newGroupIndex = (_this.image._getSliderThumbGroup(nextElement) - 1);

                if (newGroupIndex != _this.image._groupIndex)
                {
                    _this.image._groupIndex = (newGroupIndex - 1);
                    _this.image.forwardGroup();
                }

                // update the image
                var id = jQuery(nextElement).attr("fileid");
                _this.image._setThumbPreview(id);
                _this.image._setPreview(id);
            }
        },
        backGroup: function ()
        {
            if (_this.image._isVisible)
            {
                if (_this.image._groupIndex > 0)
                {
                    _this.image._groupIndex--;
                    _this.image._animateSlider();
                }
            }
        },
        forwardGroup: function ()
        {
            if (_this.image._isVisible)
            {
                if (_this.image._groupIndex < (_this.image._totalGroups - 1))
                {
                    _this.image._groupIndex++;
                    _this.image._animateSlider();
                }
            }
        }
        //#endregion
    },
    //#endregion


    //========================================================================
    //IE THUMBAR PLAYER
    //========================================================================
    //#region IE Thumb Bar Player
    this.ieThumbBar = {

        //#region Private Fields
        _iePlayButton: null,
        _iePlayButtonPlayStyle: null,
        _iePlayButtonPauseStyle: null,
        _ieMuteButton: null,
        _ieMuteButtonOnStyle: null,
        _ieMuteButtonOffStyle: null,
        _isVisible: false,
        //#endregion

        //#region Private Methods
        _build: function ()
        {
            // set the IE9 buttons
            if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) >= 9 && window.external && window.external.msIsSiteMode())
            {
                _this.ieThumbBar._ieMuteButton = window.external.msSiteModeAddThumbBarButton(_imageSource + "icons/volume.ico", "Mute");
                _this.ieThumbBar._iePlayButton = window.external.msSiteModeAddThumbBarButton(_imageSource + "icons/pause.ico", "Pause");

                _this.ieThumbBar._ieMuteButtonMuteStyle = window.external.msSiteModeAddButtonStyle(_this.ieThumbBar._ieMuteButton, _imageSource + "icons/volume.ico", "Mute")
                _this.ieThumbBar._ieMuteButtonMutedStyle = window.external.msSiteModeAddButtonStyle(_this.ieThumbBar._ieMuteButton, _imageSource + "icons/mute.ico", "Unmute")
                _this.ieThumbBar._iePlayButtonPlayStyle = window.external.msSiteModeAddButtonStyle(_this.ieThumbBar._iePlayButton, _imageSource + "icons/play.ico", "Play")
                _this.ieThumbBar._iePlayButtonPauseStyle = window.external.msSiteModeAddButtonStyle(_this.ieThumbBar._iePlayButton, _imageSource + "icons/pause.ico", "Pause")

                document.addEventListener('msthumbnailclick', function (e)
                {
                    switch (e.buttonID)
                    {
                        case _this.ieThumbBar._iePlayButton:
                            _this.ieThumbBar._togglePlay();
                            break;
                        case _this.ieThumbBar._ieMuteButton:
                            _this.ieThumbBar._toggleMute();
                            break;
                    }
                }, false);

                window.external.msSiteModeShowThumbBar();
                _this.ieThumbBar.hide();
            }
        },
        _updateStates: function ()
        {
            if (_this.ieThumbBar._isVisible && jQuery.browser.msie && parseInt(jQuery.browser.version, 10) >= 9 && window.external && window.external.msIsSiteMode())
            {
                if (_this.ieThumbBar._iePlayButton != null)
                {
                    if (_this.ieThumbBar._isPaused())
                    {
                        window.external.msSiteModeShowButtonStyle(_this.ieThumbBar._iePlayButton, _this.ieThumbBar._iePlayButtonPlayStyle);
                    }
                    else
                    {
                        window.external.msSiteModeShowButtonStyle(_this.ieThumbBar._iePlayButton, _this.ieThumbBar._iePlayButtonPauseStyle);
                    }
                }

                if (_this.ieThumbBar._ieMuteButton != null)
                {
                    if (_this.ieThumbBar._isMuted())
                    {
                        window.external.msSiteModeShowButtonStyle(_this.ieThumbBar._ieMuteButton, _this.ieThumbBar._ieMuteButtonMutedStyle);
                    }
                    else
                    {
                        window.external.msSiteModeShowButtonStyle(_this.ieThumbBar._ieMuteButton, _this.ieThumbBar._ieMuteButtonMuteStyle);
                    }
                }
            }
        },
        _isPaused: function ()
        {
            var isPaused = false;

            if (_currentCategory.get_type() == playit.type.audio)
            {
                isPaused = _this.audio._paused;
            }
            else if (_currentCategory.get_type() == playit.type.video)
            {
                isPaused = _this.video._paused;
            }

            return isPaused;
        },
        _isMuted: function ()
        {
            var isMuted = false;

            if (_currentCategory.get_type() == playit.type.audio)
            {
                isMuted = _this.audio._muted;
            }
            else if (_currentCategory.get_type() == playit.type.video)
            {
                isMuted = _this.video._muted;
            }

            return isMuted;
        },
        _togglePlay: function ()
        {
            if (_currentCategory.get_type() == playit.type.audio)
            {
                if (_this.audio._player)
                {
                    if (_this.audio._player.ended)
                    {
                        _this.audio.setCurrentTime(0.0);
                        _this.audio.play();
                    }
                    else
                    {
                        _this.audio.togglePlay();
                    }
                }
            }
            else if (_currentCategory.get_type() == playit.type.video)
            {
                _this.video.togglePlay();
            }
        },
        _toggleMute: function ()
        {
            if (_currentCategory.get_type() == playit.type.audio)
            {
                _this.audio.toggleMute();
            }
            else if (_currentCategory.get_type() == playit.type.video)
            {
                _this.video.toggleMute();
            }
        },
        //#endregion

        //#region Public Methods
        show: function ()
        {
            if (!_this.ieThumbBar._isVisible)
            {
                _this.ieThumbBar._isVisible = true;

                if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) >= 9 && window.external && window.external.msIsSiteMode())
                {
                    if (_this.ieThumbBar._iePlayButton)
                    {
                        window.external.msSiteModeUpdateThumbBarButton(_this.ieThumbBar._iePlayButton, true, true);
                    }

                    if (_this.ieThumbBar._ieMuteButton)
                    {
                        window.external.msSiteModeUpdateThumbBarButton(_this.ieThumbBar._ieMuteButton, true, true);
                    }

                    _this.ieThumbBar._updateStates();
                }
            }
        },
        hide: function ()
        {
            if (_this.ieThumbBar._isVisible)
            {
                _this.ieThumbBar._isVisible = false;

                if (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) >= 9 && window.external && window.external.msIsSiteMode())
                {
                    if (_this.ieThumbBar._iePlayButton != null)
                    {
                        window.external.msSiteModeUpdateThumbBarButton(_this.ieThumbBar._iePlayButton, true, false);
                    }

                    if (_this.ieThumbBar._ieMuteButton != null)
                    {
                        window.external.msSiteModeUpdateThumbBarButton(_this.ieThumbBar._ieMuteButton, true, false);
                    }
                }
            }
        }
        //#endregion
    };
    //#endregion


    //========================================================================
    //GRID VIEWS
    //========================================================================	
    //#region Grid Views
    var createGridHeader = function (category)
    {
        var columnSort = _data._getCategorySort(_currentCategory);
        var sortColumn = columnSort["column"];
        var sortDir = columnSort["direction"] || "asc";
        var fileTable = document.createElement("table");
        fileTable.setAttribute("border", "0");
        fileTable.setAttribute("cellpadding", "0");
        fileTable.setAttribute("cellspacing", "0");
        var fileTableHeader = document.createElement("thead");
        fileTable.appendChild(fileTableHeader);
        var fileTableBody = document.createElement("tbody");

        fileTable.appendChild(fileTableBody);

        // create the table row
        var headerRow = document.createElement("tr");
        var fields = _data._getCategoryGridDefinition(category).fields;
        headerRow.className = "ui-widget-header";

        //Active Cell
        var activeCell = document.createElement("th");
        activeCell.className = "playit-grid-header-title-on"
        headerRow.appendChild(activeCell);

        if (fields != null && fields.length > 0)
        {
            for (var i = 0; i < fields.length; i++)
            {
                var field = fields[i];
                var fieldMatch = field.get_match();
                var metaDataCell = document.createElement("th");
                metaDataCell.className = "playit-grid-header-title";
                metaDataCell.id = "playit-grid-header_" + fieldMatch + _idExt || i;

                var width = field.get_width();
                if (width != null)
                {
                    metaDataCell.style.width = width;
                }

                sortLink = document.createElement("div");
                sortLink.href = "javascript:void(0);";
                sortLink.setAttribute("sort", fieldMatch);
                sortLink.appendChild(document.createTextNode(field.get_display() || ""));

                //Sort Image
                if (fieldMatch == sortColumn)
                {
                    var imgSort = document.createElement("img");
                    imgSort.src = (sortDir == "asc") ? _imageSource + "sort-asc.png" : _imageSource + "sort-desc.png";
                    sortLink.appendChild(imgSort);
                }

                metaDataCell.appendChild(sortLink);
                headerRow.appendChild(metaDataCell);
                jQuery(sortLink).bind("click", function () { changeSort(this.getAttribute("sort")); });
            }
        }
        fileTableHeader.appendChild(headerRow);
        return fileTable;
    };
    var createGridCommonView = function (files)
    {
        //TABLE HEADER
        var searchResultCount = 0;
        var contentContainer = document.createElement("div");
        var rowContainer = createGridHeader(_currentCategory);
        var fileTableBody = rowContainer.tBodies[0];
        contentContainer.appendChild(rowContainer);
        contentContainer.className = "playit-grid ui-widget-content";

        //BUILD ITEMS 
        for (var i = 0; i < files.length; i++)
        {
            if (matchesSearch(files[i]))
            {
                searchResultCount++;
                fileRow = createGridCommonRow(files[i]);
                fileTableBody.appendChild(fileRow);
            }
        }

        //OUTPUT RESULTS
        (searchResultCount == 0 && _isSearching())
			? showNoSearchResults()
			: jQuery("#" + controlIds.filesViewId).html(contentContainer);
    }
    var createGridCommonRow = function (file)
    {
        var type = file.get_type();
        var gridRow = document.createElement("tr");
        gridRow.setAttribute("fileid", file.get_id());
        jQuery(gridRow).hover(function () { jQuery(this).addClass('ui-state-hover') }, function () { jQuery(this).removeClass('ui-state-hover') })
					   .click(function () { setItemActive(this) });

        //active item cell (audio player only)
        var activeCell = document.createElement("td");
        gridRow.appendChild(activeCell);


        var fields = _data._getCategoryGridDefinition(_currentCategory).fields;
        if (fields != null && fields.length > 0)
        {
            for (var i = 0; i < fields.length; i++)
            {
                var metaDataCell = document.createElement("td");
                metaDataCell.appendChild(document.createTextNode(file.getProperty(fields[i].get_match()) || ""));
                gridRow.appendChild(metaDataCell);
            }
        }

        return gridRow;
    };
    var createGridLinkView = function (files)
    {
        //TABLE HEADER
        var searchResultCount = 0;
        var contentContainer = document.createElement("div");
        var rowContainer = createGridHeader(_currentCategory);
        var fileTableBody = rowContainer.tBodies[0];
        contentContainer.appendChild(rowContainer);
        contentContainer.className = "playit-grid ui-widget-content ui-corner-all";

        //BUILD ITEMS 
        for (var i = 0; i < files.length; i++)
        {
            file = files[i];
            if (matchesSearch(file))
            {
                searchResultCount++;
                fileRow = createGridLinkRow(file);
                fileTableBody.appendChild(fileRow);
            }
        }

        //OUTPUT RESULTS
        (searchResultCount == 0 && _isSearching())
			? showNoSearchResults()
			: jQuery("#" + controlIds.filesViewId).html(contentContainer);
    }
    var createGridLinkRow = function (file)
    {
        var type = file.get_type();
        var gridRow = document.createElement("tr");
        gridRow.setAttribute("fileid", file.get_id());
        jQuery(gridRow).hover(function () { jQuery(this).addClass('ui-state-hover') }, function () { jQuery(this).removeClass('ui-state-hover') })
					   .click(function () { setItemActive(this) });

        //active item cell (audio player only)
        var activeCell = document.createElement("td");
        gridRow.appendChild(activeCell);

        var fields = _data._getCategoryGridDefinition(_currentCategory).fields;
        if (fields != null && fields.length > 0)
        {
            for (var i = 0; i < fields.length; i++)
            {
                var metaDataCell = document.createElement("td");
                metaDataCell.appendChild(document.createTextNode(file.getProperty(fields[i].get_match()) || ""));
                gridRow.appendChild(metaDataCell);
            }
        }

        return gridRow;
    };
    //#endregion


    //========================================================================
    //LIST VIEWS
    //========================================================================	
    //#region List Views
    var toggleListSort = function (button)
    {
        //TODO: create common method with toggleTileSort
        var $button = jQuery(button);
        _data._setCategorySort(_currentCategory, $button.attr('sort').toLowerCase());
        changeSort($button.attr('sort'));
    }
    var createListSortBar = function ()
    {
        var fields = _data._getCategoryListDefinition(_currentCategory).fields;
        var matchFound = false;
        var empty = document.createTextNode("");

        if (fields != null && fields.length > 0)
        {
            var columnSort = _data._getCategorySort(_currentCategory);
            var currentSort = columnSort["column"];
            var currentDir = columnSort["direction"] || "asc";
            var div = document.createElement("div");
            var span = document.createElement("span");
            div.className = "playit-list-sortbar ui-state-default ui-corner-all";
            span.setAttribute("classname", "playit-list-btnset");
            span.setAttribute("id", controlIds.listBtnSetId);
            span.setAttribute("title", playit.lang.Sort_By);

            for (var i = 0; i < fields.length; i++)
            {
                var fieldMatch = fields[i].get_match();
                var sortDisplay = fields[i].get_sortDisplay();
                if (fieldMatch != null && sortDisplay != null)
                {
                    matchFound = true;
                    var controlId = "playit-list-sortitem_" + fieldMatch + _idExt;
                    var $button = jQuery("<input type='radio' id='" + controlId + "'  name='listsortgrp' sort='" + fieldMatch + "' />");
                    var $label = jQuery("<label for='" + controlId + "'>" + sortDisplay + "</label>");

                    jQuery(span).append($button);
                    jQuery(span).append($label);

                    $button.button({ text: true }).click(function () { toggleListSort(this) });

                    var icon = currentDir.toLowerCase() == "asc" ? 'ui-icon-triangle-1-n' : 'ui-icon-triangle-1-s';
                    $button.button("option", "icons", { primary: (fieldMatch == currentSort) ? icon : "" });
                }
            }
            div.appendChild(span);
        }

        return (matchFound) ? div : empty;
    }
    var createListCommonView = function (files)
    {
        //TABLE HEADER
        var searchResultCount = 0;
        var contentContainer = document.createElement("div");
        var fields = _data._getCategoryListDefinition(_currentCategory).fields;
        contentContainer.className = "playit-list";

        var sortBar = createListSortBar();
        contentContainer.appendChild(sortBar);

        //BUILD ITEMS 
        for (var i = 0; i < files.length; i++)
        {
            if (matchesSearch(files[i]))
            {
                searchResultCount++;
                fileRow = createListCommonRow(files[i], fields);
                contentContainer.appendChild(fileRow);
            }
        }

        //OUTPUT RESULTS
        if (searchResultCount == 0 && _isSearching())
        {
            showNoSearchResults();
        }
        else
        {
            jQuery("#" + controlIds.filesViewId).html(contentContainer);
            jQuery("#" + controlIds.listBtnSetId).buttonset();
        }
    }
    var createListCommonRow = function (file, fields)
    {
        var type = file.get_type();

        var gridRow = document.createElement("div");
        gridRow.className = "playit-list-item ui-widget-content ui-corner-all";
        gridRow.setAttribute("fileid", file.get_id());
        jQuery(gridRow).hover(function () { jQuery(this).addClass('ui-state-hover') }, function () { jQuery(this).removeClass('ui-state-hover') })
					   .click(function () { setItemActive(this) });

        var tblList = document.createElement("table");
        var tblBody = document.createElement("tbody");
        var row0 = document.createElement("tr");
        var col1 = document.createElement("td");
        gridRow.appendChild(tblList);
        tblList.appendChild(tblBody);
        tblBody.appendChild(row0);
        row0.appendChild(col1);

        //thumb cell
        var imgEle = document.createElement("img");
        imgEle.src = file.get_thumb() || file.get_poster() || _imageSource + file.get_defaultImage();
        imgEle.alt = file.get_title();
        col1.appendChild(imgEle);

        // detail cell
        var col2 = document.createElement("td");
        row0.appendChild(col2);

        if (fields != null && fields.length > 0)
        {
            for (var i = 0; i < fields.length; i++)
            {
                col2.appendChild(document.createTextNode(fields[i].get_display() || ""));
                col2.appendChild(document.createTextNode(file.getProperty(fields[i].get_match()) || "Unknown"));
                col2.appendChild(document.createElement("br"));
            }
        }

        return gridRow;
    };
    var createListAudioView = function (files)
    {
        var searchResultCount = 0;
        var contentContainer = document.createElement("div");
        var fields = _data._getCategoryListDefinition(_currentCategory).fields;
        var sortBar = createListSortBar();
        contentContainer.appendChild(sortBar);


        //BUILD ITEMS
        for (var i = 0; i < files.length; i++)
        {
            if (matchesSearch(files[i]))
            {
                searchResultCount++;
                fileRow = createListAudioRow(files[i], fields);
                contentContainer.appendChild(fileRow);
            }
        }

        //OUTPUT RESULTS
        if (searchResultCount == 0 && _isSearching())
        {
            showNoSearchResults();
        }
        else
        {
            jQuery("#" + controlIds.filesViewId).html(contentContainer);
            jQuery("#" + controlIds.listBtnSetId).buttonset();
        }

    }
    var createListAudioRow = function (file, fields)
    {
        var type = _currentCategory.get_type();
        var listRow = document.createElement("div");
        listRow.className = "playit-list-item ui-widget-content ui-corner-all";
        listRow.setAttribute("fileid", file.get_id());
        jQuery(listRow).hover(function () { jQuery(this).addClass('ui-state-hover') }, function () { jQuery(this).removeClass('ui-state-hover') })
					   .click(function () { setItemActive(this) });


        //Create Table
        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");
        var row0 = document.createElement("tr");
        var col0 = document.createElement("td");
        var col1 = document.createElement("td");
        listRow.appendChild(tbl);
        tbl.appendChild(tblBody);
        tblBody.appendChild(row0);
        row0.appendChild(col0);
        row0.appendChild(col1);

        //Insert Thumb
        var imgEle = document.createElement("img");
        imgEle.src = file.get_thumb() || file.get_poster() || _imageSource + file.get_defaultImage();
        imgEle.alt = file.get_title();
        col1.appendChild(imgEle);

        //Output Fields
        var col2 = document.createElement("td");
        row0.appendChild(col2);
        if (fields != null && fields.length > 0)
        {
            for (var i = 0; i < fields.length; i++)
            {
                col2.appendChild(document.createTextNode(fields[i].get_display() || ""));
                col2.appendChild(document.createTextNode(file.getProperty(fields[i].get_match()) || "Unknown"));
                col2.appendChild(document.createElement("br"));
            }
        }

        // re-select the active audio
        if (_this.audio._activeId != null && file.get_id() == _this.audio._activeId)
        {
            _this.audio._setActive(listRow);
        }

        return listRow;
    }
    //#endregion


    //========================================================================
    //TILE VIEWS
    //========================================================================	
    //#region Tile Views
    var toggleTileSort = function (button)
    {
        var $button = jQuery(button);
        _data._setCategorySort(_currentCategory, $button.attr('sort').toLowerCase());
        changeSort($button.attr('sort'));
    }
    var createTileSortBar = function ()
    {

        //GROUP BY BAR
        var type = _currentCategory.get_type();
        var html = "<div class='playit-tile-sortbar'>" +
		"<table border='0' class='ui-state-default ui-corner-all' align='center'>" +
			"<tr align='top'>" +
			 "<td style='width:100%' text-align:center'>" +
			  "<span id='" + controlIds.tileBtnSetId + "' class='playit-tile-btnset' title='" + playit.lang.Sort_By + "'>";

        //AUDIO VIEW
        if (type == playit.type.audio)
        {
            html += "<input type='radio' id='" + controlIds.tileSortAlbumBtnId + "'  name='audiogrp' sort='album' /><label for='" + controlIds.tileSortAlbumBtnId + "'>" + playit.lang.Album + "</label>" +
					"<input type='radio' id='" + controlIds.tileSortArtistBtnId + "' name='audiogrp' sort='artist' /><label for='" + controlIds.tileSortArtistBtnId + "'>" + playit.lang.Artist + "</label>";
        }
        //COMMON VIEWS
        else
        {
            html += "<input type='radio' id='" + controlIds.tileSortTitleBtnId + "'  sort='title' /><label for='" + controlIds.tileSortTitleBtnId + "'>" + playit.lang.Title + "</label>";
        }
        html += "</span>" +
			 "</td>" +
			 "<td><div class='playit-tile-slider-smsquare ui-state-default' id='" + controlIds.tileSliderMinId + "'></div></td>" +
			 "<td><div class='playit-tile-slider' id='" + controlIds.tileSliderId + "'></div></td>" +
			 "<td><div class='playit-tile-slider-lgsquare ui-state-default' id='" + controlIds.tileSliderId + "'></div></td>" +
			 "</tr>" +
		 "</table>" +
		 "</div>";

        //SLIDER RESULTS  Tile Sizes:64, 128, 192, 256
        var tileDef = _data._getCategoryTileDefinition(_currentCategory);
        var activeSize = _currentCategory.get_tileItemSize() || tileDef.itemSize;
        jQuery("#" + controlIds.filesViewId).html(html);
        jQuery("#" + controlIds.tileSliderId).slider({ range: "min", value: activeSize, min: 64, max: 256, step: _tileImageStepSize, slide: function (event, ui) { scaleTileImages(event, ui) } });
        var catSort = _data._getCategorySort(_currentCategory);
        var currentDir = (catSort["direction"] || "asc");
        var icon = currentDir.toLowerCase() == "asc" ? 'ui-icon-triangle-1-n' : 'ui-icon-triangle-1-s';

        //AUDIO VIEWS
        if (type == playit.type.audio)
        {
            var currentSort = (catSort && catSort["column"] && catSort["column"] == "artist" ? "artist" : "album");

            var $albumButton = jQuery("#" + controlIds.tileSortAlbumBtnId).button({ text: true }).click(function () { toggleTileSort(this) });
            var $artistButton = jQuery("#" + controlIds.tileSortArtistBtnId).button({ text: true }).click(function () { toggleTileSort(this) });
            jQuery("#" + controlIds.tileBtnSetId).buttonset();
            //Set sort direction arrow
            $artistButton.button("option", "icons", { primary: (currentSort == 'artist') ? icon : "" });
            $albumButton.button("option", "icons", { primary: (currentSort == 'album') ? icon : "" });
        }
        //COMMON VIEWS
        else
        {
            var $titleButton = jQuery("#" + controlIds.tileSortTitleBtnId).button({ text: true }).click(function () { toggleTileSort(this) });
            $titleButton.button("option", "icons", { primary: icon });

        }
    }
    var createTileCommonView = function (files)
    {
        //SORTBAR
        createTileSortBar();

        //BUILD ITEMS 
        var searchResultCount = 0;
        var contentContainer = document.createElement("div");
        contentContainer.className = "playit-tile";

        var files = sortGenericFiles(files);

        for (var i = 0; i < files.length; i++)
        {
            if (matchesSearch(files[i]))
            {
                searchResultCount++;
                fileRow = createTileCommonCell(files[i]);
                contentContainer.appendChild(fileRow);
            }
        }

        //OUTPUT RESULTS
        if (searchResultCount == 0 && _isSearching())
        {
            showNoSearchResults();
        }
        document.getElementById(controlIds.filesViewId).appendChild(contentContainer);
        scaleTileImages();
    }
    var createTileCommonCell = function (file)
    {
        var tileItem = document.createElement("div");
        tileItem.setAttribute("fileid", file.get_id());
        jQuery(tileItem).hover(function () { jQuery(this).addClass('ui-state-hover') }, function () { jQuery(this).removeClass('ui-state-hover') }).click(function () { setItemActive(this) });

        //image
        var img_src = (file.get_poster() || null);
        var imgEle = document.createElement("img");
        imgEle.alt = imgEle.title = file.get_title();
        imgEle.src = (img_src != null) ? img_src : _imageSource + file.get_defaultImage();
        tileItem.appendChild(imgEle);

        // title
        var artistText = document.createElement("span");
        artistText.appendChild(document.createTextNode(file.get_title() || "Unknown Title"));
        tileItem.appendChild(artistText);

        return tileItem;
    }
    var createTileAudioView = function (files)
    {
        //SORT BAR
        createTileSortBar();

        //BUILD ITEMS 
        var searchResultCount = 0;
        var contentContainer = document.createElement("div");
        var catSort = _data._getCategorySort(_currentCategory);
        var sortColumn = (catSort["column"] || "album");
        var albums = _data._getCategoryAudioAlbums(_currentCategory);
        contentContainer.className = "playit-tile";

        switch (sortColumn)
        {
            case "album": albums.sort(sortAudioByAlbum); break;
            case "artist": albums.sort(sortAudioByArtist); break;
            default: albums.sort(sortAudioByAlbum);
        }

        for (var i = 0; i < albums.length; i++)
        {
            var tracks = albums[i].get_tracks();
            var currentAlbum = albums[i].get_id();
            var lastAlbum = null;
            var firstTrackInAlbum;
            var albumImageSet = false;

            for (var x = 0; x < tracks.length; x++)
            {
                var currentTrack = tracks[x];

                if (matchesSearch(currentTrack))
                {
                    searchResultCount++;
                    if (currentAlbum != lastAlbum)
                    {
                        var parentID = currentTrack.get_id();
                        firstTrackInAlbum = createTileAudioCell(currentTrack, true, parentID);
                        contentContainer.appendChild(firstTrackInAlbum);

                        var poster = currentTrack.get_poster();
                        albumImageSet = (poster != null && poster.length > 0);
                    }
                    else
                    {
                        contentContainer.appendChild(createTileAudioCell(currentTrack, false, parentID));

                        // set the album image if it isn't already set
                        if (!albumImageSet)
                        {
                            var poster = currentTrack.get_poster();
                            albumImageSet = (poster != null && poster.length > 0);

                            if (albumImageSet)
                            {
                                jQuery(firstTrackInAlbum).find("img").attr("src", poster);
                            }
                        }
                    }
                    lastAlbum = currentAlbum;
                }
            }
        }

        if (searchResultCount == 0 && _isSearching())
        {
            showNoSearchResults();
        }
        document.getElementById(controlIds.filesViewId).appendChild(contentContainer);

        //Hide non-active tracks: ie8 workaround
        var $allTileItems = jQuery("div.playit-tile").children("div");
        $allTileItems.filter("div[visible='false']").hide();
        scaleTileImages();

        //SET ACTIVE ITEM
        if (_this.audio._activeId != null)
        {
            var newActiveNode = $allTileItems.filter("div[fileid='" + _this.audio._activeId + "']").get(0);
            _this.audio._setActive(newActiveNode);
        }
    }
    var createTileAudioCell = function (file, show, parentId)
    {
        var tileItem = document.createElement("div");

        tileItem.setAttribute("fileid", file.get_id());
        tileItem.setAttribute("pid", parentId);

        if (show)
        {
            //image
            var img_src = (file.get_poster() || null);
            var imgEle = document.createElement("img");
            imgEle.alt = imgEle.title = file.get_title();
            imgEle.src = (img_src != null) ? img_src : _imageSource + file.get_defaultImage();
            tileItem.appendChild(imgEle);

            // album
            var albumText = document.createElement("span");
            albumText.appendChild(document.createTextNode(file.get_album() || _this.audio._defaultAlbumText));
            tileItem.appendChild(albumText);

            // artist
            var artistText = document.createElement("span");
            artistText.appendChild(document.createTextNode(file.get_artist() || _this.audio._defaultArtistText));
            tileItem.appendChild(artistText);

            jQuery(tileItem).hover(function () { jQuery(this).addClass('ui-state-hover') }, function () { jQuery(this).removeClass('ui-state-hover') }).click(function () { setItemActive(this) });
        }
        else
        {
            tileItem.setAttribute("visible", "false");
        }

        return tileItem;
    };
    var scaleTileImages = function (event, ui)
    {
        //Tile Sizes:64, 128, 192, 256
        //ie8 doesn't work without !important on initial load
        var $allTileItems = jQuery("div.playit-tile").children("div");
        var tileDef = _data._getCategoryTileDefinition(_currentCategory);
        var activeSize = _currentCategory.get_tileItemSize() || tileDef.itemSize;

        //Slider Triggered
        if (ui)
        {
            if (ui.value > activeSize)
            {
                $allTileItems.attr('style', "width: " + (activeSize + _tileImageStepSize) + "px !important");
                $allTileItems.height(activeSize + _tileImageStepSize);
            }
            else if (ui.value < activeSize)
            {
                $allTileItems.attr('style', "width: " + (activeSize - _tileImageStepSize) + "px !important");
                $allTileItems.height(activeSize - _tileImageStepSize);
            }
            _currentCategory.set_tileItemSize(ui.value);
        }
        //Function Triggered
        else
        {
            $allTileItems.attr('style', "width:" + activeSize + "px !important");
            $allTileItems.height(activeSize);
        }

        $allTileItems.filter("div[visible='false']").hide();
    }

    //#endregion


    //========================================================================
    //SEARCH ROUTINES
    //========================================================================
    //#region Search Routines
    var updateSearch = function (text)
    {
        if (text == _opts.toolbarSearchText)
        {
            text = "";
        }

        if (text && text.length > 0)
        {
            jQuery("#" + controlIds.searchClearId).css("visibility", "visible");
        }
        else
        {
            jQuery("#" + controlIds.searchClearId).css("visibility", "hidden");
        }

        _searchText = text.toLowerCase();

        buildCategoryHtml(_currentCategory.get_id());
    };
    var clearSearch = function ()
    {
        updateSearch(_opts.toolbarSearchText);
        jQuery("#" + controlIds.searchId).removeClass('playit-search-text-active');
        jQuery("#" + controlIds.searchId).attr("value", _opts.toolbarSearchText);
    };
    var matchesSearch = function (file)
    {
        var match = true;

        if (_isSearching())
        {
            match = ((file.get_title() && file.get_title().toLowerCase().indexOf(_searchText) > -1) ||
                     (file.get_type() == playit.type.audio && file.get_artist() && file.get_artist().toLowerCase().indexOf(_searchText) > -1) ||
                     (file.get_type() == playit.type.audio && file.get_album() && file.get_album().toLowerCase().indexOf(_searchText) > -1));
        }

        return match;
    };
    var _isSearching = function ()
    {
        return (_searchText != null && _searchText.length > 0);
    }
    var _getSectionById = function (id)
    {
        for (var i = 0; i < _sections.length; i++)
        {
            if (_sections[i].get_id() == id)
            {
                return _sections[i];
            }
        }

        return null;
    }
    var _getCategoryById = function (id)
    {
        for (var sIndex = 0; sIndex < _sections.length; sIndex++)
        {
            var categories = _data._getCategories(_sections[sIndex]);

            if (categories != null)
            {
                for (var cIndex = 0; cIndex < categories.length; cIndex++)
                {
                    if (categories[cIndex].get_id() == id)
                    {
                        return categories[cIndex];
                    }
                };
            }
        }

        return null;
    }
    var _getMediaFileById = function (id)
    {
        for (var sIndex = 0; sIndex < _sections.length; sIndex++)
        {
            var categories = _data._getCategories(_sections[sIndex]);

            if (categories != null)
            {
                for (var cIndex = 0; cIndex < categories.length; cIndex++)
                {
                    var files = _data._getCategoryMediaFiles(categories[cIndex]);
                    if (files)
                    {
                        for (var fIndex = 0; fIndex < files.length; fIndex++)
                        {
                            if (files[fIndex].get_id() == id)
                            {
                                return files[fIndex];
                            }
                        };
                    }
                };
            }
        }

        return null;
    }
    var _getAudioAlbumByFileId = function (fileId)
    {
        var file = _getMediaFileById(fileId);
        var albums = _data._getCategoryAudioAlbums(_currentCategory);
        for (var i = 0; i < albums.length; i++)
        {
            if (file.get_albumId() == albums[i].get_id())
            {
                return albums[i];
            }
        }
    }
    var showNoSearchResults = function ()
    {
        var noResults;
        var resultText = playit.utils.sprintf(playit.lang.msg_nosearch_results, _searchText, _currentCategory.get_name());
        noResults = document.createElement("div");
        noResults.className = "playit-files-noresults";
        noResults.appendChild(document.createTextNode(resultText));
        jQuery("#" + controlIds.filesViewId).html(noResults);
    }
    //#endregion


    //========================================================================
    //SORT ROUTINES
    //========================================================================
    //#region Sort Routines
    var sortFiles = function (file1, file2)
    {
        var sort = 0;
        var catSort = _data._getCategorySort(_currentCategory);
        var sortColumn = catSort["column"];
        var sortDir = (catSort["direction"] || "asc");
        var file1Prop = (file1.getProperty(sortColumn) || "");
        var file2Prop = (file2.getProperty(sortColumn) || "");

        if (sortDir == "DESC" || sortDir == "desc")
        {
            if (file1Prop > file2Prop)
            {
                sort = -1;
            }
            else if (file1Prop < file2Prop)
            {
                sort = 1;
            }
        }
        else
        {
            if (file1Prop > file2Prop)
            {
                sort = 1;
            }
            else if (file1Prop < file2Prop)
            {
                sort = -1;
            }
        }

        return sort;
    };
    var sortAudioByAlbum = function (file1, file2)
    {
        var sort = 0;
        var catSort = _data._getCategorySort(_currentCategory);
        var sortDir = (catSort["direction"] || "asc");
        var file1Prop = file1.get_album();
        var file2Prop = file2.get_album();
        if (sortDir == "DESC" || sortDir == "desc")
        {
            sort = (file1Prop > file2Prop) ? -1 : 1;
        }
        else
        {
            sort = (file1Prop > file2Prop) ? 1 : -1;
        }
        return sort;
    };
    var sortAudioByArtist = function (file1, file2)
    {
        var sort = 0;
        var catSort = _data._getCategorySort(_currentCategory);
        var sortDir = (catSort["direction"] || "asc");
        var file1Prop = file1.get_artist();
        var file2Prop = file2.get_artist();
        if (sortDir == "DESC" || sortDir == "desc")
        {
            sort = (file1Prop > file2Prop) ? -1 : 1;
        }
        else
        {
            sort = (file1Prop > file2Prop) ? 1 : -1;
        }
        return sort;
    }
    var changeSort = function (column)
    {
        var catSort = _data._getCategorySort(_currentCategory);

        if (catSort["column"] == column)
        {
            var sortDir = (catSort["direction"] || "asc");
            _data._setCategorySort(_currentCategory, null, (sortDir == "asc" ? "desc" : "asc"));
        }
        else
        {
            _data._setCategorySort(_currentCategory, column, "asc");
        }

        buildCategoryHtml(_currentCategory.get_id());
    };
    var sortGenericFiles = function (files)
    {
        // apply any sorting
        var catSort = _data._getCategorySort(_currentCategory);
        var sortColumn = catSort["column"];
        var sortDir = (catSort["direction"] || "asc");
        if (sortColumn && sortDir)
        {
            files.sort(sortFiles);
        }
        return files;
    }
    //#endregion


    //========================================================================
    //GENERAL
    //========================================================================
    //#region General
    var setViewStates = function ()
    {
        var catSource = _currentCategory.get_linkSrc();

        var playitDefaultView = playit.utils.getEnumByName(playit.view, _opts.viewDefault);
        var categoryDefaultView = playit.utils.getEnumByName(playit.view, _currentCategory.get_viewDefault());
        var defaultView = _currentCategory.get_currentView() || categoryDefaultView || playitDefaultView || playit.view.grid;
        var currentView = (catSource != null && catSource != "") ? playit.view.link : defaultView;

        var gridDefintion = _data._getCategoryGridDefinition(_currentCategory);
        var listDefinition = _data._getCategoryListDefinition(_currentCategory);
        var tileDefinition = _data._getCategoryTileDefinition(_currentCategory);

        var $buttonSet = jQuery("#" + controlIds.switchBtnsId);
        var $gridButton = jQuery("#" + controlIds.gridBtnId);
        var $listButton = jQuery("#" + controlIds.listBtnId);
        var $tileButton = jQuery("#" + controlIds.tileBtnId);
        var $srchBox = jQuery("#" + controlIds.searchBarId);
        var $srchInput = jQuery("#" + controlIds.searchId);

        var hideButton = function (id)
        {
            jQuery("input[id='" + id + "']", $buttonSet).hide();
            jQuery("label[for='" + id + "']", $buttonSet).hide();
        }

        var showButton = function (id)
        {
            jQuery("input[id='" + id + "']", $buttonSet).show();
            jQuery("label[for='" + id + "']", $buttonSet).show();
        }

        jQuery("label", $buttonSet).removeClass('ui-state-active');
        gridDefintion.enable ? showButton($gridButton.attr('id')) : hideButton($gridButton.attr('id'));
        listDefinition.enable ? showButton($listButton.attr('id')) : hideButton($listButton.attr('id'));
        tileDefinition.enable ? showButton($tileButton.attr('id')) : hideButton($tileButton.attr('id'));

        switch (currentView)
        {
            case playit.view.grid:
                switch (true)
                {
                    case gridDefintion.enable: currentView = playit.view.grid; jQuery("label[for='" + $gridButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    case listDefinition.enable: currentView = playit.view.list; jQuery("label[for='" + $listButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    case tileDefinition.enable: currentView = playit.view.tile; jQuery("label[for='" + $tileButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    default: currentView = playit.view.none;
                }
                break;

            case playit.view.list:
                switch (true)
                {
                    case listDefinition.enable: currentView = playit.view.list; jQuery("label[for='" + $listButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    case gridDefintion.enable: currentView = playit.view.grid; jQuery("label[for='" + $gridButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    case tileDefinition.enable: currentView = playit.view.tile; jQuery("label[for='" + $tileButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    default: currentView = playit.view.none;
                }
                break;

            case playit.view.tile:
                switch (true)
                {
                    case tileDefinition.enable: currentView = playit.view.tile; jQuery("label[for='" + $tileButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    case listDefinition.enable: currentView = playit.view.list; jQuery("label[for='" + $listButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    case gridDefintion.enable: currentView = playit.view.grid; jQuery("label[for='" + $gridButton.attr('id') + "']", $buttonSet).addClass('ui-state-active'); break;
                    default: currentView = playit.view.none;
                }
                break;

            case playit.view.link:
                currentView = playit.view.link;
                break;
        }

        $gridButton.button({ disabled: (currentView == playit.view.link) });
        $listButton.button({ disabled: (currentView == playit.view.link) });
        $tileButton.button({ disabled: (currentView == playit.view.link) });

        if (currentView == playit.view.link)
        {
            $srchInput.attr("disabled", "disabled");
            $srchInput.addClass("playit-search-text-disable");
            $srchBox.addClass("playit-search-text-disable");
        }
        else if ($srchBox.hasClass("playit-search-text-disable")) // only reset it if is disabled otherwise it looses focus in IE   
        {
            $srchInput.removeAttr("disabled");
            $srchInput.removeClass("playit-search-text-disable");
            $srchBox.removeClass("playit-search-text-disable");
        }

        _currentCategory.set_currentView(currentView);

    }
    var showConfigMessage = function (message)
    {
        var noResults;
        noResults = jQuery("<div class='playit-config-msg ui-state-highlight ui-corner-all'>" + message + "</div>");
        jQuery("#" + controlIds.filesViewId).html(noResults);
        jQuery("#" + controlIds.filesViewId).show();
    }
    var setItemActive = function (item)
    {
        var $item = jQuery(item);
        var fileId = $item.attr("fileid");
        var file = _getMediaFileById(fileId);
        var type = file.get_type() || -1;
        _activeItemElement = $item;

        switch (type)
        {
            case playit.type.audio:
                _this.audio._setActive(item);
                _this.audio.play();
                break;
            case playit.type.image:
                _this.image._setActive(item);
                break;
            case playit.type.link:
                window.open(file.get_src(), file.get_target(), file.get_features());
                break;
            case playit.type.video:
                _this.video._setActive(item);
                break;
        }
    }
    var onRenderComplete = function ()
    {
        //CallBack Method
        if (typeof (options.onRenderComplete) == 'function')
        {
            options.onRenderComplete(this);
        }
    }
    var onCategoryClick = function (atag)
    {
        _activeCategoryId = atag.id;
        _currentSection.set_currentCategory(_activeCategoryId);
        jQuery("div#playit-nav" + _idExt + " a[class='playit-nav-link ui-state-focus']").removeClass('ui-state-focus');
        jQuery(atag).addClass('ui-state-focus');
        buildCategoryHtml(atag.getAttribute("catid"));
        resizeContent();
    }
    var onWindowResize = function ()
    {
        if (!_isResizingContent)
        {
            var contentSize = getContentSize(true);

            if (_opts.autoFill)
            {
                // resize the content
                if (_currentCategory)
                {
                    switch (_currentCategory.get_type())
                    {
                        case playit.type.audio:
                            jQuery("#" + controlIds.filesViewId).height(contentSize.height - 113);
                            break;
                        case playit.type.image:
                        case playit.type.link:
                        case playit.type.video:
                            jQuery("#" + controlIds.filesViewId).height(contentSize.height - 23);
                            break;
                    }
                }

                // resize the accordion
                jQuery("#" + controlIds.accordionId + " div.ui-accordion-content").height("auto");
                jQuery("#" + controlIds.accordionId).accordion("resize");

                // resize the iframe
                if (_isiOS && _opts.iOSIframeAsObject)
                {
                    jQuery("#" + controlIds.linkIframeId + " object").height(contentSize.height - 20);
                }
                else
                {
                    jQuery("#" + controlIds.linkIframeId + " iframe").height(contentSize.height - 20);
                }
            }

            resizeContent();
            onNavigationResize();
        }
    }
    var getContentSize = function (reload)
    {
        if (_controlHeight == null || _controlWidth == null || reload)
        {
            var $allContent = jQuery('#' + controlIds.allContentId);
            _controlHeight = $allContent.height();
            _controlWidth = $allContent.width();
        }

        return { height: _controlHeight, width: _controlWidth };
    }
    var onNavigationResize = function ()
    {
        //Search Input
        if (_opts.toolbarSearchWidth == "auto")
        {
            var navWidth = jQuery('#' + controlIds.accordionId).width();
            jQuery('#' + controlIds.searchBarId).width(navWidth - 40);
            jQuery('#' + controlIds.searchId).width(navWidth - 65);
        }
        else
        {
            jQuery('#' + controlIds.searchId).width(_opts.toolbarSearchWidth - 20);
        }
    }
    var resizeContent = function (targetWidth, skipTimeout)
    {
        targetWidth = targetWidth || jQuery(".playit-main-table-left").width();
        var handleWidth = jQuery("div.playit-main-table div.ui-resizable-handle").outerWidth();
        var contentSize = getContentSize();
        jQuery(".playit-main-table-right").css("marginLeft", targetWidth + handleWidth);

        // do it once more for good measure
        if (!skipTimeout)
        {
            setTimeout(function () { resizeContent(null, true); }, 5);
        }
    }
    var setTheme = function (theme, version)
    {
        /// Sets the theme to the google cdn theme file.
        theme = theme || _opts.themeName;
        version = version || _opts.themeVersion;

        var themeUrl = _opts.themeUrl.replace("{0}", version).replace("{1}", theme);
        var linkCss = document.getElementById("playit-jquery-ui-css");
        if (linkCss != null)
        {
            var currentUrl = jQuery(linkCss).attr("href");
            if (currentUrl != themeUrl)
            {
                jQuery(linkCss).attr("href", themeUrl);
                // wait for the theme to download and then redraw
                setTimeout(function ()
                {
                    for (var i = 0; i < playit.globals.accordionIdList.length; i++)
                    {
                        jQuery("#" + playit.globals.accordionIdList[i]).accordion("resize");
                    }
                }, 500);
            }
        }
        else
        {
            jQuery(document.createElement('link')).attr({
                href: themeUrl,
                id: "playit-jquery-ui-css",
                media: 'screen',
                type: 'text/css',
                rel: 'stylesheet'
            }).appendTo('head');
        }
    };
    var switchView = function (newView)
    {
        _currentCategory.set_currentView(newView);
        buildCategoryHtml(_currentCategory.get_id());
    };
    var buildContainerHtml = function ()
    {
        // setup the ie thumbbar
        _this.ieThumbBar._build();

        var html = "";
        var filesView = "<div id='" + controlIds.filesViewId + "'  class='playit-files-content ui-widget-content ui-corner-all'></div>"
        var audioCtrls = "<div id='" + controlIds.audioPanelId + "' class='playit-audio-panel ui-widget-content ui-corner-all'></div>";
        var linkIframe = "<div id='" + controlIds.linkIframeId + "' class='playit-link-iframe ui-widget-content ui-corner-all'></div><div class='playit-link-iframe-drag' style='display:none;'></div>"
        var loadingView = "<div id='" + controlIds.filesLoadingId + "' style='display:none;'>" + getBusyHtml() + "</div>";

        html += "<div id='" + controlIds.audioInfoDialogId + "'  class='playit-audio-info-dialog'></div>" +
				"<div id='" + controlIds.videoDialogId + "' class='playit-video-dialog'></div>" +
				"<div id='" + controlIds.imageDialog + "'   class='playit-image-dialog'></div>" +
				"<div id='" + controlIds.allContentId + "'	class='playit-all'>" +
				"<div id='" + controlIds.toolBarId + "'		class='playit-toolbar ui-state-active ui-corner-all'></div>" +
					"<div class='playit-main-table'>" +
					"<div class='playit-main-table-left'><div id='" + controlIds.navigationId + "' class='playit-nav'></div></div>" +
					"<div class='playit-main-table-right'><div id='" + controlIds.mainAreaId + "'  class='playit-main-area'>" + linkIframe + loadingView + filesView + audioCtrls + "</div></div>" +
					"</div>" +
				"</div>";

        // add the browser as a class for css support
        var browserCssName = "playit-browser-" + playit.utils.getBrowserType();
        if (!_htmlContainer.hasClass(browserCssName))
        {
            _htmlContainer.addClass(browserCssName);
        }

        var browserSubCssName = "playit-browser-" + playit.utils.getBrowserSubType();
        if (!_htmlContainer.hasClass(browserSubCssName))
        {
            _htmlContainer.addClass(browserSubCssName);
        }

        _htmlContainer.html(html);

        buildToolBar();
        buildAccordion();
        _this.audio._buildAudioPlayer();

        //Trigger default click for Section/Category isdefault attribute
        jQuery('#' + _activeSectionId).trigger('click');
        jQuery(".playit-main-table-left").resizable(
		{
		    handles: 'e',
		    helper: "ui-resizable-helper",
		    minWidth: _opts.accordionMinWidth,
		    maxWidth: _opts.accordionMaxWidth,
		    start: function (event)
		    {
		        _isResizingContent = true;

		        var $iFrame = jGet(controlIds.linkIframeId);
		        if ($iFrame.css("display") != "none")
		        {
		            jQuery(".playit-link-iframe-drag").css("display", "block");
		        }
		    },
		    stop: function (event, ui)
		    {
		        _isResizingContent = false;

		        var $iFrame = jGet(controlIds.linkIframeId);
		        if ($iFrame.css("display") != "none")
		        {
		            jQuery(".playit-link-iframe-drag").css("display", "none");
		        }

		        resizeContent(ui.size.width);
		        onNavigationResize();

		        jQuery(".playit-main-table-left").height("100%");
		    }
		});

        var $divider = jQuery("div.playit-main-table div.ui-resizable-handle");
        $divider.addClass("playit-accordion-grip");

        onWindowResize();
        jQuery(window).resize(function () { onWindowResize(); });
    };
    var buildToolBar = function ()
    {
        var html = "<table border='0' class='playit-toolbar-search-container'><tr>";
        if (_opts.toolbarShowSearch)
        {
            html += "<td class='playit-toolbar-search-cell playit-toolbar-search-cell1'>";
            html += "<div id='" + controlIds.searchBarId + "' class='playit-search-content'>";
            html += "<input id='" + controlIds.searchId + "' type='text' class='playit-search-text' value='" + _opts.toolbarSearchText + "' />";
            html += "<div id='" + controlIds.searchClearId + "' class='playit-search-clear'><a href='javascript:void(0);' title='" + playit.lang.Clear + "'></a></div>";
            html += "</div>";
            html += "</td>";
        }
        else
        {
            html += "<td></td>";
        }

        html += "<td class='playit-toolbar-title-cell playit-toolbar-search-cell2'>" + _opts.toolbarTitle + "</td>" +
		 "<td class='playit-toolbar-btns-cell playit-toolbar-search-cell3'>" +
			 "<span id='" + controlIds.switchBtnsId + "' >" +
				"<input type='radio' id='" + controlIds.gridBtnId + "' name='repeat' /><label for='" + controlIds.gridBtnId + "'>" + playit.lang.Grid + "</label>" +
				"<input type='radio' id='" + controlIds.listBtnId + "' name='repeat' /><label for='" + controlIds.listBtnId + "'>" + playit.lang.List + "</label>" +
				"<input type='radio' id='" + controlIds.tileBtnId + "' name='repeat' /><label for='" + controlIds.tileBtnId + "'>" + playit.lang.Tile + "</label> &nbsp; &nbsp; " +
			"</span>" +
		 "</td>" +
		 "</tr></table>";

        jQuery('#' + controlIds.toolBarId).html(html);
        jQuery("#" + controlIds.switchBtnsId).buttonset();

        jQuery("#" + controlIds.gridBtnId).button({ text: true, icons: { primary: "ui-icon-calculator"} }).click(function () { switchView(playit.view.grid); });
        jQuery("#" + controlIds.listBtnId).button({ text: true, icons: { primary: "ui-icon-grip-solid-horizontal"} }).click(function () { switchView(playit.view.list); });
        jQuery("#" + controlIds.tileBtnId).button({ text: true, icons: { primary: "ui-icon-grip-dotted-horizontal"} }).click(function () { switchView(playit.view.tile); });

    };
    var buildAccordion = function ()
    {
        var html = "<div id='" + controlIds.accordionId + "' class='playit-nav-accordion'>";

        //SECTIONS
        for (var i = 0; i < _sections.length; i++)
        {
            var sec = _sections[i];
            var secId = sec.get_id();
            var secEleId = "playit-nav-accordion-sec" + secId;
            html += "<h3 id='" + secEleId + "' secid='" + secId + "'><a href='#'>" + sec.get_name() + "</a></h3>";
            html += "<div>" + getBusyHtml(true) + "</div>";

            if (i == 0 || sec.get_isDefault())
            {
                _activeSectionId = secEleId;
            }
        }

        html += "</div>";

        jQuery('#' + controlIds.navigationId).html(html);

        //Construct the jQuery Hooks
        _accordion = jQuery("#" + controlIds.accordionId).accordion({
            fillSpace: true,
            animated: _opts.accordionAnimate,
            active: _activeSectionId,
            changestart: buildAccordionContent
        });

        // bind the search
        jQuery("#" + controlIds.searchId).focus(function () { if (this.value == _opts.toolbarSearchText) { this.value = ""; jQuery(this).addClass('playit-search-text-active'); } });
        jQuery("#" + controlIds.searchId).keyup(function () { updateSearch(this.value); });
        jQuery("#" + controlIds.searchId).blur(function () { if (this.value == "") { this.value = _opts.toolbarSearchText; jQuery(this).removeClass('playit-search-text-active'); } updateSearch(this.value); });
        jQuery("#" + controlIds.searchClearId).find("a").click(function () { clearSearch(); });

        // store the accordion id for switching themes
        playit.globals.accordionIdList.push(controlIds.accordionId);
    };
    var buildAccordionContent = function (event, ui)
    {
        var secId = jQuery(ui.newHeader).attr("secid");
        var $newContent = jQuery(ui.newContent);
        var selectCat = (_currentSection == null || _opts.accordionAutoSelect);
        _currentSection = _getSectionById(secId);
        var secEleId = "playit-nav-accordion-sec" + _currentSection.get_id();
        var categoriesLoaded = (_currentSection["playit_categories"] != null);

        if (!categoriesLoaded)
        {
            _data._getCategoriesAsync(_currentSection, function (categories)
            {
                var html = "";

                for (var catIndex = 0; catIndex < categories.length; catIndex++)
                {
                    var cat = categories[catIndex];
                    var catEleId = secEleId + "-cat" + cat.get_id();
                    var catType = cat.get_type();

                    if (catType == "separator")
                    {
                        html += "<hr />";
                    }
                    else
                    {
                        if (catIndex == 0 || cat.get_isDefault() == true)
                        {
                            _activeCategoryId = catEleId;
                        }

                        html += "<a href='javascript:void(0);' id='" + catEleId + "' catid='" + cat.get_id() + "' name='cat' class='playit-nav-link'>" + cat.get_name() + "</a>";
                    }
                }

                $newContent.html(html);

                //Bind Category Links
                jQuery("a.playit-nav-link").click(function () { onCategoryClick(this) });

                if (selectCat && _activeCategoryId)
                {
                    jQuery('#' + _activeCategoryId).trigger('click');
                }
            });
        }
        else if (selectCat)
        {
            _activeCategoryId = _currentSection.get_currentCategory();
            if (_activeCategoryId == null)
            {
                var categories = _data._getCategories(_currentSection);
                if (categories)
                {
                    for (var catIndex = 0; catIndex < categories.length; catIndex++)
                    {
                        var cat = categories[catIndex];
                        var catEleId = secEleId + "-cat" + cat.get_id();

                        if (catIndex == 0 || cat.get_isDefault() == true)
                        {
                            _activeCategoryId = catEleId;
                        }
                    }
                }
            }

            if (selectCat && _activeCategoryId)
            {
                jQuery('#' + _activeCategoryId).trigger('click');
            }
        }
    }
    var buildCategoryHtml = function (id)
    {
        //Don't remove use to validate call stack
        //console.log(arguments.callee.caller.toString());

        _currentCategory = _getCategoryById(id);
        _this.ieThumbBar.hide();

        if (_currentCategory)
        {
            if (_currentCategory.get_type() == playit.type.audio)
            {
                _this.ieThumbBar.show();
            }

            setViewStates();
            var currentView = _currentCategory.get_currentView();

            //Category Link-Set Only
            if (currentView == playit.view.link)
            {
                createCategoryIframe(_currentCategory);
            }
            else
            {
                showBusy();

                setTimeout(function ()
                {
                    _data._getCategoryMediaFilesAsync(_currentCategory, function (files)
                    {
                        jQuery("#" + controlIds.linkIframeId).hide();
                        jQuery("#" + controlIds.filesViewId).show();

                        switch (currentView)
                        {
                            //GRID LOOP                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                            case playit.view.grid:

                                var files = sortGenericFiles(files);

                                switch (_currentCategory.get_type())
                                {
                                    case playit.type.audio: createGridCommonView(files); break;
                                    case playit.type.image: createGridCommonView(files); break;
                                    case playit.type.link: createGridLinkView(files); break;
                                    case playit.type.video: createGridCommonView(files); break;
                                }
                                break;

                            //LIST LOOP                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                            case playit.view.list:

                                var files = sortGenericFiles(files);

                                switch (_currentCategory.get_type())
                                {
                                    case playit.type.audio: createListAudioView(files); break;
                                    case playit.type.image: createListCommonView(files); break;
                                    case playit.type.link: createListCommonView(files); break;
                                    case playit.type.video: createListCommonView(files); break;
                                }
                                break;

                            //TILE LOOP:                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                            case playit.view.tile:
                                //Sorting is perfomed in View   
                                switch (_currentCategory.get_type())
                                {
                                    case playit.type.audio: createTileAudioView(files); break;
                                    case playit.type.image: createTileCommonView(files); break;
                                    case playit.type.link: createTileCommonView(files); break;
                                    case playit.type.video: createTileCommonView(files); break;
                                }
                                break;

                            //NO VIEW SET                                                                                                                                                                                                                                                                                                                                             
                            default:
                                showConfigMessage(playit.lang.msg_no_views_enabled);
                                break;
                        }

                        switch (_currentCategory.get_type())
                        {
                            //AUDIO                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                            case playit.type.audio:
                                _this.audio._toggleAudioPanel(true);
                                jQuery("#" + controlIds.filesViewId).show().height(_controlHeight - 113);

                                // reset the active audio section
                                _this.audio._resetActive();

                                if (_opts.audioAutoPlay)
                                {
                                    _this.audio.play(true);
                                }
                                break;

                            //IMAGE                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                            case playit.type.image:
                                //LINK
                            case playit.type.link:
                                //VIDEO
                            case playit.type.video:
                                _this.audio._toggleAudioPanel(false);
                                jQuery("#" + controlIds.filesViewId).show().height(_controlHeight - 23);
                                break;
                        }

                        hideBusy();
                    });
                }, 0);
            }
        }

    };
    var createCategoryIframe = function (category)
    {
        _this.audio._toggleAudioPanel(false);
        jQuery("#" + controlIds.filesViewId).hide();
        jQuery("#" + controlIds.linkIframeId).show();

        var contentSize = getContentSize();

        //ie8 requires the capital 'B' in frameBorder
        if (_isiOS && _opts.iOSIframeAsObject)
        {
            var iframe = document.createElement("object");
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", (contentSize.height - 20));
            iframe.setAttribute("type", "text/html");
            iframe.setAttribute("data", category.get_linkSrc());
            iframe.setAttribute("class", "playit-link-iframe ui-corner-all");
            jQuery("#" + controlIds.linkIframeId).html(iframe);

            if (_opts.iOSIframeAsObjectLink && category.get_linkiOSIframeAsObjectLink())
            {
                var msg = document.createElement("a");
                msg.className = "playit-link-iframe-iosmsg";
                msg.innerHTML = playit.lang.msg_ios_full_page;
                msg.target = "_blank";
                msg.href = category.get_linkSrc();
                jQuery("#" + controlIds.linkIframeId).append(msg);
            }
        }
        else
        {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("scrolling", category.get_linkScroll());
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("frameBorder", "0");
            iframe.setAttribute("height", (contentSize.height - 20));
            iframe.setAttribute("src", category.get_linkSrc());
            iframe.setAttribute("class", "playit-link-iframe ui-corner-all");
            jQuery("#" + controlIds.linkIframeId).html(iframe);
        }
    };
    var showBusy = function ()
    {
        jQuery("#" + controlIds.filesLoadingId).show();
    };
    var hideBusy = function ()
    {
        jQuery("#" + controlIds.filesLoadingId).hide();
    };
    var getBusyHtml = function (excludeText)
    {
        var html = "<div class='playit-loading-content'><div class='playit-loading-content-data'><div class='playit-loading-content-data-img'><img src='" + _opts.loadingIconSource + "' /></div>";

        if (!excludeText)
        {
            html += "<div class='playit-loading-content-data-txt'>" + playit.lang.Loading_dots + "</div>";
        }

        html += "</div></div>";

        return html;
    };
    var jGet = function (id)
    {
        return jQuery("#" + id);
    };
    //#endregion


    //========================================================================
    //Data Source
    //========================================================================
    //#region Data Source Routines
    var _data = {

        //#region Data Methods
        _getSectionsAsync: function (onComplete)
        {
            if (_sections == null)
            {
                _dataSource.getSectionsAsync(function (sections)
                {
                    _sections = sections;
                    onComplete(_sections);
                });
            }
            else
            {
                onComplete(_sections);
            }
        },
        _getCategoriesAsync: function (section, onComplete)
        {
            var categories = section["playit_categories"];
            if (categories == null)
            {
                _dataSource.getCategoriesAsync(section, function (categories)
                {
                    section["playit_categories"] = categories;
                    onComplete(categories);
                });
            }
            else
            {
                onComplete(categories);
            }
        },
        _getCategories: function (section)
        {
            return section["playit_categories"];
        },
        _getCategoryMediaFilesAsync: function (category, onComplete)
        {
            var mediaFiles = category["playit_mediaFiles"];
            if (mediaFiles == null)
            {
                _dataSource.getCategoryMediaFilesAsync(category, function (mediaFiles)
                {
                    category["playit_mediaFiles"] = mediaFiles;
                    onComplete(mediaFiles);
                });
            }
            else
            {
                onComplete(mediaFiles);
            }
        },
        _getCategoryMediaFiles: function (category)
        {
            return category["playit_mediaFiles"];
        },
        _getCategoryAudioAlbums: function (category)
        {
            var audioAlbums = category["playit_audioAlbums"];

            if (audioAlbums == null)
            {
                audioAlbums = [];
                var albums = {};
                var files = category["playit_mediaFiles"];

                for (var i = 0; i < files.length; i++)
                {
                    var albumId = files[i].get_albumId();
                    var cachedAlbum = albums[albumId];

                    if (cachedAlbum == null)
                    {
                        var audioAlbum = new playit.audioAlbum();
                        audioAlbum.init(albumId);
                        audioAlbums.push(audioAlbum);
                        albums[albumId] = cachedAlbum = audioAlbum;
                    }

                    cachedAlbum.addTrack(files[i]);
                }

                category["playit_audioAlbums"] = audioAlbums;
            }

            return audioAlbums;
        },
        _getCategoryGridDefinition: function (category)
        {
            var def = category["playit_gridDef"];

            if (!def)
            {
                category["playit_gridDef"] = def = _dataSource.getCategoryGridDefinition(category);
            }

            return def;
        },
        _getCategoryListDefinition: function (category)
        {
            var def = category["playit_listDef"];

            if (!def)
            {
                category["playit_listDef"] = def = _dataSource.getCategoryListDefinition(category);

            }

            return def;
        },
        _getCategoryTileDefinition: function (category)
        {
            var def = category["playit_tileDef"];

            if (!def)
            {
                category["playit_tileDef"] = def = _dataSource.getCategoryTileDefinition(category);
            }

            return def;
        },
        _getCategorySort: function (category)
        {
            var currentView = _currentCategory.get_currentView();
            var sort = category["playit_sort_" + currentView];

            if (sort == null)
            {
                // get the default sort
                var def;
                var sortCol;
                var sortDir;

                switch (currentView)
                {
                    case playit.view.grid: def = _data._getCategoryGridDefinition(_currentCategory); break;
                    case playit.view.list: def = _data._getCategoryListDefinition(_currentCategory); break;
                    default: break;
                }

                if (def)
                {
                    sortCol = def.sortColumn;
                    sortDir = def.sortDirection;
                }
                category["playit_sort_" + currentView] = sort = { column: sortCol, direction: sortDir };
            }

            return sort || { column: null, direction: "asc" };
        },
        _setCategorySort: function (category, column, direction)
        {
            var sort = _data._getCategorySort(category);

            if (column)
            {
                sort.column = column;
            }

            if (direction)
            {
                sort.direction = direction;
            }

            return sort;
        }
        //#endregion

    };
    //#endregion


    //========================================================================
    //PUBLIC METHODS
    //========================================================================	
    //#region Public Methods
    this.init = function (container)
    {
        _htmlContainer = container;

        _htmlContainer.html(getBusyHtml());

        _dataSource = new _opts.dataSource(_this, _opts.dataSourceOptions);
        _data._getSectionsAsync(function (sections)
        {
            if (_opts.themeUseCDN)
            {
                setTheme(_opts.themeName, _opts.themeVersion);
                // allow the theme to download
                setTimeout(function ()
                {
                    buildContainerHtml();
                    onRenderComplete();
                }, 250);
            }
            else
            {
                buildContainerHtml();
                onRenderComplete();
            }
        });
    };
    this.applyTheme = function (theme, version)
    {
        /// <summary>
        /// Sets the theme to the google cdn theme file.
        /// </summary>

        setTheme(theme, version);
    };
    this.get_options = function ()
    {
        /// <summary>
        /// Returns the playit options.
        /// </summary>

        return _opts;
    };
    this.set_options = function (opts)
    {
        _opts = opts;
    };
    this.get_controlIds = function ()
    {
        return controlIds;
    };
    this.get_currentView = function ()
    {
        return _currentCategory.get_currentView();
    };
    this.reload = function ()
    {
        buildContainerHtml();
        onRenderComplete();
    };
    //#endregion
};

//========================================================================
//ENTITY MODLES
//========================================================================	
//#region Entity Models
playit.view = 
{
	none: 0,
    grid: 1,
    list: 2,
    tile: 3,
	link: 4
};
playit.type = 
{
	empty: 0,
	separator: 1,
    audio: 2,
    video: 3,
    image: 4,
    link: 5
	//data: 6,
	//map: 7
};

playit.log = 
{
	msg: function (type, errMsg)
    {
        //ERROR, WARNING, DEBUG, MESSAGE
        if (typeof(console) != "undefined" && console)
        {
            var message = "PLAYIT-" + type + ": " + errMsg;
            console.log(message);
        }
    }
}

playit.section = function ()
{
    //#region Private Fields
    var getPropertyFunc;
    var setPropertyFunc;
    //#endregion

    //#region Public Properties
    this.get_currentCategory = function()
    {
        return this["currentCategory"];
    };
    this.set_currentCategory = function(val)
    {
        this["currentCategory"] = val;
    };
    this.get_id = function ()
    {
        return this.getProperty("id");
    };
    this.set_id = function (val)
    {
        this.setProperty("id", val);
    };
    this.get_name = function ()
    {
        return this.getProperty("name");
    };
    this.set_name = function (val)
    {
        this.setProperty("name", val);
    };
    this.get_isDefault = function ()
    {
        return (this.getProperty("isDefault") || false);
    };
    this.set_isDefault = function (val)
    {
        this.setProperty("isDefault", val);
    };
    this.set_getProperty = function (func)
    {
        getPropertyFunc = func;
    }
    this.set_setProperty = function (func)
    {
        setPropertyFunc = func;
    }
    //#endregion

    //#region Public Methods
    this.getProperty = function (propName)
    {
        var propVal;

        if (getPropertyFunc)
        {
            propVal = getPropertyFunc(this, propName);
        }
        else
        {
            propVal = this[propName];
        }

        return propVal;
    };
    this.setProperty = function (propName, val)
    {
        var propVal;

        if (setPropertyFunc)
        {
            setPropertyFunc(this, propName, val);
        }
        else
        {
            this[propName] = val;
        }

        return propVal;
    };
    //#endregion
};
playit.category = function ()
{
    //#region Private Fields
    var currentView;
    var getPropertyFunc;
    var setPropertyFunc;
    //#endregion

    //#region Public Properties
    this.get_currentView = function ()
    {
        return currentView;
    };
    this.set_currentView = function (val)
    {
        currentView = val;
    };
    this.get_id = function ()
    {
        return this.getProperty("id");
    };
    this.set_id = function (val)
    {
        this.setProperty("id", val);
    };
    this.get_type = function ()
    {
        return this.getProperty("type");
    };
    this.set_type = function (val)
    {
        this.setProperty("type", val);
    };
    this.get_name = function ()
    {
        return this.getProperty("name");
    };
    this.set_name = function (val)
    {
        this.setProperty("name", val);
    };
    this.get_linkSrc = function ()
    {
        return this.getProperty("linkSrc");
    };
    this.set_linkSrc = function (val)
    {
        this.setProperty("linkSrc", val);
    };
    this.get_linkScroll = function ()
    {
        return this.getProperty("linkScroll");
    };
    this.set_linkScroll = function (val)
    {
        this.setProperty("linkScroll", val);
    };
    this.get_linkiOSIframeAsObjectLink = function ()
    {
        return playit.utils.parseBool(this.getProperty("linkiOSIframeAsObjectLink"), true);
    };
    this.set_linkiOSIframeAsObjectLink = function (val)
    {
        this.setProperty("linkiOSIframeAsObjectLink", val);
    };
    this.get_isDefault = function ()
    {
        return (this.getProperty("isDefault") || false);
    };
    this.set_isDefault = function (val)
    {
        this.setProperty("isDefault", val);
    };
    this.get_viewDefault = function ()
    {
        return (this.getProperty("viewDefault") || null);
    };
    this.set_viewDefault = function (val)
    {
        this.setProperty("viewDefault", val);
    };
    this.get_tileItemSize = function ()
    {
        return (this.getProperty("tileItemSize") || null);
    };
    this.set_tileItemSize = function (val)
    {
        this.setProperty("tileItemSize", val);
    };
    this.set_getProperty = function (func)
    {
        getPropertyFunc = func;
    }
    this.set_setProperty = function (func)
    {
        setPropertyFunc = func;
    }
    //#endregion

    //#region Public Methods
    this.getProperty = function (propName)
    {
        var propVal;

        if (getPropertyFunc)
        {
            propVal = getPropertyFunc(this, propName);
        }
        else
        {
            propVal = this[propName];
        }

        return propVal;
    };
    this.setProperty = function (propName, val)
    {
        var propVal;

        if (setPropertyFunc)
        {
            setPropertyFunc(this, propName, val);
        }
        else
        {
            this[propName] = val;
        }

        return propVal;
    };
    //#endregion
};
playit.field = function ()
{
    //#region Private Fields
    var getPropertyFunc;
    var setPropertyFunc;
    //#endregion

    //#region Public Properties
    this.get_id = function ()
    {
        return this.getProperty("id");
    };
    this.set_id = function (val)
    {
        this.setProperty("id", val);
    };
    this.get_match = function ()
    {
        return this.getProperty("match");
    };
    this.set_match = function (val)
    {
        this.setProperty("match", val);
    };
    this.get_display = function ()
    {
        return this.getProperty("display");
    };
    this.set_display = function (val)
    {
        this.setProperty("display", val);
    };
    this.get_sortDisplay = function ()
    {
        return this.getProperty("sortDisplay");
    };
    this.set_sortDisplay = function (val)
    {
        this.setProperty("sortDisplay", val);
    };
    this.get_width = function ()
    {
        return this.getProperty("width");
    };
    this.set_width = function (val)
    {
        this.getProperty("width", val);
    };
    this.set_getProperty = function (func)
    {
        getPropertyFunc = func;
    }
    this.set_setProperty = function (func)
    {
        setPropertyFunc = func;
    }
    //#endregion

    //#region Public Methods
    this.getProperty = function (propName)
    {
        var propVal;

        if (getPropertyFunc)
        {
            propVal = getPropertyFunc(this, propName);
        }
        else
        {
            propVal = this[propName];
        }

        return propVal;
    };
    this.setProperty = function (propName, val)
    {
        var propVal;

        if (setPropertyFunc)
        {
            setPropertyFunc(this, propName, val);
        }
        else
        {
            this[propName] = val;
        }

        return propVal;
    };
    //#endregion
}
playit.audioAlbum = function ()
{
	var id;
	var tracks = [];
	var album;
	var artist;
	
	this.get_id = function ()
    {
        return id;
    };
	
	this.addTrack = function (file)
    {
        tracks.push(file);
		album = file.get_album();
		artist = file.get_artist();
    };
    this.get_tracks = function ()
    {
		tracks.sort(function sortTracks(file1,file2) {	return file1.get_track() - file2.get_track(); });
        return tracks;
    };	
	this.get_album = function ()
    {
		return album;
    };
	this.get_artist = function ()
    {
		return artist;
    };	
	this.get_trackByIndexId = function (id)
    {
        return (tracks) ? tracks[id] : null;
    };	
	
	//#region Public Methods
    this.init = function (albumId)
    {
		id = albumId;
	}
	//#endregion
}
playit.audioFile = function ()
{
    //#region Fields
    var type = playit.type.audio;
    var getPropertyFunc;
    var setPropertyFunc;
    //#endregion

    //#region Public Properties
    this.get_type = function ()
    {
        return type;
    };
    this.get_defaultImage = function ()
    {
        return "notes-256.png";
    };
    this.get_albumId = function ()
    {
        return (this.get_artist() + "-" + this.get_album());
    };
    this.get_album = function ()
    {
        return (this.getProperty("album") || "");
    };
    this.set_album = function (val)
    {
        this.setProperty("album", val);
    };
    this.get_artist = function ()
    {
        return this.getProperty("artist");
    };
    this.set_artist = function (val)
    {
        this.setProperty("artist", val);
    };
    this.get_catId = function ()
    {
        return this.getProperty("catId");
    };
    this.set_catId = function (val)
    {
        this.setProperty("catId", val);
    };
    this.get_id = function ()
    {
        return this.getProperty("id");
    };
    this.set_id = function (val)
    {
        this.setProperty("id", val);
    };
    this.get_info = function ()
    {
        return (this.getProperty("info") || "");
    };
    this.set_info = function (val)
    {
        this.setProperty("info", val);
    };
    this.get_infoEnable = function ()
    {
        var infoShow = this.getProperty("infoEnable");

        if (infoShow != null && typeof (infoShow) != "boolean")
        {
            infoShow = playit.utils.parseBool(infoShow, true);
        }

        if (infoShow == null)
        {
            infoShow = true;
        }

        return infoShow;
    };
    this.set_infoEnable = function (val)
    {
        this.setProperty("infoEnable", val);
    };
    this.get_poster = function ()
    {
        return this.getProperty("poster");
    };
    this.set_poster = function (val)
    {
        this.setProperty("poster", val);
    };
    this.get_src = function ()
    {
        return this.getProperty("src");
    };
    this.set_src = function (val)
    {
        this.setProperty("src", val);
    };
    this.get_thumb = function ()
    {
        return (this.getProperty("thumb") || "");
    };
    this.set_thumb = function (val)
    {
        this.setProperty("thumb", val);
    };
    this.get_title = function ()
    {
        return (this.getProperty("title") || "");
    };
    this.set_title = function (val)
    {
        this.setProperty("title", val);
    };
    this.get_track = function ()
    {
        return (this.getProperty("track") || "");
    };
    this.set_track = function (val)
    {
        this.setProperty("track", val);
    };
    this.set_getProperty = function (func)
    {
        getPropertyFunc = func;
    }
    this.set_setProperty = function (func)
    {
        setPropertyFunc = func;
    }
    //#endregion

    //#region Public Methods
    this.getProperty = function (propName)
    {
        var propVal;

        if (getPropertyFunc)
        {
            propVal = getPropertyFunc(this, propName);
        }
        else
        {
            propVal = this[propName];
        }

        return propVal;
    };
    this.setProperty = function (propName, val)
    {
        var propVal;

        if (setPropertyFunc)
        {
            setPropertyFunc(this, propName, val);
        }
        else
        {
            this[propName] = val;
        }

        return propVal;
    };
    //#endregion
};
playit.imageFile = function ()
{
    //#region Fields
    var type = playit.type.image;
    var getPropertyFunc;
    var setPropertyFunc;
    //#endregion

    //#region Public Properties
    this.get_type = function ()
    {
        return type;
    };
    this.get_defaultImage = function ()
    {
        return "images-256.png";
    };
    this.get_catId = function ()
    {
        return this.getProperty("catId");
    };
    this.set_catId = function (val)
    {
        this.setProperty("catId", val);
    };
    this.get_height = function ()
    {
        return playit.utils.parseInt(this.getProperty("height"), 0);
    };
    this.set_height = function (val)
    {
        this.setProperty("height", val);
    };
    this.get_info = function ()
    {
        return (this.getProperty("info") || "");
    };
    this.set_info = function (val)
    {
        this.setProperty("info", val);
    };
    this.get_infoEnable = function ()
    {
        var infoShow = this.getProperty("infoEnable");

        if (infoShow != null && typeof (infoShow) != "boolean")
        {
            infoShow = playit.utils.parseBool(infoShow, true);
        }

        if (infoShow == null)
        {
            infoShow = true;
        }

        return infoShow;
    };
    this.set_infoEnable = function (val)
    {
        this.setProperty("infoEnable", val);
    };
    this.get_id = function ()
    {
        return this.getProperty("id");
    };
    this.set_id = function (val)
    {
        this.setProperty("id", val);
    };
    this.get_poster = function ()
    {
        return this.getProperty("poster");
    };
    this.set_poster = function (val)
    {
        this.setProperty("poster", val);
    };
    this.get_src = function ()
    {
        return this.getProperty("src");
    };
    this.set_src = function (val)
    {
        this.setProperty("src", val);
    };
    this.get_title = function ()
    {
        return (this.getProperty("title") || "");
    };
    this.set_title = function (val)
    {
        this.setProperty("title", val);
    };
    this.get_thumb = function ()
    {
        return (this.getProperty("thumb") || "");
    };
    this.set_thumb = function (val)
    {
        this.setProperty("thumb", val);
    };
    this.get_width = function ()
    {
        return playit.utils.parseInt(this.getProperty("width"), 0);
    };
    this.set_width = function (val)
    {
        this.setProperty("width", val);
    };
    this.set_getProperty = function (func)
    {
        getPropertyFunc = func;
    }
    this.set_setProperty = function (func)
    {
        setPropertyFunc = func;
    }
    //#endregion

    //#region Public Methods
    this.getProperty = function (propName)
    {
        var propVal;

        if (getPropertyFunc)
        {
            propVal = getPropertyFunc(this, propName);
        }
        else
        {
            propVal = this[propName];
        }

        return propVal;
    };
    this.setProperty = function (propName, val)
    {
        var propVal;

        if (setPropertyFunc)
        {
            setPropertyFunc(this, propName, val);
        }
        else
        {
            this[propName] = val;
        }

        return propVal;
    };
    //#endregion
};
playit.linkFile = function ()
{
    //#region Fields
    var type = playit.type.link;
    var getPropertyFunc;
    var setPropertyFunc;
    //#endregion

    //#region Public Properties
    this.get_type = function ()
    {
        return type;
    };
    this.get_defaultImage = function ()
    {
        return "links-256.png";
    };
    this.get_catId = function ()
    {
        return this.getProperty("catId");
    };
    this.set_catId = function (val)
    {
        this.setProperty("catId", val);
    };
    this.get_features = function ()
    {
        return (this.getProperty("features") || "");
    };
    this.set_features = function (val)
    {
        this.setProperty("features", val);
    };
    this.get_id = function ()
    {
        return this.getProperty("id");
    };
    this.set_id = function (val)
    {
        this.setProperty("id", val);
    };
    this.get_info = function ()
    {
        return (this.getProperty("info") || "");
    };
    this.set_info = function (val)
    {
        this.setProperty("info", val);
    };
    this.get_infoEnable = function ()
    {
        var infoShow = this.getProperty("infoEnable");

        if (infoShow != null && typeof (infoShow) != "boolean")
        {
            infoShow = playit.utils.parseBool(infoShow, true);
        }

        if (infoShow == null)
        {
            infoShow = true;
        }

        return infoShow;
    };
    this.set_infoEnable = function (val)
    {
        this.setProperty("infoEnable", val);
    };
    this.get_poster = function ()
    {
        return this.getProperty("poster");
    };
    this.set_poster = function (val)
    {
        this.setProperty("poster", val);
    };
    this.get_src = function ()
    {
        return (this.getProperty("src") || "");
    };
    this.set_src = function (val)
    {
        this.setProperty("src", val);
    };
    this.get_target = function ()
    {
        return (this.getProperty("target") || "_blank");
    };
    this.set_target = function (val)
    {
        this.setProperty("target", val);
    };
    this.get_title = function ()
    {
        return (this.getProperty("title") || "");
    };
    this.set_title = function (val)
    {
        this.setProperty("title", val);
    };
    this.get_thumb = function ()
    {
        return (this.getProperty("thumb") || "");
    };
    this.set_thumb = function (val)
    {
        this.setProperty("thumb", val);
    };
    this.set_getProperty = function (func)
    {
        getPropertyFunc = func;
    }
    this.set_setProperty = function (func)
    {
        setPropertyFunc = func;
    }
    //#endregion

    //#region Public Methods
    this.getProperty = function (propName)
    {
        var propVal;

        if (getPropertyFunc)
        {
            propVal = getPropertyFunc(this, propName);
        }
        else
        {
            propVal = this[propName];
        }

        return propVal;
    };
    this.setProperty = function (propName, val)
    {
        var propVal;

        if (setPropertyFunc)
        {
            setPropertyFunc(this, propName, val);
        }
        else
        {
            this[propName] = val;
        }

        return propVal;
    };
    //#endregion
};
playit.videoFile = function ()
{
    //#region Fields
    var type = playit.type.video;
    var getPropertyFunc;
    var setPropertyFunc;
    //#endregion

    //#region Public Properties
    this.get_type = function ()
    {
        return type;
    };
    this.get_defaultImage = function ()
    {
        return "videos-256.png";
    };
    this.get_catId = function ()
    {
        return this.getProperty("catId");
    };
    this.set_catId = function (val)
    {
        this.setProperty("catId", val);
    };
    this.get_height = function ()
    {
        return playit.utils.parseInt(this.getProperty("height"), 0);
    };
    this.set_height = function (val)
    {
        this.setProperty("height", val);
    };
    this.get_player = function ()
    {
        return (this.getProperty("player") || "local");
    };
    this.set_player = function (val)
    {
        this.setProperty("player", val);
    };
    this.get_id = function ()
    {
        return this.getProperty("id");
    };
    this.set_id = function (val)
    {
        this.setProperty("id", val);
    };
    this.get_info = function ()
    {
        return (this.getProperty("info") || "");
    };
    this.set_info = function (val)
    {
        this.setProperty("info", val);
    };
    this.get_infoEnable = function ()
    {
        var infoShow = this.getProperty("infoEnable");

        if (infoShow != null && typeof (infoShow) != "boolean")
        {
            infoShow = playit.utils.parseBool(infoShow, true);
        }

        if (infoShow == null)
        {
            infoShow = true;
        }

        return infoShow;
    };
    this.set_infoEnable = function (val)
    {
        this.setProperty("infoEnable", val);
    };	
    this.get_poster = function ()
    {
        return this.getProperty("poster");
    };
    this.set_poster = function (val)
    {
        this.setProperty("poster", val);
    };
    this.get_sources = function ()
    {
        return (this.getProperty("sources") || []);
    };
    this.set_sources = function (val)
    {
        this.setProperty("sources", val);
    };
    this.get_src = function ()
    {
        return this.getProperty("src");
    };
    this.set_src = function (val)
    {
        this.setProperty("src", val);
    };
    this.get_title = function ()
    {
        return (this.getProperty("title") || "");
    };
    this.set_title = function (val)
    {
        this.setProperty("title", val);
    };
    this.get_thumb = function ()
    {
        return (this.getProperty("thumb") || "");
    };
    this.set_thumb = function (val)
    {
        this.setProperty("thumb", val);
    };
    this.get_width = function ()
    {
        return playit.utils.parseInt(this.getProperty("width"), 0);
    };
    this.set_width = function (val)
    {
        this.setProperty("width", val);
    };
    this.set_getProperty = function (func)
    {
        getPropertyFunc = func;
    }
    this.set_setProperty = function (func)
    {
        setPropertyFunc = func;
    }
    //#endregion

    //#region Public Methods
    this.getProperty = function (propName)
    {
        var propVal;

        if (getPropertyFunc)
        {
            propVal = getPropertyFunc(this, propName);
        }
        else
        {
            propVal = this[propName];
        }

        return propVal;
    };
    this.setProperty = function (propName, val)
    {
        var propVal;

        if (setPropertyFunc)
        {
            setPropertyFunc(this, propName, val);
        }
        else
        {
            this[propName] = val;
        }

        return propVal;
    };
    //#endregion
};
//#endregion

//#region Data Sources
playit.xmlDataSource = function (playitObj, options)
{
    //#region Private Fields
    var _playIt = playitObj;
    var _opts = playitObj.get_options();
    var _xml;
    var _sections;
    var _genSecId = 0;
    var _genCatId = 0;
    var _genFileId = 0;
    var _dataSourceOpts = {
        xmlConfig: "jquery.playit.xml",
        cacheXml: true
    };
    _dataSourceOpts = jQuery.extend({}, _dataSourceOpts, options);
    //#endregion

    //#region Private Methods
    var _loadXml = function (xml)
    {
        _sections = [];
        _xml = xml;
        _loadOptionsFromXml(jQuery("playit", xml));

        //  the xml to objects
        jQuery(xml).find('section').each(function (index)
        {
            // parse the _sections
            var $secEle = jQuery(this);
            var sec = new playit.section();
            _initSection(sec, $secEle, _genSecId);
            _sections.push(sec);
            _genSecId++;
        });
    };
    var _loadOptionsFromXml = function (playitNode)
    {
        //_opts are preloaded by the global defaults see above
        _opts.accordionAnimate = playit.utils.parseBool(playitNode.attr("accordion-animate"), _opts.accordionAnimate);
        _opts.accordionAutoSelect = playit.utils.parseBool(playitNode.attr("accordion-autoselect"), _opts.accordionAutoSelect);
        _opts.accordionMinWidth = playit.utils.parseInt(playitNode.attr("accordion-minwidth"), _opts.accordionMinWidth);
        _opts.accordionMaxWidth = playit.utils.parseInt(playitNode.attr("accordion-maxwidth"), _opts.accordionMaxWidth);
        _opts.loadingIconSource = playitNode.attr("loading-icon-source") || _opts.loadingIconSource;
        _opts.iOSIframeAsObject = playit.utils.parseBool(playitNode.attr("ios-iframeasobject"), _opts.iOSIframeAsObject);
        _opts.iOSIframeAsObjectLink = playit.utils.parseBool(playitNode.attr("ios-iframeasobjectlink"), _opts.iOSIframeAsObjectLink);

        _opts.toolbarTitle = playitNode.attr("toolbar-title") || _opts.toolbarTitle;
        _opts.toolbarShowSearch = playit.utils.parseBool(playitNode.attr("toolbar-showsearch"), _opts.toolbarShowSearch);
        _opts.toolbarSearchText = playitNode.attr("toolbar-searchtext") || _opts.toolbarSearchText;
        _opts.toolbarSearchWidth = playit.utils.parseInt(playitNode.attr("toolbar-searchwidth"), _opts.toolbarSearchWidth);

        _opts.themeUseCDN = playit.utils.parseBool(playitNode.attr("theme-usecdn"), _opts.themeUseCDN);
        _opts.themeName = playitNode.attr("theme-name") || _opts.themeName;
        _opts.themeVersion = playitNode.attr("theme-version") || _opts.themeVersion;
        _opts.themeUrl = playitNode.attr("theme-url") || _opts.themeUrl;
        _opts.viewDefault = (playitNode.attr("view-default") || _opts.viewDefault).toLowerCase();
        _opts.autoFill = playit.utils.parseBool(playitNode.attr("autofill"), _opts.autoFill);

        //AUDIO	
        _opts.audioAutoPlay = playit.utils.parseBool(playitNode.attr("audio-autoplay"), _opts.audioAutoPlay);
        _opts.audioInfoEnable = playit.utils.parseBool(playitNode.attr("audio-info-enable"), _opts.audioInfoEnable);
        _opts.audioInfoBoxHeight = playit.utils.parseInt(playitNode.attr("audio-infobox-height"), _opts.audioInfoBoxHeight);
        _opts.audioInfoBoxWidth = playit.utils.parseInt(playitNode.attr("audio-infobox-width"), _opts.audioInfoBoxWidth);
        _opts.audioInfoBoxModal = playit.utils.parseBool(playitNode.attr("audio-infobox-modal"), _opts.audioInfoBoxModal);
        _opts.audioInfoBoxResizable = playit.utils.parseBool(playitNode.attr("audio-infobox-resizable"), _opts.audioInfoBoxResizable);

        //IMAGE
        _opts.imageAutoPlay = playit.utils.parseBool(playitNode.attr("image-autoplay"), _opts.imageAutoPlay);
        _opts.imageSlidesInterval = playit.utils.parseInt(playitNode.attr("image-slides-interval"), _opts.imageSlidesInterval);
        _opts.imageSlidesThumbCount = playit.utils.parseInt(playitNode.attr("image-slides-thumbcount"), _opts.imageSlidesThumbCount);
        _opts.imageInfoEnable = playit.utils.parseBool(playitNode.attr("image-info-enable"), _opts.imageInfoEnable);
        _opts.imageDialogHeight = playit.utils.parseInt(playitNode.attr("image-dialog-height"), _opts.imageDialogHeight);
        _opts.imageDialogWidth = playit.utils.parseInt(playitNode.attr("image-dialog-width"), _opts.imageDialogWidth);

        //VIDEO
        _opts.videoAutoPlay = playit.utils.parseBool(playitNode.attr("video-autoplay"), _opts.videoAutoPlay);
        _opts.videoNavBarEnable = playit.utils.parseBool(playitNode.attr("video-navbar-enable"), _opts.videoNavBarEnable);
        _opts.videoInfoEnable = playit.utils.parseBool(playitNode.attr("video-info-enable"), _opts.videoInfoEnable);
        _opts.videoDialogHeight = playit.utils.parseInt(playitNode.attr("video-dialog-height"), _opts.videoDialogHeight);
        _opts.videoDialogWidth = playit.utils.parseInt(playitNode.attr("video-dialog-width"), _opts.videoDialogWidth);

        _playIt.set_options(_opts);
    };
    var _initSection = function (section, xmlNode, index)
    {
        section.setProperty("xmlNode", xmlNode);
        section.set_getProperty(_getProperty);
        section.set_id(xmlNode.attr("id") || index);
        section.set_name(xmlNode.attr("name") || "");
        section.set_isDefault(xmlNode.attr("isdefault") == "true");
    };
    var _initCategory = function (category, xmlNode, index, type)
    {
        category.set_getProperty(_getProperty);
        category.setProperty("xmlNode", xmlNode);
        category.set_type(type);
        category.set_id(xmlNode.attr("id") || index);
        category.set_name(xmlNode.attr("name"));
        category.set_isDefault(xmlNode.attr("isdefault") == "true");
        category.set_linkSrc(xmlNode.attr("link-src"));
        category.set_linkScroll(xmlNode.attr("link-scroll") || "auto");
        category.set_linkiOSIframeAsObjectLink(playit.utils.parseBool(xmlNode.attr("link-iosiframeasobjectlink"), true));
        category.set_viewDefault(xmlNode.attr("view-default"));
    };
    var _initField = function (field, xmlNode, index)
    {
        field.set_getProperty(_getProperty);
        field.setProperty("xmlNode", xmlNode);
        field.set_id(xmlNode.attr("id") || index);
        field.set_match(xmlNode.attr("match"));
        field.set_display(xmlNode.attr("display"));
        field.set_sortDisplay(xmlNode.attr("sort-display"));
        field.set_width(xmlNode.attr("width"));
    };
    var _initMediaFile = function (file, xmlNode, index, categoryId)
    {
        file.set_getProperty(_getProperty);
        file.setProperty("xmlNode", xmlNode);
        file.set_id(xmlNode.attr("id") || index);
        file.set_catId(categoryId);
        var infoText = (xmlNode.children("info").text() || "");
        file.set_infoEnable(playit.utils.parseBool(xmlNode.attr("info-enable"), (infoText.length > 0)));
        file.set_info(infoText);

        if (file.get_type() == playit.type.video)
        {
            var sources = [];

            xmlNode.find('source').each(function (index)
            {
                var sourceEle = jQuery(this);
                sources.push({ src: sourceEle.attr("src"), type: sourceEle.attr("type") });
            });

            file.set_sources(sources);
        }
    };
    var _getProperty = function (entity, propName)
    {
        var propVal = entity[propName];

        if (propVal == null)
        {
            entity[propName] = propVal = entity["xmlNode"].attr(propName);
        }

        return propVal;
    };
    //#endregion

    //#region Public Methods
    this.getSectionsAsync = function (onCompleted)
    {
        jQuery.ajax({
            cache: _dataSourceOpts.cacheXml,
            type: "GET",
            url: _dataSourceOpts.xmlConfig,
            dataType: "xml",
            success: function (xml) { _loadXml(xml); onCompleted(_sections); },
            error: function () { alert("Failed to load the xml file."); }
        });
    };
    this.getCategoriesAsync = function (section, onCompleted)
    {
        var categories = [];
        var $secEle = section.getProperty("xmlNode");

        // AUDIO SET
        $secEle.find('category').each(function ()
        {
            var $this = jQuery(this);
            var cat = new playit.category();
            var type = $this.attr("type") || null;
            var catName = $this.attr("name") || "MISSING NAME";
            var type;

            //Missing Typeset
            if (type == null)
            {
                playit.log.msg("WARNING", "Missing 'type' attribute on '" + catName + "' category node!");
                return false;
            }

            switch (type.toLowerCase())
            {
                case "audio":
                    type = playit.type.audio;
                    break;
                case "image":
                    type = playit.type.image;
                    break;
                case "link":
                    type = playit.type.link;
                    break;
                case "video":
                    type = playit.type.video;
                    break;
            }

            _initCategory(cat, jQuery(this), _genCatId, type);
            categories.push(cat);
            _genCatId++;
        });

        onCompleted(categories);
    };
    this.getCategoryMediaFilesAsync = function (category, onCompleted)
    {
        var mediaFiles = [];
        var $catXml = category["xmlNode"];
        var catId = category.get_id();
        var fileObj;
        var tagName;

        switch (category.get_type())
        {
            case playit.type.audio:
                fileObj = playit.audioFile;
                tagName = "audio";
                break;
            case playit.type.image:
                fileObj = playit.imageFile;
                tagName = "img";
                break;
            case playit.type.link:
                fileObj = playit.linkFile;
                tagName = "link";
                break;
            case playit.type.video:
                fileObj = playit.videoFile;
                tagName = "video";
                break;
        }

        $catXml.children(tagName).each(function ()
        {
            var file = new fileObj();
            _initMediaFile(file, jQuery(this), _genFileId, catId);
            file.set_getProperty(_getProperty);

            mediaFiles.push(file);
            _genFileId++;
        });

        onCompleted(mediaFiles);
    };
    this.getCategoryGridDefinition = function (category)
    {
        var gridFields = [];
        var xmlNode = category["xmlNode"];
        var gridNode = xmlNode.find('grid');
        var enable = playit.utils.parseBool(gridNode.attr("enable"), true);
        var sortDir;
        var sortCol;

        gridNode.children('fields').each(function (index)
        {
            var fieldsEle = jQuery(this);
            sortDir = (fieldsEle.attr("sort-direction") || "asc");
            sortCol = fieldsEle.attr("sort-column");

            fieldsEle.find('field').each(function (index)
            {
                var fieldEle = jQuery(this);
                var field = new playit.field();
                _initField(field, fieldEle, index);
                gridFields.push(field);
            });
        });

        return { fields: gridFields, enable: enable, sortColumn: sortCol, sortDirection: sortDir };
    };
    this.getCategoryListDefinition = function (category)
    {
        var listFields = [];
        var xmlNode = category["xmlNode"];
        var listNode = xmlNode.find('list');
        var enable = playit.utils.parseBool(listNode.attr("enable"), true);
        var sortDir;
        var sortCol;

        listNode.children('fields').each(function (index)
        {
            var fieldsEle = jQuery(this);
            sortDir = (fieldsEle.attr("sort-direction") || "asc");
            sortCol = fieldsEle.attr("sort-column");

            fieldsEle.find('field').each(function (index)
            {
                var fieldEle = jQuery(this);
                var field = new playit.field();
                _initField(field, fieldEle, index);
                listFields.push(field);
            });
        });

        return { fields: listFields, enable: enable, sortColumn: sortCol, sortDirection: sortDir };
    };
    this.getCategoryTileDefinition = function (category)
    {
        var listFields = [];
        var xmlNode = category["xmlNode"];
        var tileNode = xmlNode.find('tile');
        var enable = playit.utils.parseBool(tileNode.attr("enable"), true);
        var itemSize = playit.utils.parseInt(tileNode.attr("item-size"), 64);

        return { fields: null, enable: enable, itemSize: itemSize, sortColumn: null, sortDirection: null };
    };
    //#endregion
}
playit.webServiceDataSource = function (playitObj, options)
{
    //#region Private Fields
    var _playIt = playitObj;
    var _opts = playitObj.get_options();
    var _dataSourceOpts = {
        baseUrl: "Service.asmx",
        getSectionsMethodName: "GetSections",
        getCategoriesMethodName: "GetCategories",
        getMediaFilesMethodName: "GetMediaFiles",
        gridDefinition: null,
        listDefinition: null,
        tileDefinition: null
    };
    _dataSourceOpts = jQuery.extend({}, _dataSourceOpts, options);
    //#endregion

    //#region Private Methods
    var _convertObjects = function (objects, toType, onObjectCreated)
    {
        var newObjects = [];

        for (var i = 0; i < objects.length; i++)
        {
            var obj = objects[i];
            var newObj = new toType();
            newObj.setProperty("orgObj", obj);

            for (var prop in obj)
            {
                newObj.setProperty(prop, obj[prop]);
            }

            if (onObjectCreated)
            {
                onObjectCreated(newObj, obj);
            }

            newObjects.push(newObj);
        }

        return newObjects;
    };
    var _handleRequestFailure = function (status)
    {
        alert("Web service request failed.\r\n" + status.status + "\r\n" + status.statusText + "\r\n" + status.responseText);
    };
    var _handleGetSectionsSuccess = function (data, status)
    {
        // convert the sections to the playit type
        return _convertObjects(data.d, playit.section);
    };
    var _handleGetCategoriesSuccess = function (data, status)
    {
        // convert the categories to the playit type
        return _convertObjects(data.d, playit.category);
    };
    var _handleGetMediaFilesSuccess = function (category, data, status)
    {
        var type;

        switch (category.get_type())
        {
            case playit.type.audio:
                type = playit.audioFile;
                break;
            case playit.type.image:
                type = playit.imageFile;
                break;
            case playit.type.video:
                type = playit.videoFile;
                break;
        }

        var onObjectCreated = function (newObj, obj)
        {
            newObj.set_catId(category.get_id());
        };

        // convert the files to the playit type
        return _convertObjects(data.d, type, onObjectCreated);
    };
    //#endregion

    //#region Public Methods
    this.getSectionsAsync = function (onCompleted)
    {
        jQuery.ajax({
            cache: false,
            type: "POST",
            url: _dataSourceOpts.baseUrl + "/" + _dataSourceOpts.getSectionsMethodName,
            data: "{}",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data, status) { onCompleted(_handleGetSectionsSuccess(data, status)); },
            error: _handleRequestFailure
        });
    };
    this.getCategoriesAsync = function (section, onCompleted)
    {
        jQuery.ajax({
            cache: false,
            type: "POST",
            url: _dataSourceOpts.baseUrl + "/" + _dataSourceOpts.getCategoriesMethodName,
            data: "{ sectionId: '" + section.get_id() + "' }",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data, status) { onCompleted(_handleGetCategoriesSuccess(data, status)); },
            error: _handleRequestFailure
        });
    };
    this.getCategoryMediaFilesAsync = function (category, onCompleted)
    {
        jQuery.ajax({
            cache: false,
            type: "POST",
            url: _dataSourceOpts.baseUrl + "/" + _dataSourceOpts.getMediaFilesMethodName,
            data: "{ categoryId: '" + category.get_id() + "' }",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data, status) { onCompleted(_handleGetMediaFilesSuccess(category, data, status)); },
            error: _handleRequestFailure
        });
    };
    this.getCategoryGridDefinition = function (category)
    {
        var def;

        if (typeof (_dataSourceOpts.gridDefinition) == "function")
        {
            def = _dataSourceOpts.gridDefinition(category);
        }
        else
        {
            def = _dataSourceOpts.gridDefinition;
        }

        return def;
    };
    this.getCategoryListDefinition = function (category)
    {
        var def;

        if (typeof (_dataSourceOpts.listDefinition) == "function")
        {
            def = _dataSourceOpts.listDefinition(category);
        }
        else
        {
            def = _dataSourceOpts.listDefinition;
        }

        return def;
    };
    this.getCategoryTileDefinition = function (category)
    {
        var def;

        if (typeof (_dataSourceOpts.tileDefinition) == "function")
        {
            def = _dataSourceOpts.tileDefinition(category);
        }
        else
        {
            def = _dataSourceOpts.tileDefinition;
        }

        return def;
    };
    //#endregion
}
playit.testDataSource = function (playitObj, options)
{
    //#region Private Fields
    var _playIt = playitObj;
    var _opts = playitObj.get_options();
    //#endregion

    //#region Public Methods
    this.getSectionsAsync = function (onCompleted)
    {
        var sections = [];

        for (var i = 0; i < 10; i++)
        {
            var sec = new playit.section();
            sec.set_id(i);
            sec.set_name("Section " + i);
            sections.push(sec);
        }

        onCompleted(sections);
    };
    this.getCategoriesAsync = function (section, onCompleted)
    {
        var categories = [];
        var catId = section.get_id();

        for (var c = 0; c < 20; c++)
        {
            var cat = new playit.category();
            cat.set_id(c);
            cat.set_name("Section " + catId + " Category " + c);
            cat.set_type(playit.type.video);
            categories.push(cat);
        }

        onCompleted(categories);
    };
    this.getCategoryMediaFilesAsync = function (category, onCompleted)
    {
        var files = [];

        for (var i = 0; i < 50; i++)
        {
            var file = new playit.videoFile();
            file.set_id(i);
            file.set_title("File " + i + " from Category " + category.get_id());
            file["random"] = "Random Col " + i + " from Category " + category.get_id();
            files.push(file);
        }

        onCompleted(files);
    };
    this.getCategoryGridDefinition = function (category)
    {
        var fields = [];

        var field = new playit.field();
        field.set_id(0);
        field.set_display("Test Title");
        field.set_match("title");
        fields.push(field);

        field = new playit.field();
        field.set_id(1);
        field.set_display("Random");
        field.set_match("random");
        fields.push(field);

        return { fields : fields, enable : true, sortColumn: "random", sortDirection: "desc" };
    };
    this.getCategoryListDefinition = function (category)
    {
        var fields = [];

        var field = new playit.field();
        field.set_id(0);
        field.set_display("Title: ");
        field.set_match("title");
        fields.push(field);

        field = new playit.field();
        field.set_id(1);
        field.set_display("Random: ");
        field.set_match("random");
        fields.push(field);

        return { fields : fields, enable : true, sortColumn: "random", sortDirection: "desc" };
    };
    this.getCategoryTileDefinition = function (category)
    {
        return { fields : null, enable : true, itemSize: 64, sortColumn: null, sortDirection: null };
    };
    //#endregion
}
playit.flickrDataSource = function (playitObj, options)
{
    //#region Private Fields
    var _playIt = playitObj;
    var _opts = playitObj.get_options();
    var _dataSourceOpts = {
        apiKey: "",
        userId: "",
        title: "My Flickr Stream",
        gridDefinition: null,
        listDefinition: null,
        tileDefinition: null
    };
    _dataSourceOpts = jQuery.extend({}, _dataSourceOpts, options);
    //#endregion

    //#region Private Methods
    var _validateFlickrParams = function ()
    {
        if (_dataSourceOpts.apiKey == null || _dataSourceOpts.apiKey.length == 0)
        {
            throw "The Flickr API key is missing";
        }

        if (_dataSourceOpts.userId == null || _dataSourceOpts.userId.length == 0)
        {
            throw "The Flickr User ID is missing";
        }
    };
    var _handleRequestFailure = function (status)
    {
        alert("Flickr request failed.\r\n" + status.status + "\r\n" + status.statusText + "\r\n" + status.responseText);
    };
    var _handleGetCategoriesSuccess = function (data, status)
    {
        var categories = [];

        jQuery.each(data.photosets.photoset, function (i, set)
        {
            var cat = new playit.category();
            cat.set_id(set.id);
            cat.set_name(set.title._content);
            cat.set_type(playit.type.image);
            categories.push(cat);
        });

        return categories;
    };
    var _handleGetMediaFilesSuccess = function (category, data, status)
    {
        var files = [];

        jQuery.each(data.photoset.photo, function (i, photo)
        {
            var squareUrl = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_s.jpg';
            var mediumUrl = squareUrl.replace("_s.jpg", "_m.jpg");
            var largeUrl = squareUrl.replace("_s.jpg", "_b.jpg");

            var file = new playit.imageFile();
            file.set_id(photo.id);
            file.set_catId(category.get_id());
            file.set_title(photo.title);
            file.set_thumb(squareUrl);
            file.set_poster(mediumUrl);
            file.set_src(largeUrl);
            files.push(file);
        });

        return files;
    };
    //#endregion

    //#region Public Methods
    this.getSectionsAsync = function (onCompleted)
    {
        _validateFlickrParams();

        var sections = [];

        var sec = new playit.section();
        sec.set_id("Flickr");
        sec.set_name(_dataSourceOpts.title);
        sections.push(sec);

        onCompleted(sections);
    };
    this.getCategoriesAsync = function (section, onCompleted)
    {
        _validateFlickrParams();

        jQuery.ajax({
            cache: false,
            type: "POST",
            url: "http://api.flickr.com/services/rest/?&method=flickr.photosets.getList&api_key=" + _dataSourceOpts.apiKey + "&user_id=" + _dataSourceOpts.userId + "&format=json&jsoncallback=?",
            data: {},
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data, status) { onCompleted(_handleGetCategoriesSuccess(data, status)); },
            error: _handleRequestFailure
        });
    };
    this.getCategoryMediaFilesAsync = function (category, onCompleted)
    {
        _validateFlickrParams();

        jQuery.ajax({
            cache: false,
            type: "POST",
            url: "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=" + _dataSourceOpts.apiKey + "&user_id=" + _dataSourceOpts.userId + "&photoset_id=" + category.get_id() + "&format=json&jsoncallback=?",
            data: {},
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data, status) { onCompleted(_handleGetMediaFilesSuccess(category, data, status)); },
            error: _handleRequestFailure
        });
    };
    this.getCategoryGridDefinition = function (category)
    {
        var def;

        if (typeof (_dataSourceOpts.gridDefinition) == "function")
        {
            def = _dataSourceOpts.gridDefinition(category);
        }
        else
        {
            def = _dataSourceOpts.gridDefinition;
        }

        if (def == null)
        {
            var fields = [];

            var field = new playit.field();
            field.set_id(0);
            field.set_display("Title");
            field.set_match("title");
            fields.push(field);

            def = { fields: fields, enable: true, sortColumn: "title", sortDirection: "asc" };
        }

        return def;
    };
    this.getCategoryListDefinition = function (category)
    {
        var def;

        if (typeof (_dataSourceOpts.listDefinition) == "function")
        {
            def = _dataSourceOpts.listDefinition(category);
        }
        else
        {
            def = _dataSourceOpts.listDefinition;
        }

        if (def == null)
        {
            var fields = [];

            var field = new playit.field();
            field.set_id(0);
            field.set_display("");
            field.set_match("title");
            fields.push(field);

            def = { fields: fields, enable: true, sortColumn: "title", sortDirection: "asc" };
        }

        return def;
    };
    this.getCategoryTileDefinition = function (category)
    {
        var def;

        if (typeof (_dataSourceOpts.tileDefinition) == "function")
        {
            def = _dataSourceOpts.tileDefinition(category);
        }
        else
        {
            def = _dataSourceOpts.tileDefinition;
        }

        if (def == null)
        {
            def = { fields: null, enable: true, itemSize: 64, sortColumn: null, sortDirection: null };
        }

        return def;
    };
    //#endregion
}
//#endregion

//#region Utils
playit.utils = {
    parseBool: function (val, defaultVal)
    {
        var newVal = defaultVal;

        if (typeof (val) == "boolean")
        {
            newVal = val;
        }
        else if (val && val.length > 0)
        {
            newVal = (val.toLowerCase() == "true" ? true : false);
        }

        return newVal;
    },
    parseInt: function (val, defaultVal)
    {
        var newVal = defaultVal;

        if (val && val.length > 0)
        {
            var parsedVal = parseInt(val);
            if (!isNaN(parsedVal))
            {
                newVal = parsedVal;
            }
        }

        return newVal;
    },
    escapeHTML: function (str)
    {
        var div = document.createElement('div');
        var text = document.createTextNode(str);
        div.appendChild(text);
        return div.innerHTML;
    },
    //useage: sprintf('One: %s, Two: %s', 1, 2)
    sprintf: function (format, etc)
    {
        var arg = arguments;
        var i = 1;
        return format.replace(/%((%)|s)/g, function (m) { return m[2] || arg[i++] })
    },
    progressBarMove: function (id, interval, onComplete)
    {
        var bar = jQuery('#' + id);
        var timeout = (interval / 100);

        //Move the progress value
        var handle = setInterval(function ()
        {
            var pVal = bar.progressbar('option', 'value');
            var pCnt = pVal + 1;
            bar.progressbar({ value: pCnt });

            if (pCnt >= 100)
            {
                onComplete();
            }

        }, timeout);

        return handle;
    },
    getEnumByName: function (enumObj, name)
    {
        var val = null;
        jQuery.each(enumObj, function (index, value)
        {
            if (index.toString() == name)
            {
                val = value;
                return;
            }
        });
        return val;
    },
    randQueryString: function (url)
    {
        return (url == null || url.indexOf("?") == -1 ? "?" : "&") + "r=" + Math.floor(Math.random() * 10000) + "&d=" + (new Date()).getTime();
    },
    getBrowserType: function ()
    {
        var browserName = "unknown";

        if (jQuery.browser.webkit)
        {
            browserName = "webkit";
        }
        else if (jQuery.browser.opera)
        {
            browserName = "opera";
        }
        else if (jQuery.browser.msie)
        {
            browserName = "ie";
        }
        else if (jQuery.browser.mozilla)
        {
            browserName = "mozilla";
        }

        return browserName;
    },
    getBrowserSubType: function ()
    {
        var browserName = "unknown";

        if (jQuery.browser.webkit)
        {
            browserName = "webkit";

            if (navigator.userAgent.match(/iPad/i))
            {
                browserName = "webkit-ipad";
            }
            else if (navigator.userAgent.match(/iPod/i))
            {
                browserName = "webkit-ipod";
            }
            else if (navigator.userAgent.match(/iPhone/i))
            {
                browserName = "webkit-iphone";
            }
        }
        else if (jQuery.browser.opera)
        {
            browserName = "opera";
        }
        else if (jQuery.browser.msie)
        {
            browserName = "ie" + jQuery.browser.version.split(".", 1)[0];
        }
        else if (jQuery.browser.mozilla)
        {
            browserName = "mozilla";
        }

        return browserName;
    }
};
//#endregion

//#region Localization
playit.lang = {
	//STRING MATCHES
	Album: "Album",
	Artist: "Artist",
	Back: "Back",
	Clear:"Clear",
	Grid: "Grid",
	List: "List",
	Loop: "Loop",
	Mute: "Mute",
	Now_Showing_dots: "Now Showing...",
	Previous: "Previous",
	Previous_Group: "Previous Group",
	Previous_Image: "Previous Image",
	Next: "Next",
	Next_Group: "Next Group",
	Next_Image: "Next Image",
	Play: "Play",
	Pause: "Pause",
	Shuffle: "Shuffle",
	Tile: "Tile",
	Title: "Title",
	Sort_By: "Sort By",
	Unknown_Artist: "Unknown Artist",
	Unkonwn_Album: "Unknown Album",
	Volume: "Volume",
	Loading_dots: "Loading...",
	
	//OBJECTS
	obj_audio_info: "Now Playing...",
	obj_image_info: "Now Showing...",
	obj_video_info: "Video Info..",
	
	//MESSAGES
	msg_nosearch_results:"No results found for '%s' in %s.",
	msg_select_to_play: "Please select an item to play!",
	msg_no_playback: "No video playback capabilities",
	msg_no_views_enabled: "No views enabled for this category",
    msg_ios_full_page: "To view the full page click here."
}
//#endregion

playit.globals = {
    lastId: 0,
    accordionIdList: [],
	dynamicAlbumKey: 0
};

(function(jQuery)
{
    jQuery.fn.playit = function(action, options)
    {
        // iterate and reformat each matched element
        return this.each(function()
        {
            action = (action || {});
            options = (options || {});

            if (typeof (action) == 'object')
            {
                options = action;
                action = 'initialize';
            }

            $this = jQuery(this);
            if (!this.playit)
            {
                this.playit = new playit(options);
                this.playit.init($this);
            }

            switch(action.toLowerCase())
            {
                case "audio-back":
                    this.playit.audio.back();
                    break;
                case "audio-forward":
                    this.playit.audio.forward();
                    break;
                case "audio-shuffle":
                    this.playit.audio.shuffle();
                    break;
                case "audio-play":
                    this.playit.audio.play();
                    break;
                case "audio-pause":
                    this.playit.audio.pause();
                    break;
                case "audio-toggleplay":
                    this.playit.audio.togglePlay();
                    break;
                case "audio-togglemute":
                    this.playit.audio.toggleMute();
                    break;
                case "audio-toggleshuffle":
                    this.playit.audio.toggleShuffle();
                    break;
                case "audio-toggleloop":
                    this.playit.audio.toggleLoop();
                    break;
                case "image-back":
                    this.playit.image.back();
                    break;
                case "image-forward":
                    this.playit.image.forward();
                    break;
                case "image-backgroup":
                    this.playit.image.backGroup();
                    break;
                case "image-forwardgroup":
                    this.playit.image.forwardGroup();
                    break;
                case "image-play":
                    this.playit.image.play();
                    break;
                case "image-pause":
                    this.playit.image.pause();
                    break;
                case "image-toggleplay":
                    this.playit.image.togglePlay();
                    break;
                case "initialize":
                default:
                    break;
            }
        });
    };
})(jQuery);
//EOF ALERT-MESSAGE
