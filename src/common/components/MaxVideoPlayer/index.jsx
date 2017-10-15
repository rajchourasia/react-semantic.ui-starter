// styles
import 'video.js/dist/video-js.min.css'

import React from 'react'
import PropTypes from 'prop-types'
import videojs from 'video.js'
import 'videojs-playlist'
import 'videojs-hotkeys'

/* Props Description:
//
// videpPlaylist: array of sources
// otherProps: all other videojs settings.
//
// Example:
//
// import VideoPlayer from './VideoPlayer'
// const videoPlaylist = [{
// 	sources: [{
// 		src: require('videos/one.mp4'),
// 		type: 'video/mp4'
// 	}],
//  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
// }, {
// 	sources: [{
// 		src: require('videos/two.mp4'),
// 		type: 'video/mp4'
// 	}],
//  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
// }, {
// 	sources: [{
// 		src: require('videos/three.mp4'),
// 		type: 'video/mp4'
// 	}],
//  poster: 'http://media.w3.org/2010/05/bunny/poster.png'
// }]
//
// const videoJsOptions = {
// 	autoplay: true,
// 	controls: true,
// 	videoPlaylist
// }
//
// Then call
// <MaxVideoPlayer { ...videoJsOptions } />
*/
export default class MaxVideoPlayer extends React.Component {
	static propTypes = {
		videoPlaylist: PropTypes.array
	}

	componentDidMount () {
		const { videoPlaylist, ...otherProps } = this.props
		const Button = videojs.getComponent('Button')
		const player = videojs(this.videoNode, otherProps, function onPlayerReady () {
			// Handle hot keyps.
			this.hotkeys({
				volumeStep: 0.1,
				enableVolumeScroll: false,
				enableNumbers: false,
				enableModifiersForNumbers: false,
				alwaysCaptureHotkeys: true,
				rewindKey: function (event, player) {
					if (event.which === 37) {
						player.playlist.previous()
						return true
					}
					return false
				},
				forwardKey: function (event, player) {
					if (event.which === 39) {
						player.playlist.next()
						return true
					}
					return false
				}
			})
		})

		player.playlist(videoPlaylist)

		// Play through the playlist automatically.
		player.playlist.autoadvance(0)

		// Event before video in playlist is changed.
		player.on('beforeplaylistitem', function () {
			console.log(player.playlist.currentItem())
		})

		// Event after video in playlist is changed.
		player.on('playlistitem', function () {
			console.log(player.playlist.currentItem())
		})

		// Extend default
		const PrevButton = videojs.extend(Button, {
			// constructor: function(player, options) {
			constructor: function () {
				Button.apply(this, arguments)
				// this.addClass('vjs-chapters-button');
				this.addClass('icon-angle-left')
				this.controlText('Previous')
			},

			// constructor: function() {
			//   Button.apply(this, arguments);
			//   this.addClass('vjs-play-control vjs-control vjs-button vjs-paused');
			// },

			// createEl: function() {
			//   return Button.prototype.createEl('button', {
			//     //className: 'vjs-next-button vjs-control vjs-button',
			//     //innerHTML: 'Next >'
			//   });
			// },

			handleClick: function () {
				player.playlist.previous()
			}
		})
		// Extend default
		var NextButton = videojs.extend(Button, {
			// constructor: function(player, options) {
			constructor: function () {
				Button.apply(this, arguments)
				// this.addClass('vjs-chapters-button');
				this.addClass('icon-angle-right')
				this.controlText('Next')
			},

			handleClick: function () {
				player.playlist.next()
			}
		})
		// Register the new component
		videojs.registerComponent('NextButton', NextButton)
		videojs.registerComponent('PrevButton', PrevButton)

		player.getChild('controlBar').addChild('PrevButton', {}, 0)
		player.getChild('controlBar').addChild('NextButton', {}, 2)
		// Play through the playlist automatically.
		// player.playlist.autoadvance(0)
		// instantiate video.js
		this.player = player
	}

	// destroy player on unmount
	componentWillUnmount () {
		if (this.player) {
			this.player.dispose()
		}
	}

	// wrap the player in a div with a `data-vjs-player` attribute
	// so videojs won't create additional wrapper in the DOM
	// see https://github.com/videojs/video.js/pull/3856
	render () {
		return (
			<div data-vjs-player>
				<video style={{width: '100%'}} ref={ node => (this.videoNode = node) } className="video-js"></video>
			</div>
		)
	}
}
