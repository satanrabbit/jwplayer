import { Features } from 'environment/environment';
import { isAndroidHls } from 'providers/html5-android-hls';
import { isYouTube, isRtmp } from 'utils/validator';
import video from 'utils/video';

const MimeTypes = {
    aac: 'audio/mp4',
    mp4: 'video/mp4',
    f4v: 'video/mp4',
    m4v: 'video/mp4',
    mov: 'video/mp4',
    mp3: 'audio/mpeg',
    mpeg: 'audio/mpeg',
    ogv: 'video/ogg',
    ogg: 'video/ogg',
    oga: 'video/ogg',
    vorbis: 'video/ogg',
    webm: 'video/webm',
    // The following are not expected to work in Chrome
    f4a: 'video/aac',
    m3u8: 'application/vnd.apple.mpegurl',
    m3u: 'application/vnd.apple.mpegurl',
    hls: 'application/vnd.apple.mpegurl'
};

const SupportsMatrix = [
    {
        name: 'youtube',
        supports: function (source) {
            return (isYouTube(source.file, source.type));
        }
    },
    {
        name: 'html5',
        supports: function (source) {
            const isAndroidHLS = isAndroidHls(source);
            if (isAndroidHLS !== null) {
                return isAndroidHLS;
            }

            if (!video.canPlayType) {
                return false;
            }

            const file = source.file;
            const type = source.type;

            // Ensure RTMP files are not seen as videos
            if (isRtmp(file, type)) {
                return false;
            }

            const mimeType = source.mimeType || MimeTypes[type];

            // Not OK to use HTML5 with no extension
            if (!mimeType) {
                return false;
            }

            // Last, but not least, we ask the browser
            // (But only if it's a video with an extension known to work in HTML5)
            return !!video.canPlayType(mimeType);
        }
    },
    {
        name: 'flash',
        supports: function (source) {
            if (!Features.flash) {
                return false;
            }

            const file = source.file;
            const type = source.type;

            if (isRtmp(file, type)) {
                return true;
            }

            return ([
                'flv',
                'f4v',
                'mov',
                'm4a',
                'm4v',
                'mp4',
                'aac',
                'f4a',
                'mp3',
                'mpeg',
                'smil'
            ]).indexOf(type) > -1;
        }
    }
];

export default SupportsMatrix;
